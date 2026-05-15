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

async function main() {
  const { data: total } = await sb.from("company_news").select("id", { count: "exact", head: true })
  const { count }       = await sb.from("company_news").select("*", { count: "exact", head: true })
  const { data: recent } = await sb
    .from("company_news")
    .select("ticker, title, published_at, fetched_at, url")
    .order("fetched_at", { ascending: false })
    .limit(5)

  const { data: withNews } = await sb
    .from("company_news")
    .select("ticker")
  const unique = new Set(withNews?.map(n => n.ticker) ?? [])

  const { data: allCompanies } = await sb
    .from("companies")
    .select("ticker")
    .eq("is_active", true)

  const noNews = (allCompanies ?? []).filter(c => !unique.has(c.ticker)).map(c => c.ticker)

  console.log(`Totaal nieuwsartikelen in DB: ${count}`)
  console.log(`Bedrijven met nieuws: ${unique.size} / ${allCompanies?.length}`)
  console.log(`\nBedrijven ZONDER nieuws (${noNews.length}): ${noNews.join(", ")}`)
  console.log(`\nMeest recente artikelen:`)
  for (const n of recent ?? []) {
    console.log(`  [${n.ticker}] ${n.title?.slice(0, 60)}`)
    console.log(`    gepubliceerd: ${n.published_at} | opgehaald: ${n.fetched_at}`)
    console.log(`    url: ${n.url ? (n.url.length > 80 ? n.url.slice(0, 80) + "…" : n.url) : "GEEN URL"}`)
  }
}

main()
