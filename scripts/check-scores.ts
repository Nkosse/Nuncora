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
  const { data: noScore } = await sb
    .from("companies_with_latest_analysis")
    .select("ticker, name, score_total")
    .is("score_total", null)

  const { data: all } = await sb
    .from("companies")
    .select("ticker")
    .eq("is_active", true)

  const { data: withScore } = await sb
    .from("companies_with_latest_analysis")
    .select("ticker")
    .not("score_total", "is", null)

  console.log("Totaal in companies tabel:", all?.length)
  console.log("Met score:", withScore?.length)
  console.log("Zonder score:", noScore?.length)
  if (noScore?.length) {
    console.log("Tickers zonder score:", noScore.map(c => c.ticker).join(", "))
  }
}

main()
