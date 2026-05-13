import "dotenv/config"
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })

const tickers = ["RKLB", "IONQ", "ASTS", "KTOS", "JOBY", "AVAV", "QBTS", "RGTI", "QS", "ACHR"]

async function fetchOne(ticker: string) {
  const q   = encodeURIComponent(`${ticker} stock`)
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`
  const t0  = Date.now()
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(6000) })
  const text = await res.text()
  const count = (text.match(/<item>/g) ?? []).length
  return { ticker, ms: Date.now() - t0, articles: count }
}

async function main() {
  const t0 = Date.now()
  const results = await Promise.allSettled(tickers.map(fetchOne))
  const total = Date.now() - t0

  for (const r of results) {
    if (r.status === "fulfilled") console.log(`  ${r.value.ticker.padEnd(6)}: ${r.value.articles} artikelen in ${r.value.ms}ms`)
  }
  console.log(`\n10 tickers parallel: ${total}ms`)
  console.log(`Schatting 64 tickers (8x batch van 8): ~${Math.ceil(total / 1000 * 8)}s`)
}

main()
