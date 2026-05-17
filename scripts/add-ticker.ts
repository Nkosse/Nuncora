/**
 * Voegt één ticker toe aan het dashboard en voert een volledige analyse uit.
 * Gebruik: npx tsx scripts/add-ticker.ts TICKER
 */

import "dotenv/config"
import { resolve } from "path"
import { config } from "dotenv"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"
import { getFinancialSnapshot, formatFinancialsForPrompt } from "../lib/sec/client"

const ticker = (process.argv[2] ?? "").toUpperCase()
if (!ticker) { console.error("Gebruik: npx tsx scripts/add-ticker.ts TICKER"); process.exit(1) }

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FMP_BASE  = "https://financialmodelingprep.com/stable"
const FMP_KEY   = process.env.FMP_API_KEY ?? ""

async function getProfile(sym: string) {
  const res = await fetch(`${FMP_BASE}/profile?symbol=${sym}&apikey=${FMP_KEY}`)
  if (!res.ok) return null
  const data = await res.json()
  if (data?.["Error Message"] || typeof data === "string") return null
  return Array.isArray(data) && data.length > 0 ? data[0] : null
}

async function fetchNews(sym: string, name: string) {
  try {
    const q   = encodeURIComponent(`${sym} ${name} stock`)
    const url = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const xml  = await res.text()
    const items: { title: string; summary: string; url: string; source: string; publishedAt: string }[] = []
    const rx   = /<item>([\s\S]*?)<\/item>/g
    let m
    while ((m = rx.exec(xml)) !== null) {
      const b     = m[1]
      const get   = (tag: string) => new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(b)?.[1] ?? ""
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

async function analyze(sym: string, profile: Record<string, unknown>, news: { title: string; summary: string; source: string }[], financials: Awaited<ReturnType<typeof getFinancialSnapshot>>) {
  const today    = new Date().toISOString().split("T")[0]
  const newsText = news.length > 0
    ? "\nRecent nieuws:\n" + news.map((n, i) => `${i+1}. [${n.source}] ${n.title}\n   ${n.summary}`).join("\n")
    : "\nGeen recent nieuws."
  const financialsText = financials
    ? "\n" + formatFinancialsForPrompt(financials) + "\n"
    : "\n(Geen SEC-financiële data beschikbaar — gebruik trainingskennis.)\n"
  const psRatio = financials?.revenueAnnual && financials.revenueAnnual > 0 && profile.marketCap
    ? ((profile.marketCap as number) / financials.revenueAnnual).toFixed(1)
    : null

  const msg = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2500,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: `Je bent een expert investment analyst in future-tech smallcaps. Vandaag is het ${today}.

Analyseer ${sym} (${profile.companyName}) op asymmetrisch opwaarts potentieel.

=== MARKTDATA ===
Prijs: $${profile.price} | Market Cap: $${((profile.marketCap as number)/1e9).toFixed(2)}B | P/S: ${psRatio ?? "n/b"}x | Beta: ${profile.beta}
Sector: ${profile.sector} / ${profile.industry} | CEO: ${profile.ceo}
Medewerkers: ${profile.fullTimeEmployees} | Beurs: ${profile.exchange} | IPO: ${profile.ipoDate}

=== BESCHRIJVING ===
${profile.description}
${financialsText}
${newsText}

=== INSTRUCTIES ===
Gebruik de SEC-KERNCIJFERS als primaire bron voor financiële scores. Combineer met trainingskennis voor kwalitatieve factoren.
- cashRunway: < 12 mnd = score ≤ 3, 12-24 mnd = 4-6, > 24 mnd of FCF positief = 7-10
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

async function main() {
  console.log(`\n=== Toevoegen: ${ticker} ===\n`)

  // 1. FMP profiel
  process.stdout.write("FMP profiel ophalen... ")
  const profile = await getProfile(ticker)
  if (!profile) { console.log("✗ Niet gevonden op FMP"); process.exit(1) }
  console.log(`✓ ${profile.companyName} ($${(profile.marketCap/1e9).toFixed(2)}B, ${profile.exchange})`)

  // 2. SEC financiële data
  process.stdout.write("SEC EDGAR data ophalen... ")
  const financials = profile.cik ? await getFinancialSnapshot(profile.cik).catch(() => null) : null
  if (financials?.revenueAnnual) {
    const yoy = financials.revenueYoY != null ? ` (+${financials.revenueYoY.toFixed(0)}% YoY)` : ""
    console.log(`✓ Omzet $${(financials.revenueAnnual/1e6).toFixed(0)}M${yoy}, cash $${((financials.cashLatest ?? 0)/1e6).toFixed(0)}M`)
  } else {
    console.log("— geen EDGAR data beschikbaar")
  }

  // 3. Nieuws
  process.stdout.write("Nieuws ophalen... ")
  const news = await fetchNews(ticker, profile.companyName)
  console.log(`✓ ${news.length} artikelen`)

  // 4. Bedrijf opslaan
  const companyId = ticker.toLowerCase()
  await supabase.from("companies").upsert({
    id: companyId, slug: companyId,
    ticker: profile.symbol, name: profile.companyName,
    exchange: profile.exchange, sector: profile.sector,
    industry: profile.industry, description: profile.description,
    website: profile.website, ceo: profile.ceo,
    employees: profile.fullTimeEmployees ? parseInt(profile.fullTimeEmployees) : null,
    ipo_date: profile.ipoDate, price: profile.price,
    market_cap: profile.marketCap, beta: profile.beta,
    is_active: true, last_updated: new Date().toISOString(),
  }, { onConflict: "id" })

  // Nieuws opslaan
  if (news.length > 0) {
    const { data: existing } = await supabase.from("company_news").select("url").eq("company_id", companyId)
    const existingUrls = new Set((existing ?? []).map(r => r.url).filter(Boolean))
    const newArticles  = news.filter(n => n.url && !existingUrls.has(n.url))
    if (newArticles.length > 0) {
      await supabase.from("company_news").insert(
        newArticles.map(n => ({ company_id: companyId, ticker, title: n.title, summary: n.summary, url: (n as { url: string }).url, source: n.source, published_at: (n as { publishedAt: string }).publishedAt }))
      )
    }
  }

  // 5. Claude analyse
  process.stdout.write("Claude analyse uitvoeren... ")
  const analysis = await analyze(ticker, profile, news, financials)
  console.log(`✓ Score ${analysis.asymmetricScore.total}/100 [${analysis.riskLevel}]`)

  // Analyse opslaan
  await supabase.from("ai_analyses").insert({
    company_id: companyId, model: "claude-opus-4-7",
    entry_price: profile.price,
    score_total:           analysis.asymmetricScore.total,
    score_revenue_growth:  analysis.asymmetricScore.revenueGrowth,
    score_cash_runway:     analysis.asymmetricScore.cashRunway,
    score_tam_size:        analysis.asymmetricScore.tamSize,
    score_competitive_adv: analysis.asymmetricScore.competitiveAdvantage,
    score_management:      analysis.asymmetricScore.managementQuality,
    score_catalysts:       analysis.asymmetricScore.catalystDensity,
    score_short_interest:  analysis.asymmetricScore.shortInterest,
    score_dilution_risk:   analysis.asymmetricScore.dilutionRisk,
    score_sector_tailwind: analysis.asymmetricScore.sectorTailwind,
    score_valuation:       analysis.asymmetricScore.valuationDiscount,
    risk_level: analysis.riskLevel, summary: analysis.summary,
    thesis: analysis.thesis, bull_case: analysis.bullCase, bear_case: analysis.bearCase,
    key_risks: analysis.keyRisks, catalysts: analysis.catalysts,
    price_target_base: analysis.priceTargets.base,
    price_target_bull: analysis.priceTargets.bull,
    price_target_bear: analysis.priceTargets.bear,
    news_used: news.length,
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

  console.log(`\n✓ ${ticker} staat nu op het dashboard — verschijnt binnen 5 minuten op nuncora.vercel.app`)
}

main().catch(e => { console.error(e); process.exit(1) })
