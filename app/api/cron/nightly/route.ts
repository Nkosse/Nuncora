import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getCompanyProfile, SEED_TICKERS } from "@/lib/fmp/client"
import { analyzeCompany } from "@/lib/anthropic/client"
import { fetchNewsForTicker } from "@/lib/news/client"

export const runtime = "nodejs"
export const maxDuration = 300

export async function GET(req: NextRequest) {
  // Vercel stuurt automatisch de CRON_SECRET als Bearer token
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return runPipeline("cron")
}

// Ook handmatig te triggeren via POST (voor testen)
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  return runPipeline("manual", body.tickers)
}

async function runPipeline(triggeredBy: string, overrideTickers?: string[]) {
  const errors: string[] = []
  let companiesUpdated = 0
  let companiesNew = 0
  let newsFetched = 0
  let analysesRun = 0

  // Log pipeline start
  const { data: runRow } = await supabaseAdmin
    .from("pipeline_runs")
    .insert({ triggered_by: triggeredBy, status: "running" })
    .select("id")
    .single()

  const runId = runRow?.id

  try {
    // Stap 1: Haal huidige tickers op uit Supabase
    const { data: existingCompanies } = await supabaseAdmin
      .from("companies")
      .select("ticker, id")
      .eq("is_active", true)

    const existingTickers = existingCompanies?.map((c) => c.ticker) ?? []

    // Combineer: bestaande + seed tickers (+ eventuele override)
    const allTickers = overrideTickers
      ?? Array.from(new Set([...existingTickers, ...SEED_TICKERS]))

    // Stap 2: Verwerk elk bedrijf
    for (const ticker of allTickers) {
      try {
        // FMP profiel ophalen
        const profile = await getCompanyProfile(ticker)
        if (!profile) {
          errors.push(`${ticker}: geen FMP profiel`)
          continue
        }

        const companyId = ticker.toLowerCase()
        const isNew = !existingTickers.includes(ticker)

        // Bedrijf upserten in Supabase
        await supabaseAdmin.from("companies").upsert({
          id: companyId,
          slug: companyId,
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
          last_updated: new Date().toISOString(),
          is_active: true,
        }, { onConflict: "id" })

        if (isNew) companiesNew++
        else companiesUpdated++

        // Nieuws ophalen
        const news = await fetchNewsForTicker(ticker, profile.companyName)
        newsFetched += news.length

        // Nieuws opslaan in Supabase (skip duplicaten via unique url index)
        if (news.length > 0) {
          const newsRows = news.map((n) => ({
            company_id: companyId,
            ticker,
            title: n.title,
            summary: n.summary,
            url: n.url || null,
            source: n.source,
            published_at: n.publishedAt,
          }))

          await supabaseAdmin
            .from("company_news")
            .upsert(newsRows, { onConflict: "url", ignoreDuplicates: true })
        }

        // Claude analyse uitvoeren
        const analysis = await analyzeCompany(ticker, {
          name: profile.companyName,
          price: profile.price,
          marketCap: profile.marketCap,
          sector: profile.sector,
          industry: profile.industry,
          description: profile.description ?? "",
          ceo: profile.ceo ?? "",
          employees: profile.fullTimeEmployees ?? "",
          exchange: profile.exchange ?? "",
          ipoDate: profile.ipoDate ?? "",
          beta: profile.beta ?? 0,
        }, news)

        // Analyse opslaan in Supabase
        await supabaseAdmin.from("ai_analyses").insert({
          company_id: companyId,
          model: "claude-opus-4-7",
          score_total: analysis.asymmetricScore.total,
          score_revenue_growth: analysis.asymmetricScore.revenueGrowth,
          score_cash_runway: analysis.asymmetricScore.cashRunway,
          score_tam_size: analysis.asymmetricScore.tamSize,
          score_competitive_adv: analysis.asymmetricScore.competitiveAdvantage,
          score_management: analysis.asymmetricScore.managementQuality,
          score_catalysts: analysis.asymmetricScore.catalystDensity,
          score_short_interest: analysis.asymmetricScore.shortInterest,
          score_dilution_risk: analysis.asymmetricScore.dilutionRisk,
          score_sector_tailwind: analysis.asymmetricScore.sectorTailwind,
          score_valuation: analysis.asymmetricScore.valuationDiscount,
          risk_level: analysis.riskLevel,
          summary: analysis.summary,
          thesis: analysis.thesis,
          bull_case: analysis.bullCase,
          bear_case: analysis.bearCase,
          key_risks: analysis.keyRisks,
          catalysts: analysis.catalysts,
          price_target_base: analysis.priceTargets.base,
          price_target_bull: analysis.priceTargets.bull,
          price_target_bear: analysis.priceTargets.bear,
          news_used: news.length,
        })

        // Catalysts upserten
        if (analysis.catalysts.length > 0) {
          const catalystRows = analysis.catalysts.map((cat) => ({
            company_id: companyId,
            title: cat.title,
            catalyst_type: cat.type,
            impact_level: cat.impact,
            estimated_period: cat.period,
            confidence_level: cat.confidence,
            is_upcoming: true,
            source: "ai",
          }))

          // Verwijder oude AI-catalysts en voeg nieuwe in
          await supabaseAdmin
            .from("catalysts")
            .delete()
            .eq("company_id", companyId)
            .eq("source", "ai")

          await supabaseAdmin.from("catalysts").insert(catalystRows)
        }

        analysesRun++
      } catch (e) {
        errors.push(`${ticker}: ${String(e)}`)
      }
    }

    // Pipeline run afsluiten
    await supabaseAdmin
      .from("pipeline_runs")
      .update({
        finished_at: new Date().toISOString(),
        status: errors.length === 0 ? "success" : "partial",
        companies_found: allTickers.length,
        companies_updated: companiesUpdated,
        companies_new: companiesNew,
        news_fetched: newsFetched,
        analyses_run: analysesRun,
        errors,
      })
      .eq("id", runId)

    return NextResponse.json({
      success: true,
      companiesUpdated,
      companiesNew,
      newsFetched,
      analysesRun,
      errors: errors.slice(0, 10),
    })
  } catch (fatalError) {
    await supabaseAdmin
      .from("pipeline_runs")
      .update({ status: "failed", finished_at: new Date().toISOString(), errors: [String(fatalError)] })
      .eq("id", runId)

    return NextResponse.json({ success: false, error: String(fatalError) }, { status: 500 })
  }
}
