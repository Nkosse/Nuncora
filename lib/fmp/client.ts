const FMP_BASE = "https://financialmodelingprep.com/stable"
const apiKey = process.env.FMP_API_KEY

async function fmp(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${FMP_BASE}${path}`)
  url.searchParams.set("apikey", apiKey ?? "")
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error(`FMP ${path} → ${res.status}`)
  const data = await res.json()
  // FMP returns error messages as plain strings or objects with "Error Message"
  if (typeof data === "string" || data?.["Error Message"]) {
    throw new Error(data?.["Error Message"] ?? data)
  }
  return data
}

export interface FMPProfile {
  symbol: string
  companyName: string
  price: number
  marketCap: number
  beta: number
  volume: number
  averageVolume: number
  exchange: string
  industry: string
  website: string
  description: string
  ceo: string
  sector: string
  country: string
  fullTimeEmployees: string
  ipoDate: string
  image: string
  isActivelyTrading: boolean
  cik: string | null
}

export async function getCompanyProfile(ticker: string): Promise<FMPProfile | null> {
  try {
    const data = await fmp(`/profile`, { symbol: ticker })
    return Array.isArray(data) && data.length > 0 ? data[0] : null
  } catch {
    return null
  }
}

export async function getMultipleProfiles(tickers: string[]): Promise<FMPProfile[]> {
  const results = await Promise.allSettled(tickers.map((t) => getCompanyProfile(t)))
  return results
    .filter((r): r is PromiseFulfilledResult<FMPProfile> => r.status === "fulfilled" && r.value !== null)
    .map((r) => r.value)
}

export interface FMPQuote {
  symbol: string
  price: number
  changesPercentage: number
  marketCap: number
}

// Haalt live koersen op voor meerdere tickers in één API-call
export async function batchGetPrices(tickers: string[]): Promise<FMPQuote[]> {
  if (tickers.length === 0) return []
  try {
    const data = await fmp("/quote", { symbol: tickers.join(",") })
    if (!Array.isArray(data)) return []
    return data.map((q: FMPQuote) => ({
      symbol: q.symbol,
      price: q.price,
      changesPercentage: q.changesPercentage,
      marketCap: q.marketCap,
    }))
  } catch {
    return []
  }
}

// Curated future-tech smallcap tickers
export const SEED_TICKERS = [
  // Space
  "RKLB", "LUNR", "ASTS", "SPIR",
  // Quantum
  "IONQ", "QBTS", "RGTI", "QUBT",
  // AI/Defense
  "KTOS", "AVAV",
  // Energy storage
  "BEEM", "QS",
  // Photonics
  "LITE", "VICR",
  // eVTOL
  "JOBY", "ACHR",
  // Crypto/Quantum-safe
  "ARQQ",
  // Robotics/Autonomy
  "SERV",
]
