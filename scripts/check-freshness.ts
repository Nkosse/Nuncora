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
  const [runs, news, analyses, prices] = await Promise.all([
    sb.from("pipeline_runs").select("started_at, finished_at, status, analyses_run").order("started_at", { ascending: false }).limit(3),
    sb.from("company_news").select("fetched_at").order("fetched_at", { ascending: false }).limit(1).single(),
    sb.from("ai_analyses").select("generated_at").order("generated_at", { ascending: false }).limit(1).single(),
    sb.from("companies").select("last_updated, ticker").order("last_updated", { ascending: false }).limit(1).single(),
  ])

  const ago = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime()
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    return h > 0 ? `${h}u ${m}m geleden` : `${m}m geleden`
  }

  console.log("=== Data Versheid ===\n")
  console.log("Pipeline runs (laatste 3):")
  for (const r of runs.data ?? []) {
    console.log(`  ${r.status.padEnd(8)} ${new Date(r.started_at).toLocaleString("nl-NL")} — ${r.analyses_run ?? 0} analyses`)
  }
  console.log(`\nLaatste analyse:      ${analyses.data?.generated_at ? ago(analyses.data.generated_at) : "—"}`)
  console.log(`Laatste nieuws fetch: ${news.data?.fetched_at ? ago(news.data.fetched_at) : "—"}`)
  console.log(`Laatste prijs update: ${prices.data?.last_updated ? `${ago(prices.data.last_updated)} (${prices.data.ticker})` : "—"}`)
}

main()
