import "dotenv/config"
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(process.cwd(), ".env.local") })
import { createClient } from "@supabase/supabase-js"

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function fetchNews(ticker: string, name: string) {
  try {
    const q = encodeURIComponent(`${ticker} ${name} stock`)
    const url = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(8000) })
    if (!res.ok) return []
    const xml = await res.text()
    const items: { title: string; url: string; summary: string; source: string; publishedAt: string }[] = []
    const rx = /<item>([\s\S]*?)<\/item>/g
    let m
    while ((m = rx.exec(xml)) !== null) {
      const b = m[1]
      const get = (tag: string) => new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`).exec(b)?.[1] ?? ""
      const cdata = (s: string) => /^<!\[CDATA\[([\s\S]*)\]\]>$/.exec(s.trim())?.[1] ?? s
      const title = cdata(get("title")).trim()
      const link  = get("link").trim()
      const pub   = get("pubDate").trim()
      const src   = cdata(get("source")).trim()
      const desc  = cdata(get("description")).replace(/<[^>]+>/g, "").trim()
      if (title && link) items.push({ title, url: link, summary: desc.slice(0, 300), source: src, publishedAt: pub ? new Date(pub).toISOString() : new Date().toISOString() })
    }
    return items.slice(0, 8)
  } catch { return [] }
}

async function main() {
  const { data: companies } = await sb.from("companies").select("ticker, name").eq("is_active", true).order("ticker")
  if (!companies?.length) { console.log("Geen bedrijven"); return }

  console.log(`Nieuws ophalen voor ${companies.length} bedrijven...\n`)
  let totalAdded = 0

  const BATCH = 16
  for (let i = 0; i < companies.length; i += BATCH) {
    const batch = companies.slice(i, i + BATCH)
    const results = await Promise.allSettled(batch.map(async c => {
      const articles = await fetchNews(c.ticker, c.name)
      if (!articles.length) return { ticker: c.ticker, added: 0 }

      const { data: existing } = await sb.from("company_news").select("url").eq("company_id", c.ticker.toLowerCase())
      const existingUrls = new Set((existing ?? []).map(r => r.url).filter(Boolean))
      const newOnes = articles.filter(a => a.url && !existingUrls.has(a.url))

      if (newOnes.length > 0) {
        await sb.from("company_news").insert(
          newOnes.map(a => ({ company_id: c.ticker.toLowerCase(), ticker: c.ticker, title: a.title, summary: a.summary, url: a.url, source: a.source, published_at: a.publishedAt }))
        )
      }
      return { ticker: c.ticker, added: newOnes.length }
    }))

    for (const r of results) {
      if (r.status === "fulfilled") {
        process.stdout.write(`  ${r.value.ticker.padEnd(6)} +${r.value.added} artikelen\n`)
        totalAdded += r.value.added
      }
    }
    if (i + BATCH < companies.length) await new Promise(r => setTimeout(r, 400))
  }

  console.log(`\n✓ Klaar: ${totalAdded} nieuwe artikelen opgeslagen voor ${companies.length} bedrijven`)
}

main()
