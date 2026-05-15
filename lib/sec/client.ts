const EDGAR_BASE = "https://data.sec.gov"

// EDGAR vereist een User-Agent met contactgegevens
const HEADERS = { "User-Agent": "Nuncora research@nuncora.app" }

async function fetchFacts(cik: string): Promise<Record<string, unknown> | null> {
  const padded = cik.replace(/^0+/, "").padStart(10, "0")
  try {
    const res = await fetch(`${EDGAR_BASE}/api/xbrl/companyfacts/CIK${padded}.json`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(12000),
      // @ts-ignore — Next.js cache hint
      next: { revalidate: 86400 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

function latestAnnual(gaap: Record<string, unknown>, ...tags: string[]): { val: number; end: string } | null {
  for (const tag of tags) {
    const concept = gaap[tag] as { units?: { USD?: { form: string; val: number; end: string }[] } } | undefined
    const entries = concept?.units?.USD ?? []
    const annual  = entries.filter(e => e.form === "10-K" && e.val != null).sort((a, b) => b.end.localeCompare(a.end))
    if (annual.length > 0) return annual[0]
  }
  return null
}

function latestAnyFiling(gaap: Record<string, unknown>, ...tags: string[]): number | null {
  for (const tag of tags) {
    const concept = gaap[tag] as { units?: { USD?: { form: string; val: number; end: string }[] } } | undefined
    const entries = concept?.units?.USD ?? []
    const recent  = entries.filter(e => ["10-K", "10-Q"].includes(e.form) && e.val != null).sort((a, b) => b.end.localeCompare(a.end))
    if (recent.length > 0) return recent[0].val
  }
  return null
}

export interface FinancialSnapshot {
  reportPeriod: string | null
  revenueAnnual: number | null
  revenueYoY: number | null
  netIncomeAnnual: number | null
  cashLatest: number | null
  totalDebt: number | null
  operatingCF: number | null
  capex: number | null
  freeCashFlow: number | null
  cashRunwayMonths: number | null
}

export async function getFinancialSnapshot(cik: string): Promise<FinancialSnapshot | null> {
  const data = await fetchFacts(cik)
  const gaap = (data as { facts?: { "us-gaap"?: Record<string, unknown> } } | null)?.facts?.["us-gaap"]
  if (!gaap) return null

  // Revenue — meerdere tags proberen
  const revTags = [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "Revenues",
    "SalesRevenueNet",
    "RevenueFromContractWithCustomerIncludingAssessedTax",
  ]
  const latestRev = latestAnnual(gaap, ...revTags)

  // YoY: zoek vorig jaar in dezelfde tag
  let revenueYoY: number | null = null
  if (latestRev) {
    for (const tag of revTags) {
      const concept = gaap[tag] as { units?: { USD?: { form: string; val: number; end: string }[] } } | undefined
      const annual  = (concept?.units?.USD ?? []).filter(e => e.form === "10-K" && e.val != null).sort((a, b) => b.end.localeCompare(a.end))
      if (annual.length >= 2 && annual[1].val > 0) {
        revenueYoY = ((latestRev.val - annual[1].val) / annual[1].val) * 100
        break
      }
    }
  }

  const netIncome  = latestAnnual(gaap, "NetIncomeLoss", "ProfitLoss")?.val ?? null
  const operatingCF = latestAnnual(gaap, "NetCashProvidedByUsedInOperatingActivities")?.val ?? null
  const capex      = latestAnnual(gaap, "PaymentsToAcquirePropertyPlantAndEquipment", "CapitalExpenditures")?.val ?? null

  // Cash — meest recente balans (10-Q of 10-K)
  const cashLatest = latestAnyFiling(gaap,
    "CashAndCashEquivalentsAtCarryingValue",
    "CashCashEquivalentsAndShortTermInvestments",
    "Cash",
  )

  // Schuld
  const longTermDebt  = latestAnyFiling(gaap, "LongTermDebt", "LongTermDebtAndCapitalLeaseObligation")
  const shortTermDebt = latestAnyFiling(gaap, "ShortTermBorrowings", "NotesPayableCurrent")
  const totalDebt = longTermDebt != null || shortTermDebt != null
    ? (longTermDebt ?? 0) + (shortTermDebt ?? 0)
    : null

  // FCF en cash runway
  const freeCashFlow = operatingCF != null && capex != null ? operatingCF - Math.abs(capex) : null
  const monthlyBurn  = operatingCF != null && operatingCF < 0 ? Math.abs(operatingCF) / 12 : null
  const cashRunwayMonths = cashLatest != null && monthlyBurn != null && monthlyBurn > 0
    ? Math.round(cashLatest / monthlyBurn)
    : null

  return {
    reportPeriod:   latestRev?.end ?? null,
    revenueAnnual:  latestRev?.val ?? null,
    revenueYoY,
    netIncomeAnnual: netIncome,
    cashLatest,
    totalDebt,
    operatingCF,
    capex:          capex != null ? -Math.abs(capex) : null,
    freeCashFlow,
    cashRunwayMonths,
  }
}

export function formatFinancialsForPrompt(f: FinancialSnapshot): string {
  const fmt = (v: number | null, suffix = "") =>
    v == null ? "n/b" : v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B${suffix}` : v >= 1e6 ? `$${(v / 1e6).toFixed(0)}M${suffix}` : `$${v.toFixed(0)}${suffix}`

  const yoy = f.revenueYoY != null ? ` (YoY ${f.revenueYoY >= 0 ? "+" : ""}${f.revenueYoY.toFixed(0)}%)` : ""
  const runway = f.cashRunwayMonths != null ? ` → ${f.cashRunwayMonths} maanden cash runway` : ""
  const fcf = f.freeCashFlow != null ? (f.freeCashFlow >= 0 ? " (FCF positief)" : " (FCF negatief)") : ""

  return `=== FINANCIËLE KERNCIJFERS (SEC 10-K/10-Q, periode: ${f.reportPeriod ?? "onbekend"}) ===
- Jaaromzet:          ${fmt(f.revenueAnnual)}${yoy}
- Nettoresultaat:     ${fmt(f.netIncomeAnnual)}
- Cash & equiv.:      ${fmt(f.cashLatest)}${runway}
- Totale schuld:      ${fmt(f.totalDebt)}
- Operationele kastr: ${fmt(f.operatingCF)}
- Free cash flow:     ${fmt(f.freeCashFlow)}${fcf}
${f.cashRunwayMonths != null && f.cashRunwayMonths < 18 ? "⚠️  Minder dan 18 maanden cash runway — verhoog dilutierisico en bearcase dienovereenkomstig." : ""}`
}
