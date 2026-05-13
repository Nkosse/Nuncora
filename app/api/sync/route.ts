import { NextRequest, NextResponse } from "next/server"
import { getCompanyProfile, SEED_TICKERS } from "@/lib/fmp/client"
import { analyzeCompany } from "@/lib/anthropic/client"

export const runtime = "nodejs"
export const maxDuration = 300

export interface SyncResult {
  success: boolean
  processed: number
  companies: ProcessedCompany[]
  errors: string[]
  durationMs: number
}

export interface ProcessedCompany {
  ticker: string
  name: string
  sector: string
  price: number
  marketCap: number
  score: number
  riskLevel: string
  thesis: string
  summary: string
  bullCase: string
  bearCase: string
  keyRisks: string[]
  catalysts: string[]
  priceTargets: { base: number; bull: number; bear: number }
  subScores: Record<string, number>
}

export async function POST(req: NextRequest) {
  const start = Date.now()
  const errors: string[] = []
  const companies: ProcessedCompany[] = []

  if (!process.env.FMP_API_KEY) {
    return NextResponse.json({ success: false, error: "FMP_API_KEY not set" }, { status: 500 })
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ success: false, error: "ANTHROPIC_API_KEY not set" }, { status: 500 })
  }

  const body = await req.json().catch(() => ({}))
  const limit: number = Math.min(body.limit ?? 5, 25)
  const tickers: string[] = body.tickers ?? SEED_TICKERS.slice(0, limit)

  for (const ticker of tickers.slice(0, limit)) {
    try {
      const profile = await getCompanyProfile(ticker)
      if (!profile) {
        errors.push(`${ticker}: geen profiel beschikbaar`)
        continue
      }

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
      })

      companies.push({
        ticker,
        name: profile.companyName,
        sector: profile.sector,
        price: profile.price,
        marketCap: profile.marketCap,
        score: analysis.asymmetricScore.total,
        riskLevel: analysis.riskLevel,
        thesis: analysis.thesis,
        summary: analysis.summary,
        bullCase: analysis.bullCase,
        bearCase: analysis.bearCase,
        keyRisks: analysis.keyRisks,
        catalysts: analysis.catalysts.map((c) => c.title),
        priceTargets: analysis.priceTargets,
        subScores: {
          revenueGrowth: analysis.asymmetricScore.revenueGrowth,
          cashRunway: analysis.asymmetricScore.cashRunway,
          tamSize: analysis.asymmetricScore.tamSize,
          competitiveAdvantage: analysis.asymmetricScore.competitiveAdvantage,
          managementQuality: analysis.asymmetricScore.managementQuality,
          catalystDensity: analysis.asymmetricScore.catalystDensity,
          shortInterest: analysis.asymmetricScore.shortInterest,
          dilutionRisk: analysis.asymmetricScore.dilutionRisk,
          sectorTailwind: analysis.asymmetricScore.sectorTailwind,
          valuationDiscount: analysis.asymmetricScore.valuationDiscount,
        },
      })
    } catch (e) {
      errors.push(`${ticker}: ${String(e)}`)
    }
  }

  companies.sort((a, b) => b.score - a.score)

  return NextResponse.json({
    success: true,
    processed: companies.length,
    companies,
    errors,
    durationMs: Date.now() - start,
  } satisfies SyncResult)
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "POST /api/sync met { limit: 3 } om te starten",
  })
}
