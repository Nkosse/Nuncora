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

async function fetchNews(ticker: string) {
  const q = encodeURIComponent(`${ticker} stock`)
  const url = `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
  const xml = await res.text()
  const items: { title: string; url: string; published_at: string; source: string }[] = []
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
    if (title && link) items.push({ title, url: link, published_at: new Date(pub).toISOString(), source: src })
  }
  return items.slice(0, 3)
}

async function main() {
  // 1. Fetch news voor RKLB
  const articles = await fetchNews("RKLB")
  console.log(`Opgehaald: ${articles.length} artikelen voor RKLB`)
  if (articles[0]) {
    console.log(`Voorbeeld URL: ${articles[0].url.slice(0, 80)}…`)
    console.log(`URL lengte: ${articles[0].url.length} tekens`)
  }

  // 2. Probeer opslaan MET onConflict
  const { data: d1, error: e1 } = await sb.from("company_news").upsert(
    articles.map(a => ({ company_id: "rklb", ticker: "RKLB", title: a.title, url: a.url, source: a.source, published_at: a.published_at })),
    { onConflict: "url", ignoreDuplicates: true }
  )
  console.log(`\nUpsert MET onConflict="url": error=${JSON.stringify(e1)}`)

  // 3. Check hoeveel rows er nu in zitten
  const { count: c1 } = await sb.from("company_news").select("*", { count: "exact", head: true }).eq("ticker", "RKLB")
  console.log(`Rows in DB na upsert: ${c1}`)

  // 4. Probeer opslaan ZONDER onConflict (plain insert)
  await sb.from("company_news").delete().eq("ticker", "RKLB")
  const { error: e2 } = await sb.from("company_news").insert(
    articles.map(a => ({ company_id: "rklb", ticker: "RKLB", title: a.title, url: a.url, source: a.source, published_at: a.published_at }))
  )
  console.log(`\nPlain insert: error=${JSON.stringify(e2)}`)
  const { count: c2 } = await sb.from("company_news").select("*", { count: "exact", head: true }).eq("ticker", "RKLB")
  console.log(`Rows in DB na insert: ${c2}`)

  // Opruimen
  await sb.from("company_news").delete().eq("ticker", "RKLB")
}

main()
