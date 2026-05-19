import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getCompanyProfile, batchGetPrices } from "@/lib/fmp/client"
import { analyzeCompany } from "@/lib/anthropic/client"
import { fetchNewsForTicker } from "@/lib/news/client"
import { discoverCandidates, validateAndFilterTickers } from "@/lib/discovery/client"
import { getFinancialSnapshot, getInsiderActivity } from "@/lib/sec/client"

export const runtime = "nodejs"
export const maxDuration = 300

// Max bedrijven per run — houdt de run binnen 60s op Vercel free tier
const ANALYSIS_BATCH = 3
// Pas discovery toe als we nog weinig bedrijven hebben
const DISCOVERY_THRESHOLD = 10

function authorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`
}

// Vercel roept dit aan via de cron (GET)
export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return pipeline("cron")
}

// Handmatig triggeren voor testen (POST)
export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  return pipeline(body.triggeredBy ?? "manual", body.skipDiscovery ?? false, body.batchSize ?? ANALYSIS_BATCH)
}

async function pipeline(triggeredBy: string, skipDiscovery = false, batchSize = ANALYSIS_BATCH) {
  const errors: string[] = []
  const log: string[] = []
  let companiesNew = 0
  let companiesUpdated = 0
  let newsFetched = 0
  let analysesRun = 0
  let pricesRefreshed = 0

  // Log pipeline start in Supabase
  const { data: runRow } = await supabaseAdmin
    .from("pipeline_runs")
    .insert({ triggered_by: triggeredBy, status: "running" })
    .select("id")
    .single()
  const runId = runRow?.id

  try {
    // ── Stap 0: Prijsupdate voor alle actieve bedrijven ────────────
    const { data: allCompanies } = await supabaseAdmin
      .from("companies")
      .select("ticker, id")
      .eq("is_active", true)

    const existingTickers = allCompanies?.map((c) => c.ticker) ?? []
    log.push(`Bestaande bedrijven: ${existingTickers.length}`)

    if (existingTickers.length > 0) {
      const quotes = await batchGetPrices(existingTickers)
      if (quotes.length > 0) {
        await supabaseAdmin.from("companies").upsert(
          quotes.map((q) => ({
            id: q.symbol.toLowerCase(),
            ticker: q.symbol,
            price: q.price,
            market_cap: q.marketCap,
            price_change_pct: q.changesPercentage,
            last_updated: new Date().toISOString(),
          })),
          { onConflict: "id" }
        )
        pricesRefreshed = quotes.length
        log.push(`Prijzen bijgewerkt voor ${quotes.length} bedrijven`)
      }
    }

    // ── Stap 2: Discovery — bij weinig bedrijven of elke zondag ────
    const isSunday = new Date().getUTCDay() === 0
    const runDiscovery = !skipDiscovery && (existingTickers.length < DISCOVERY_THRESHOLD || isSunday)

    if (runDiscovery) {
      log.push("Discovery gestart — Claude genereert kandidaten...")

      const candidates = await discoverCandidates()
      log.push(`Claude heeft ${candidates.length} kandidaten gegenereerd`)

      const validated = await validateAndFilterTickers(candidates, existingTickers)
      log.push(`${validated.length} nieuwe bedrijven gevalideerd via FMP`)

      // Sla nieuwe bedrijven alvast op (minimale data, rest volgt bij analyse)
      for (const v of validated) {
        const companyId = v.ticker.toLowerCase()
        await supabaseAdmin.from("companies").upsert({
          id: companyId,
          slug: companyId,
          ticker: v.ticker,
          name: v.name,
          market_cap: v.marketCap,
          is_active: true,
          discovered_at: new Date().toISOString(),
        }, { onConflict: "id" })

        existingTickers.push(v.ticker)
        companiesNew++
      }
    } else if (!skipDiscovery) {
      log.push(`Discovery overgeslagen — ${existingTickers.length} bedrijven al in DB`)
    }

    // ── Stap 3: Kies de bedrijven die het langst niet geanalyseerd zijn ─
    const { data: recentAnalyses } = await supabaseAdmin
      .from("ai_analyses")
      .select("company_id, created_at")
      .order("created_at", { ascending: false })

    // Meest recente analyse per company_id
    const lastAnalyzed = new Map<string, string>()
    for (const a of recentAnalyses ?? []) {
      if (!lastAnalyzed.has(a.company_id)) lastAnalyzed.set(a.company_id, a.created_at)
    }

    // Sorteer: nooit geanalyseerd eerst, daarna oudste analyse eerst
    const allTickers = Array.from(new Set(existingTickers)).sort((a, b) => {
      const aDate = lastAnalyzed.get(a.toLowerCase()) ?? "1970-01-01"
      const bDate = lastAnalyzed.get(b.toLowerCase()) ?? "1970-01-01"
      return aDate < bDate ? -1 : aDate > bDate ? 1 : 0
    })

    const tickersToAnalyze = allTickers.slice(0, batchSize)
    log.push(`Analyseer ${tickersToAnalyze.length} van ${allTickers.length} bedrijven (batch: ${batchSize})`)

    // ── Stap 4: Analyseer elk bedrijf in de batch ───────────────
    for (const ticker of tickersToAnalyze) {
      try {
        // FMP profiel — live prijs + market cap
        const profile = await getCompanyProfile(ticker)
        if (!profile) {
          errors.push(`${ticker}: geen FMP profiel`)
          continue
        }

        const companyId = ticker.toLowerCase()
        const isNew = !lastAnalyzed.has(ticker.toLowerCase())

        // Bedrijfsdata bijwerken in Supabase
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
          is_active: true,
          last_updated: new Date().toISOString(),
        }, { onConflict: "id" })

        if (isNew) companiesNew++
        else companiesUpdated++

        // Nieuws ophalen via Google News RSS
        const news = await fetchNewsForTicker(ticker, profile.companyName)
        newsFetched += news.length

        // Nieuws opslaan — filter eerst bestaande URLs
        if (news.length > 0) {
          const { data: existing } = await supabaseAdmin
            .from("company_news")
            .select("url")
            .eq("company_id", companyId)
          const existingUrls = new Set((existing ?? []).map(r => r.url).filter(Boolean))
          const newArticles  = news.filter(n => n.url && !existingUrls.has(n.url))
          if (newArticles.length > 0) {
            await supabaseAdmin.from("company_news").insert(
              newArticles.map((n) => ({
                company_id:   companyId,
                ticker,
                title:        n.title,
                summary:      n.summary,
                url:          n.url,
                source:       n.source,
                published_at: n.publishedAt,
              }))
            )
          }
          newsFetched += newArticles.length
        }

        // SEC data ophalen (financials + insider activiteit)
        const financials      = profile.cik ? await getFinancialSnapshot(profile.cik).catch(() => null) : null
        const insiderActivity = profile.cik ? await getInsiderActivity(profile.cik).catch(() => null) : null

        // Claude deep analysis
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
        }, news, financials, insiderActivity)

        // Analyse opslaan
        await supabaseAdmin.from("ai_analyses").insert({
          company_id: companyId,
          model: "claude-opus-4-7",
          entry_price: profile.price,
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
          score_insider_ownership: analysis.asymmetricScore.insiderOwnership,
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

        // Catalysts bijwerken (verwijder oude AI-catalysts, voeg nieuwe toe)
        if (analysis.catalysts.length > 0) {
          await supabaseAdmin
            .from("catalysts")
            .delete()
            .eq("company_id", companyId)
            .eq("source", "ai")

          await supabaseAdmin.from("catalysts").insert(
            analysis.catalysts.map((cat) => ({
              company_id: companyId,
              title: cat.title,
              catalyst_type: cat.type,
              impact_level: cat.impact,
              estimated_period: cat.period,
              confidence_level: cat.confidence,
              is_upcoming: true,
              source: "ai",
            }))
          )
        }

        analysesRun++
        log.push(`✓ ${ticker} (score: ${analysis.asymmetricScore.total})`)
      } catch (e) {
        errors.push(`${ticker}: ${String(e)}`)
      }
    }

    // ── Stap 5: Pipeline afsluiten ─────────────────────────────
    const status = errors.length === 0 ? "success" : analysesRun > 0 ? "partial" : "failed"

    await supabaseAdmin.from("pipeline_runs").update({
      finished_at: new Date().toISOString(),
      status,
      companies_found: allTickers.length,
      companies_updated: companiesUpdated,
      companies_new: companiesNew,
      news_fetched: newsFetched,
      analyses_run: analysesRun,
      prices_refreshed: pricesRefreshed,
      errors,
    }).eq("id", runId)

    return NextResponse.json({
      success: true,
      status,
      companiesNew,
      companiesUpdated,
      newsFetched,
      analysesRun,
      pricesRefreshed,
      log,
      errors: errors.slice(0, 10),
    })
  } catch (fatal) {
    await supabaseAdmin.from("pipeline_runs").update({
      status: "failed",
      finished_at: new Date().toISOString(),
      errors: [String(fatal)],
    }).eq("id", runId)

    return NextResponse.json({ success: false, error: String(fatal) }, { status: 500 })
  }
}
