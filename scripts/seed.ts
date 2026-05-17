/**
 * Local seed script — runs the full pipeline without Vercel timeout limits.
 * Usage: npx tsx scripts/seed.ts
 *
 * Reads .env.local for credentials, writes results directly to Supabase.
 */

import "dotenv/config"
import { resolve } from "path"
import { config } from "dotenv"

// Load .env.local (Next.js convention)
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"
import { getFinancialSnapshot, formatFinancialsForPrompt } from "../lib/sec/client"

// ── Clients ────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FMP_BASE  = "https://financialmodelingprep.com/stable"
const FMP_KEY   = process.env.FMP_API_KEY ?? ""

// ── FMP ────────────────────────────────────────────────────────────────────

interface FMPProfile {
  symbol: string; companyName: string; price: number; marketCap: number
  beta: number; exchange: string; industry: string; website: string
  description: string; ceo: string; sector: string; fullTimeEmployees: string
  ipoDate: string; isActivelyTrading: boolean; cik?: string | null
}

async function getProfile(ticker: string): Promise<FMPProfile | null> {
  try {
    const url = `${FMP_BASE}/profile?symbol=${ticker}&apikey=${FMP_KEY}`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    if (data?.["Error Message"] || typeof data === "string") return null
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch { return null }
}

// ── Google News ────────────────────────────────────────────────────────────

interface NewsArticle { title: string; summary: string; url: string; source: string; publishedAt: string }

async function fetchNews(ticker: string, name: string): Promise<NewsArticle[]> {
  try {
    const q   = encodeURIComponent(`${ticker} ${name} stock`)
    const url = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const xml  = await res.text()
    const items: NewsArticle[] = []
    const rx   = /<item>([\s\S]*?)<\/item>/g
    let m
    while ((m = rx.exec(xml)) !== null) {
      const b    = m[1]
      const get  = (tag: string) => new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(b)?.[1] ?? ""
      const cdata = (s: string) => /^<!\[CDATA\[([\s\S]*)\]\]>$/.exec(s.trim())?.[1] ?? s
      const title  = cdata(get("title")).trim()
      const link   = get("link").trim()
      const pub    = get("pubDate").trim()
      const source = cdata(get("source")).trim()
      const desc   = cdata(get("description")).replace(/<[^>]+>/g, "").trim()
      if (title && link) items.push({ title, summary: desc.slice(0, 300), url: link, source, publishedAt: pub ? new Date(pub).toISOString() : new Date().toISOString() })
    }
    return items.slice(0, 8)
  } catch { return [] }
}

// ── Discovery ──────────────────────────────────────────────────────────────

const CRITERIA = `
Je bent een expert in future-tech smallcap investing. Genereer een lijst van US-genoteerde bedrijven die voldoen aan ALLE volgende criteria:

MARKT:
- Beursgenoteerd in de VS (NASDAQ, NYSE, NYSE American)
- Market cap tussen $50M en $5B (smallcap tot small-midcap)
- Actief verhandeld (geen zombie stocks)

SECTOR (minimaal één van):
- Space economy: raketten, satellieten, space infrastructure, satellite IoT
- Quantum computing & quantum sensing
- AI-hardware & AI-infrastructure (chips, data centers, edge computing)
- Autonome systemen: drones, robotics, zelfrijdende voertuigen
- Geavanceerde energieopslag: solid-state batteries, next-gen EV tech
- Defense tech & cybersecurity: hypersonics, directed energy, zero-trust
- Photonics & optical computing
- eVTOL & advanced air mobility
- Biotech met platform-technologie (geen pure drug plays)
- Quantum-safe cryptography & post-quantum security

ASYMMETRISCH POTENTIEEL:
- Technologie die potentieel een bestaande markt kan ontwrichten
- Niet al volledig gewaardeerd door de markt (geen $50B+ largecaps)
- Heeft identificeerbare catalysts in de komende 12-18 maanden
- Managementteam met execution track record

UITSLUITINGEN:
- Pure SaaS/software zonder hardware-moat
- Retail, vastgoed, financiële diensten
- Bedrijven zonder duidelijke technologische differentiatie
- Bedrijven met minder dan 12 maanden cash runway
`

async function discover(): Promise<{ ticker: string; rationale: string }[]> {
  console.log("  → Claude genereert kandidaten...")
  const today = new Date().toISOString().split("T")[0]
  const msg = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4000,
    messages: [{ role: "user", content: `Vandaag is het ${today}.\n\n${CRITERIA}\n\nGenereer een lijst van 40-60 bedrijven die aan deze criteria voldoen. Denk breed.\n\nRetourneer UITSLUITEND een JSON array:\n[\n  { "ticker": "RKLB", "rationale": "1 zin" }\n]` }],
  })
  const text = msg.content.find(b => b.type === "text")?.text ?? ""
  const s = text.indexOf("["), e = text.lastIndexOf("]")
  if (s === -1 || e <= s) return []
  try { return JSON.parse(text.slice(s, e + 1)) } catch { return [] }
}

// ── Claude analysis ────────────────────────────────────────────────────────

async function analyze(ticker: string, profile: FMPProfile, news: NewsArticle[], financials: Awaited<ReturnType<typeof getFinancialSnapshot>>) {
  const today    = new Date().toISOString().split("T")[0]
  const newsText = news.length > 0
    ? "\nRecent nieuws:\n" + news.map((n, i) => `${i+1}. [${n.source}] ${n.title}\n   ${n.summary}`).join("\n")
    : "\nGeen recent nieuws."

  const financialsText = financials
    ? "\n" + formatFinancialsForPrompt(financials) + "\n"
    : "\n(Geen SEC-financiële data beschikbaar — gebruik trainingskennis.)\n"

  const psRatio = financials?.revenueAnnual && financials.revenueAnnual > 0
    ? (profile.marketCap / financials.revenueAnnual).toFixed(1)
    : null

  const msg = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2500,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: `Je bent een expert investment analyst in future-tech smallcaps. Vandaag is het ${today}.

Analyseer ${ticker} (${profile.companyName}) op asymmetrisch opwaarts potentieel.

=== MARKTDATA ===
Prijs: $${profile.price} | Market Cap: $${(profile.marketCap/1e9).toFixed(2)}B | P/S: ${psRatio ?? "n/b"}x | Beta: ${profile.beta}
Sector: ${profile.sector} / ${profile.industry} | CEO: ${profile.ceo}
Medewerkers: ${profile.fullTimeEmployees} | Beurs: ${profile.exchange} | IPO: ${profile.ipoDate}

=== BESCHRIJVING ===
${profile.description}
${financialsText}
${newsText}

=== INSTRUCTIES ===
Gebruik de SEC-KERNCIJFERS hierboven als primaire bron voor financiële scores. Combineer met trainingskennis voor kwalitatieve factoren.

Let speciaal op:
- cashRunway: gebruik berekende maanden; < 12 mnd = score ≤ 3, 12-24 mnd = 4-6, > 24 mnd of FCF positief = 7-10
- revenueGrowth: baseer op werkelijke YoY% uit SEC data
- dilutionRisk: verhoog als schuld hoog of cash runway kort
- valuationDiscount: gebruik P/S ratio t.o.v. sectorgenoten

Wees specifiek — noem producten, contracten, klanten bij naam.

Retourneer UITSLUITEND geldig JSON:
{
  "summary": "2-3 zinnen executive summary",
  "asymmetricScore": {
    "total": <0-100>,
    "revenueGrowth": <0-10>, "cashRunway": <0-10>, "tamSize": <0-10>,
    "competitiveAdvantage": <0-10>, "managementQuality": <0-10>,
    "catalystDensity": <0-10>, "shortInterest": <0-10>,
    "dilutionRisk": <0-10>, "sectorTailwind": <0-10>, "valuationDiscount": <0-10>
  },
  "riskLevel": "<low|medium|high|very-high>",
  "bullCase": "2-3 zinnen",
  "bearCase": "2-3 zinnen",
  "thesis": "4-5 zinnen investment thesis",
  "keyRisks": ["risico 1", "risico 2", "risico 3", "risico 4"],
  "catalysts": [
    { "title": "naam", "type": "<Earnings|Product Launch|Regulatory|Contract|Partnership|FDA Milestone|Financing|Conference>", "impact": "<Low|Medium|High|Critical>", "period": "Q3 2026", "confidence": <0-100> }
  ],
  "priceTargets": { "base": <prijs>, "bull": <prijs>, "bear": <prijs> },
  "newsSignal": "<positive|neutral|negative>",
  "newsHighlight": "1 zin over belangrijkste nieuws"
}` }],
  })

  const text = msg.content.find(b => b.type === "text")?.text ?? ""
  const raw  = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()
  return JSON.parse(raw)
}

// ── Supabase writes ────────────────────────────────────────────────────────

async function saveCompany(profile: FMPProfile) {
  const id = profile.symbol.toLowerCase()
  await supabase.from("companies").upsert({
    id, slug: id,
    ticker: profile.symbol,
    name: profile.companyName,
    exchange: profile.exchange,
    sector: profile.sector,
    industry: profile.industry,
    description: profile.description,
    website: profile.website,
    ceo: profile.ceo,
    employees: profile.fullTimeEmployees ? parseInt(profile.fullTimeEmployees) : null,
    ipo_date: profile.ipoDate,
    price: profile.price,
    market_cap: profile.marketCap,
    beta: profile.beta,
    is_active: true,
    last_updated: new Date().toISOString(),
  }, { onConflict: "id" })
  return id
}

async function saveNews(companyId: string, ticker: string, news: NewsArticle[]) {
  if (!news.length) return
  const { data: existing } = await supabase.from("company_news").select("url").eq("company_id", companyId)
  const existingUrls = new Set((existing ?? []).map(r => r.url).filter(Boolean))
  const newArticles  = news.filter(n => n.url && !existingUrls.has(n.url))
  if (!newArticles.length) return
  await supabase.from("company_news").insert(
    newArticles.map(n => ({ company_id: companyId, ticker, title: n.title, summary: n.summary, url: n.url, source: n.source, published_at: n.publishedAt }))
  )
}

async function saveAnalysis(companyId: string, analysis: Awaited<ReturnType<typeof analyze>>, entryPrice?: number) {
  await supabase.from("ai_analyses").insert({
    company_id: companyId,
    model: "claude-opus-4-7",
    entry_price: entryPrice ?? null,
    score_total:          analysis.asymmetricScore.total,
    score_revenue_growth: analysis.asymmetricScore.revenueGrowth,
    score_cash_runway:    analysis.asymmetricScore.cashRunway,
    score_tam_size:       analysis.asymmetricScore.tamSize,
    score_competitive_adv:analysis.asymmetricScore.competitiveAdvantage,
    score_management:     analysis.asymmetricScore.managementQuality,
    score_catalysts:      analysis.asymmetricScore.catalystDensity,
    score_short_interest: analysis.asymmetricScore.shortInterest,
    score_dilution_risk:  analysis.asymmetricScore.dilutionRisk,
    score_sector_tailwind:analysis.asymmetricScore.sectorTailwind,
    score_valuation:      analysis.asymmetricScore.valuationDiscount,
    risk_level: analysis.riskLevel,
    summary:    analysis.summary,
    thesis:     analysis.thesis,
    bull_case:  analysis.bullCase,
    bear_case:  analysis.bearCase,
    key_risks:  analysis.keyRisks,
    catalysts:  analysis.catalysts,
    price_target_base: analysis.priceTargets.base,
    price_target_bull: analysis.priceTargets.bull,
    price_target_bear: analysis.priceTargets.bear,
    news_used: 0,
  })

  if (analysis.catalysts?.length > 0) {
    await supabase.from("catalysts").delete().eq("company_id", companyId).eq("source", "ai")
    await supabase.from("catalysts").insert(
      analysis.catalysts.map((c: { title: string; type: string; impact: string; period: string; confidence: number }) => ({
        company_id: companyId, title: c.title, catalyst_type: c.type,
        impact_level: c.impact, estimated_period: c.period,
        confidence_level: c.confidence, is_upcoming: true, source: "ai",
      }))
    )
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Nuncora Seed Pipeline ===\n")

  // 1. Haal bestaande tickers op + welke al een score hebben
  const { data: existing }  = await supabase.from("companies").select("ticker").eq("is_active", true)
  const { data: noScore }   = await supabase.from("companies_with_latest_analysis").select("ticker").is("score_total", null)
  const existingSet         = new Set((existing ?? []).map(c => c.ticker.toUpperCase()))
  const missingScoreTickers = (noScore ?? []).map(c => c.ticker.toUpperCase())

  console.log(`Bestaande bedrijven in DB: ${existingSet.size}`)
  console.log(`Bedrijven zonder score:    ${missingScoreTickers.length}`)

  // 2. Discovery — alleen nieuwe tickers ophalen
  console.log("\n[1/3] Discovery — Claude genereert kandidaten...")
  const candidates = await discover()
  console.log(`  ✓ ${candidates.length} kandidaten gegenereerd`)

  // 3. FMP validatie voor nieuwe kandidaten
  console.log("\n[2/3] FMP validatie — marktcap filter $50M–$5B...")
  const newlyValidated: Array<{ ticker: string; profile: FMPProfile }> = []
  const batchSize = 5

  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize)
    const results = await Promise.allSettled(batch.map(async c => {
      if (existingSet.has(c.ticker.toUpperCase())) return null
      const p = await getProfile(c.ticker)
      if (!p || !p.isActivelyTrading) return null
      if (p.marketCap < 50_000_000 || p.marketCap > 5_000_000_000) return null
      return { ticker: c.ticker.toUpperCase(), profile: p }
    }))
    for (const r of results) {
      if (r.status === "fulfilled" && r.value) newlyValidated.push(r.value)
    }
    process.stdout.write(`  ${Math.min(i + batchSize, candidates.length)}/${candidates.length} gecontroleerd...\r`)
    if (i + batchSize < candidates.length) await new Promise(r => setTimeout(r, 500))
  }
  console.log(`\n  ✓ ${newlyValidated.length} nieuwe bedrijven voldoen aan criteria`)

  // FMP profielen ophalen voor bedrijven die al in DB zitten maar geen score hebben
  const missingProfiles: Array<{ ticker: string; profile: FMPProfile }> = []
  if (missingScoreTickers.length > 0) {
    console.log(`\n  Profiel ophalen voor ${missingScoreTickers.length} bedrijven zonder score...`)
    for (let i = 0; i < missingScoreTickers.length; i += batchSize) {
      const batch = missingScoreTickers.slice(i, i + batchSize)
      const results = await Promise.allSettled(batch.map(async ticker => {
        const p = await getProfile(ticker)
        if (!p) return null
        return { ticker, profile: p }
      }))
      for (const r of results) {
        if (r.status === "fulfilled" && r.value) missingProfiles.push(r.value)
      }
      if (i + batchSize < missingScoreTickers.length) await new Promise(r => setTimeout(r, 300))
    }
  }

  // Combineer: eerst bedrijven zonder score, dan nieuwe ontdekkingen
  const toAnalyze = [...missingProfiles, ...newlyValidated]
  console.log(`\n[3/3] Claude analyse (${toAnalyze.length} bedrijven) — ~${Math.ceil(toAnalyze.length * 20 / 60)} minuten...\n`)
  let done = 0, errors = 0

  for (const { ticker, profile } of toAnalyze) {
    try {
      process.stdout.write(`  Analyseer ${ticker.padEnd(8)}...`)

      const companyId  = await saveCompany(profile)
      const news       = await fetchNews(ticker, profile.companyName)
      await saveNews(companyId, ticker, news)
      const financials = profile.cik ? await getFinancialSnapshot(profile.cik).catch(() => null) : null
      const analysis   = await analyze(ticker, profile, news, financials)
      await saveAnalysis(companyId, analysis, profile.price)

      console.log(` score ${analysis.asymmetricScore.total}/100  [${analysis.riskLevel}]`)
      done++
    } catch (e) {
      console.log(` ✗ FOUT: ${String(e).slice(0, 80)}`)
      errors++
    }
  }

  // Log pipeline run
  await supabase.from("pipeline_runs").insert({
    triggered_by: "local-seed",
    status: errors === 0 ? "success" : done > 0 ? "partial" : "failed",
    finished_at: new Date().toISOString(),
    companies_found: toAnalyze.length,
    companies_new: done,
    companies_updated: 0,
    analyses_run: done,
    errors: [],
  })

  console.log(`\n${"=".repeat(40)}`)
  console.log(`✓ Klaar! ${done} bedrijven geanalyseerd, ${errors} fouten.`)
  console.log(`  Open nuncora.vercel.app — het dashboard is nu gevuld.`)
}

main().catch(e => { console.error(e); process.exit(1) })
