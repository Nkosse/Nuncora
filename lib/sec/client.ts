const EDGAR_BASE = "https://data.sec.gov"
const SEC_BASE   = "https://www.sec.gov"

// EDGAR vereist een User-Agent met contactgegevens
const HEADERS = { "User-Agent": "Nuncora research@nuncora.app" }

// ── Financiële kerncijfers (XBRL companyfacts) ───────────────────────────

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

  const revTags = [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "Revenues",
    "SalesRevenueNet",
    "RevenueFromContractWithCustomerIncludingAssessedTax",
  ]
  const latestRev = latestAnnual(gaap, ...revTags)

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

  const netIncome   = latestAnnual(gaap, "NetIncomeLoss", "ProfitLoss")?.val ?? null
  const operatingCF = latestAnnual(gaap, "NetCashProvidedByUsedInOperatingActivities")?.val ?? null
  const capex       = latestAnnual(gaap, "PaymentsToAcquirePropertyPlantAndEquipment", "CapitalExpenditures")?.val ?? null
  const cashLatest  = latestAnyFiling(gaap, "CashAndCashEquivalentsAtCarryingValue", "CashCashEquivalentsAndShortTermInvestments", "Cash")
  const longTermDebt  = latestAnyFiling(gaap, "LongTermDebt", "LongTermDebtAndCapitalLeaseObligation")
  const shortTermDebt = latestAnyFiling(gaap, "ShortTermBorrowings", "NotesPayableCurrent")
  const totalDebt     = longTermDebt != null || shortTermDebt != null ? (longTermDebt ?? 0) + (shortTermDebt ?? 0) : null
  const freeCashFlow  = operatingCF != null && capex != null ? operatingCF - Math.abs(capex) : null
  const monthlyBurn   = operatingCF != null && operatingCF < 0 ? Math.abs(operatingCF) / 12 : null
  const cashRunwayMonths = cashLatest != null && monthlyBurn != null && monthlyBurn > 0 ? Math.round(cashLatest / monthlyBurn) : null

  return {
    reportPeriod:    latestRev?.end ?? null,
    revenueAnnual:   latestRev?.val ?? null,
    revenueYoY,
    netIncomeAnnual: netIncome,
    cashLatest,
    totalDebt,
    operatingCF,
    capex:           capex != null ? -Math.abs(capex) : null,
    freeCashFlow,
    cashRunwayMonths,
  }
}

export function formatFinancialsForPrompt(f: FinancialSnapshot): string {
  const fmt = (v: number | null) =>
    v == null ? "n/b" : v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(0)}M` : `$${v.toFixed(0)}`

  const yoy    = f.revenueYoY != null ? ` (YoY ${f.revenueYoY >= 0 ? "+" : ""}${f.revenueYoY.toFixed(0)}%)` : ""
  const runway = f.cashRunwayMonths != null ? ` → ${f.cashRunwayMonths} maanden cash runway` : ""
  const fcf    = f.freeCashFlow != null ? (f.freeCashFlow >= 0 ? " (FCF positief)" : " (FCF negatief)") : ""

  return `=== FINANCIËLE KERNCIJFERS (SEC 10-K/10-Q, periode: ${f.reportPeriod ?? "onbekend"}) ===
- Jaaromzet:          ${fmt(f.revenueAnnual)}${yoy}
- Nettoresultaat:     ${fmt(f.netIncomeAnnual)}
- Cash & equiv.:      ${fmt(f.cashLatest)}${runway}
- Totale schuld:      ${fmt(f.totalDebt)}
- Operationele kastr: ${fmt(f.operatingCF)}
- Free cash flow:     ${fmt(f.freeCashFlow)}${fcf}
${f.cashRunwayMonths != null && f.cashRunwayMonths < 18 ? "⚠️  Minder dan 18 maanden cash runway — verhoog dilutierisico en bearcase." : ""}`
}

// ── Insider activiteit (Form 4) ──────────────────────────────────────────

export interface InsiderTx {
  name: string
  role: string
  date: string
  code: string        // P=purchase, S=sale, A=award, G=gift, F=tax, M=option
  shares: number
  price: number
  adCode: string      // A=acquired, D=disposed
}

export interface InsiderActivity {
  transactions: InsiderTx[]
  openBuyShares: number
  openBuyValue: number
  openSellShares: number
  openSellValue: number
  netValue: number          // positief = netto inkoop
  sentiment: "bullish" | "neutral" | "bearish"
  periodDays: number
}

async function fetchSubmissions(cik: string): Promise<Record<string, unknown> | null> {
  const padded = cik.replace(/^0+/, "").padStart(10, "0")
  try {
    const res = await fetch(`${EDGAR_BASE}/submissions/CIK${padded}.json`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(10000),
      // @ts-ignore
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

function parseForm4Xml(xml: string, filingDate: string): InsiderTx | null {
  const tag = (t: string) => new RegExp(`<${t}>\\s*(?:<value>)?([^<]*)(?:<\\/value>)?\\s*<\\/${t}>`, "i").exec(xml)?.[1]?.trim() ?? ""

  const name = tag("rptOwnerName")
  if (!name) return null

  const isDir = tag("isDirector") === "1"
  const isOff = tag("isOfficer") === "1"
  const is10  = tag("isTenPercentOwner") === "1"
  const role  = isDir ? "Director" : isOff ? `Officer (${tag("officerTitle") || "n/b"})` : is10 ? "10%+ Owner" : "Other"

  // Neem de eerste nonDerivativeTransaction (open-market trades)
  const txMatch = /<nonDerivativeTransaction>([\s\S]*?)<\/nonDerivativeTransaction>/.exec(xml)
  if (!txMatch) return null

  const tx = txMatch[1]
  const code   = new RegExp("<transactionCode>([A-Z])<\\/transactionCode>").exec(tx)?.[1] ?? ""
  const shares = parseFloat(new RegExp("<transactionShares>\\s*<value>([^<]+)<\\/value>").exec(tx)?.[1] ?? "0") || 0
  const price  = parseFloat(new RegExp("<transactionPricePerShare>\\s*<value>([^<]+)<\\/value>").exec(tx)?.[1] ?? "0") || 0
  const adCode = new RegExp("<transactionAcquiredDisposedCode>\\s*<value>([AD])<\\/value>").exec(tx)?.[1] ?? ""

  if (!code || shares === 0) return null

  return { name, role, date: filingDate, code, shares, price, adCode }
}

export async function getInsiderActivity(cik: string): Promise<InsiderActivity | null> {
  const subs = await fetchSubmissions(cik)
  if (!subs) return null

  const recent = (subs as {
    filings?: {
      recent?: {
        form: string[]
        filingDate: string[]
        accessionNumber: string[]
        primaryDocument: string[]
      }
    }
    cik?: string
  }).filings?.recent

  if (!recent) return null

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Verzamel Form 4s van de laatste 6 maanden (max 6)
  const form4s: { date: string; accession: string; primaryDoc: string }[] = []
  for (let i = 0; i < recent.form.length && form4s.length < 6; i++) {
    if (recent.form[i] !== "4") continue
    if (new Date(recent.filingDate[i]) < sixMonthsAgo) break
    form4s.push({
      date:       recent.filingDate[i],
      accession:  recent.accessionNumber[i],
      primaryDoc: recent.primaryDocument[i],
    })
  }

  if (form4s.length === 0) return null

  // Haal de raw XML op voor elk Form 4 (parallel)
  // De issuer CIK is in de submissions response
  const issuerCik = String((subs as { cik?: string | number }).cik ?? "").replace(/^0+/, "")

  const txResults = await Promise.allSettled(
    form4s.map(async (f) => {
      const accClean = f.accession.replace(/-/g, "")
      // Probeer eerst het raw XML direct via de index
      const indexUrl = `${SEC_BASE}/Archives/edgar/data/${issuerCik}/${accClean}/${f.accession}-index.htm`
      const idxRes   = await fetch(indexUrl, { headers: HEADERS, signal: AbortSignal.timeout(6000) })
      if (!idxRes.ok) return null
      const idxHtml  = await idxRes.text()

      // Zoek edgardoc.xml link (zonder xslF345X prefix)
      const xmlLink  = /href="([^"]*\/edgardoc\.xml)"/.exec(idxHtml)?.[1]
      if (!xmlLink) return null

      const xmlRes = await fetch(`${SEC_BASE}${xmlLink}`, { headers: HEADERS, signal: AbortSignal.timeout(6000) })
      if (!xmlRes.ok) return null
      const xml = await xmlRes.text()

      return parseForm4Xml(xml, f.date)
    })
  )

  const transactions: InsiderTx[] = txResults
    .filter((r): r is PromiseFulfilledResult<InsiderTx | null> => r.status === "fulfilled" && r.value !== null)
    .map(r => r.value!)

  if (transactions.length === 0) return null

  // Aggregeer open-market inkopen (P) en verkopen (S)
  let openBuyShares = 0, openBuyValue = 0, openSellShares = 0, openSellValue = 0
  for (const tx of transactions) {
    if (tx.code === "P") {
      openBuyShares  += tx.shares
      openBuyValue   += tx.shares * tx.price
    } else if (tx.code === "S") {
      openSellShares += tx.shares
      openSellValue  += tx.shares * tx.price
    }
  }

  const netValue = openBuyValue - openSellValue
  const sentiment: InsiderActivity["sentiment"] =
    netValue > 50_000   ? "bullish" :
    netValue < -200_000 ? "bearish" : "neutral"

  return {
    transactions,
    openBuyShares,
    openBuyValue,
    openSellShares,
    openSellValue,
    netValue,
    sentiment,
    periodDays: 180,
  }
}

export function formatInsiderForPrompt(a: InsiderActivity): string {
  const fmtVal = (v: number) => v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(0)}K` : `$${v.toFixed(0)}`

  const lines: string[] = [`=== INSIDER ACTIVITEIT (SEC Form 4, laatste 6 maanden) ===`]

  const buys  = a.transactions.filter(t => t.code === "P")
  const sells = a.transactions.filter(t => t.code === "S")
  const awards = a.transactions.filter(t => ["A", "M"].includes(t.code))

  if (buys.length > 0) {
    lines.push(`Open-market INKOPEN:`)
    for (const t of buys) lines.push(`  ${t.name} (${t.role}): ${t.shares.toLocaleString()} aand. @ $${t.price.toFixed(2)} = ${fmtVal(t.shares * t.price)} [${t.date}]`)
  }
  if (sells.length > 0) {
    lines.push(`Open-market VERKOPEN:`)
    for (const t of sells) lines.push(`  ${t.name} (${t.role}): ${t.shares.toLocaleString()} aand. @ $${t.price.toFixed(2)} = ${fmtVal(t.shares * t.price)} [${t.date}]`)
  }
  if (awards.length > 0) {
    lines.push(`RSU/Option awards (administratief, geen sentiment): ${awards.map(t => t.name).join(", ")}`)
  }
  if (buys.length === 0 && sells.length === 0) {
    lines.push(`Geen open-market transacties gevonden in de afgelopen 6 maanden.`)
  }

  lines.push(`Netto sentiment: ${a.sentiment.toUpperCase()} (inkoop ${fmtVal(a.openBuyValue)} vs verkoop ${fmtVal(a.openSellValue)})`)
  lines.push(``)
  lines.push(`Score richtlijn insiderOwnership:`)
  lines.push(`  Actief inkopen door insiders (CEO/CFO/Directors) = 8-10`)
  lines.push(`  Geen recente transacties, stabiele houding = 5-7`)
  lines.push(`  Zware verkopen door meerdere insiders = 2-4`)
  lines.push(`  Gebruik ook je trainingskennis over het totale insider ownership % van dit bedrijf.`)

  return lines.join("\n")
}
