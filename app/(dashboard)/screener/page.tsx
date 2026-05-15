import { supabaseAdmin } from "@/lib/supabase/admin"
import { ScreenerClient } from "./screener-client"

export const metadata = { title: "Screener" }
export const revalidate = 300

export default async function ScreenerPage() {
  const { data } = await supabaseAdmin
    .from("companies_with_latest_analysis")
    .select("*")
    .order("score_total", { ascending: false, nullsFirst: false })

  return <ScreenerClient companies={data ?? []} />
}
