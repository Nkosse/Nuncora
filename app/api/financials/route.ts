import { NextRequest, NextResponse } from "next/server"

const FMP_BASE = "https://financialmodelingprep.com/stable"
const FMP_KEY  = process.env.FMP_API_KEY ?? ""

async function fmpGet(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${FMP_BASE}${path}`)
  url.searchParams.set("apikey", FMP_KEY)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) return null
  const data = await res.json()
  if (data?.["Error Message"] || typeof data === "string") return null
  return data
}

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get("ticker")
  if (!ticker) return NextResponse.json({ error: "Missing ticker" }, { status: 400 })

  const sym = ticker.toUpperCase()

  const [income, balance, cashflow, metrics] = await Promise.allSettled([
    fmpGet("/income-statement",        { symbol: sym, limit: "4" }),
    fmpGet("/balance-sheet-statement", { symbol: sym, limit: "2" }),
    fmpGet("/cash-flow-statement",     { symbol: sym, limit: "2" }),
    fmpGet("/key-metrics-ttm",         { symbol: sym }),
  ])

  const incomeData  = income.status  === "fulfilled" ? income.value  : null
  const balanceData = balance.status === "fulfilled" ? balance.value : null
  const cashData    = cashflow.status === "fulfilled" ? cashflow.value : null
  const metricsData = metrics.status === "fulfilled" ? metrics.value  : null

  const latest  = Array.isArray(incomeData)  && incomeData.length  > 0 ? incomeData[0]  : null
  const prev    = Array.isArray(incomeData)  && incomeData.length  > 1 ? incomeData[1]  : null
  const bal     = Array.isArray(balanceData) && balanceData.length > 0 ? balanceData[0] : null
  const cf      = Array.isArray(cashData)    && cashData.length    > 0 ? cashData[0]    : null
  const ttm     = Array.isArray(metricsData) && metricsData.length > 0 ? metricsData[0] : metricsData

  const revenueGrowth = latest && prev && prev.revenue > 0
    ? ((latest.revenue - prev.revenue) / prev.revenue) * 100
    : null

  return NextResponse.json({
    // Inkomsten
    revenue:           latest?.revenue           ?? null,
    revenueGrowth,
    grossProfit:       latest?.grossProfit        ?? null,
    grossMargin:       latest?.grossProfitRatio   != null ? latest.grossProfitRatio * 100 : null,
    operatingIncome:   latest?.operatingIncome    ?? null,
    operatingMargin:   latest?.operatingIncomeRatio != null ? latest.operatingIncomeRatio * 100 : null,
    netIncome:         latest?.netIncome          ?? null,
    netMargin:         latest?.netIncomeRatio     != null ? latest.netIncomeRatio * 100 : null,
    ebitda:            latest?.ebitda             ?? null,
    eps:               latest?.eps                ?? null,
    reportPeriod:      latest?.date               ?? null,
    // Balans
    cash:              bal?.cashAndCashEquivalents ?? bal?.cashAndShortTermInvestments ?? null,
    totalDebt:         bal?.totalDebt             ?? null,
    netCash:           bal?.netCash               ?? null,
    totalAssets:       bal?.totalAssets           ?? null,
    totalEquity:       bal?.totalStockholdersEquity ?? null,
    // Kasstromen
    operatingCF:       cf?.operatingCashFlow      ?? null,
    capex:             cf?.capitalExpenditure      ?? null,
    freeCashFlow:      cf?.freeCashFlow            ?? null,
    // TTM ratio's
    peRatio:           ttm?.peRatioTTM            ?? null,
    psRatio:           ttm?.priceToSalesRatioTTM  ?? null,
    pbRatio:           ttm?.pbRatioTTM            ?? null,
    evToRevenue:       ttm?.evToSalesTTM          ?? null,
    evToEbitda:        ttm?.enterpriseValueOverEBITDATTM ?? null,
    revenuePerShare:   ttm?.revenuePerShareTTM    ?? null,
  })
}
