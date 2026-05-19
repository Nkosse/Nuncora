/**
 * Heranalyseert alle actieve bedrijven met de nieuwste prompt (incl. SEC + insider data).
 * Gebruik: npx tsx scripts/reanalyze-all.ts
 */

import "dotenv/config"
import { resolve } from "path"
import { config } from "dotenv"
config({ path: resolve(process.cwd(), ".env.local") })

import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"
import { getFinancialSnapshot, formatFinancialsForPrompt, getInsiderActivity, formatInsiderForPrompt } from "../lib/sec/client"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FMP_BASE  = "https://financialmodelingprep.com/stable"
const FMP_KEY   = process.env.FMP_API_KEY ?? ""

interface FMPProfile {
  symbol: string; companyName: string; price: number; marketCap: number
  beta: number; exchange: string; industry: string; website: string
  description: string; ceo: string; sector: string; fullTimeEmployees: string
  ipoDate: string; isActivelyTrading: boolean; cik?: string | null
}

async function getProfile(ticker: string): Promise<FMPProfile | null> {
  try {
    const res  = await fetch(`${FMP_BASE}/profile?symbol=${ticker}&apikey=${FMP_KEY}`)
    if (!res.ok) return null
    const data = await res.json()
    if (data?.["Error Message"] || typeof data === "string") return null
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch { return null }
}

async function fetchNews(ticker: string, name: string) {
  try {
    const q   = encodeURIComponent(`${ticker} ${name} stock`)
    const res = await fetch(`https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`, {
      headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000)
    })
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

async function analyze(ticker: string, profile: FMPProfile, news: typeof fetchNews extends (...args: any) => Promise<infer R> ? R : never, financials: Awaited<ReturnType<typeof getFinancialSnapshot>>, insiderActivity: Awaited<ReturnType<typeof getInsiderActivity>>) {
  const today        = new Date().toISOString().split("T")[0]
  const newsText     = news.length > 0 ? "\nRecent nieuws:\n" + news.map((n, i) => `${i+1}. [${n.source}] ${n.title}\n   ${n.summary}`).join("\n") : "\nGeen recent nieuws."
  const financialsText = financials ? "\n" + formatFinancialsForPrompt(financials) + "\n" : "\n(Geen SEC-financiële data beschikbaar.)\n"
  const insiderText  = insiderActivity ? "\n" + formatInsiderForPrompt(insiderActivity) + "\n" : "\n(Geen Form 4 data — gebruik trainingskennis voor insider ownership.)\n"
  const psRatio      = financials?.revenueAnnual && financials.revenueAnnual > 0 ? (profile.marketCap / financials.revenueAnnual).toFixed(1) : null

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
${insiderText}
${newsText}

=== INSTRUCTIES ===
Gebruik SEC-KERNCIJFERS als primaire bron voor financiële scores. Gebruik Form 4 data voor insiderOwnership. Combineer met trainingskennis voor kwalitatieve factoren.
- cashRunway: < 12 mnd = ≤ 3, 12-24 mnd = 4-6, > 24 mnd of FCF positief = 7-10
- revenueGrowth: baseer op werkelijke YoY% uit SEC data
- dilutionRisk: verhoog als schuld hoog of cash runway kort
- valuationDiscount: gebruik P/S ratio t.o.v. sectorgenoten
- insiderOwnership: actief inkopen = 8-10, stabiel = 5-7, zware verkopen = 2-4
Wees specifiek — noem producten, contracten, klanten bij naam.

Retourneer UITSLUITEND geldig JSON:
{
  "summary": "2-3 zinnen executive summary",
  "asymmetricScore": {
    "total": <0-100>,
    "revenueGrowth": <0-10>, "cashRunway": <0-10>, "tamSize": <0-10>,
    "competitiveAdvantage": <0-10>, "managementQuality": <0-10>,
    "catalystDensity": <0-10>, "shortInterest": <0-10>,
    "dilutionRisk": <0-10>, "sectorTailwind": <0-10>, "valuationDiscount": <0-10>,
    "insiderOwnership": <0-10>
  },
  "riskLevel": "<low|medium|high|very-high>",
  "bullCase": "2-3 zinnen", "bearCase": "2-3 zinnen",
  "thesis": "4-5 zinnen investment thesis",
  "keyRisks": ["risico 1", "risico 2", "risico 3", "risico 4"],
  "catalysts": [{ "title": "naam", "type": "<Earnings|Product Launch|Regulatory|Contract|Partnership|FDA Milestone|Financing|Conference>", "impact": "<Low|Medium|High|Critical>", "period": "Q3 2026", "confidence": <0-100> }],
  "priceTargets": { "base": <prijs>, "bull": <prijs>, "bear": <prijs> },
  "newsSignal": "<positive|neutral|negative>",
  "newsHighlight": "1 zin over belangrijkste nieuws"
}` }],
  })

  const text = msg.content.find(b => b.type === "text")?.text ?? ""
  return JSON.parse(text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim())
}

async function main() {
  const { data: companies } = await supabase
    .from("companies")
    .select("ticker, name")
    .eq("is_active", true)
    .order("ticker")

  if (!companies?.length) { console.log("Geen bedrijven gevonden"); return }

  const total = companies.length
  console.log(`\n=== Heranalyse van alle ${total} bedrijven ===`)
  console.log(`Verwachte duur: ~${Math.ceil(total * 25 / 60)} minuten\n`)

  let done = 0, errors = 0
  const startTime = Date.now()

  for (const { ticker, name } of companies) {
    const companyId = ticker.toLowerCase()
    try {
      process.stdout.write(`[${done + 1}/${total}] ${ticker.padEnd(8)}`)

      const profile = await getProfile(ticker)
      if (!profile) { console.log(" ✗ geen FMP profiel"); errors++; continue }

      const [financials, insiderActivity, news] = await Promise.allSettled([
        profile.cik ? getFinancialSnapshot(profile.cik) : Promise.resolve(null),
        profile.cik ? getInsiderActivity(profile.cik)   : Promise.resolve(null),
        fetchNews(ticker, profile.companyName),
      ]).then(results => results.map(r => r.status === "fulfilled" ? r.value : null))

      const analysis = await analyze(ticker, profile, (news as Awaited<ReturnType<typeof fetchNews>>) ?? [], financials as Awaited<ReturnType<typeof getFinancialSnapshot>>, insiderActivity as Awaited<ReturnType<typeof getInsiderActivity>>)

      // Bedrijfsdata bijwerken
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

      // Analyse opslaan
      await supabase.from("ai_analyses").insert({
        company_id: companyId, model: "claude-opus-4-7",
        entry_price: profile.price,
        score_total:             analysis.asymmetricScore.total,
        score_revenue_growth:    analysis.asymmetricScore.revenueGrowth,
        score_cash_runway:       analysis.asymmetricScore.cashRunway,
        score_tam_size:          analysis.asymmetricScore.tamSize,
        score_competitive_adv:   analysis.asymmetricScore.competitiveAdvantage,
        score_management:        analysis.asymmetricScore.managementQuality,
        score_catalysts:         analysis.asymmetricScore.catalystDensity,
        score_short_interest:    analysis.asymmetricScore.shortInterest,
        score_dilution_risk:     analysis.asymmetricScore.dilutionRisk,
        score_sector_tailwind:   analysis.asymmetricScore.sectorTailwind,
        score_valuation:         analysis.asymmetricScore.valuationDiscount,
        score_insider_ownership: analysis.asymmetricScore.insiderOwnership,
        risk_level: analysis.riskLevel, summary: analysis.summary,
        thesis: analysis.thesis, bull_case: analysis.bullCase, bear_case: analysis.bearCase,
        key_risks: analysis.keyRisks, catalysts: analysis.catalysts,
        price_target_base: analysis.priceTargets.base,
        price_target_bull: analysis.priceTargets.bull,
        price_target_bear: analysis.priceTargets.bear,
        news_used: Array.isArray(news) ? news.length : 0,
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

      const elapsed  = Math.round((Date.now() - startTime) / 1000)
      const perItem  = elapsed / (done + 1)
      const remaining = Math.round((total - done - 1) * perItem / 60)
      console.log(` score ${String(analysis.asymmetricScore.total).padStart(3)}/100  [${analysis.riskLevel}]  (nog ~${remaining}m)`)
      done++
    } catch (e) {
      console.log(` ✗ ${String(e).slice(0, 60)}`)
      errors++
    }
  }

  const totalMin = Math.round((Date.now() - startTime) / 60000)
  console.log(`\n${"=".repeat(50)}`)
  console.log(`✓ Klaar in ${totalMin} minuten — ${done} analyses bijgewerkt, ${errors} fouten`)
}

main().catch(e => { console.error(e); process.exit(1) })
