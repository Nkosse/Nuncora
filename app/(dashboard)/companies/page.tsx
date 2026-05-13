import { supabaseAdmin } from "@/lib/supabase/admin"
import { CompaniesClient } from "./companies-client"

export const metadata = { title: "Bedrijven" }
export const revalidate = 3600

export default async function CompaniesPage() {
  const { data } = await supabaseAdmin
    .from("companies_with_latest_analysis")
    .select("*")
    .order("score_total", { ascending: false, nullsFirst: false })

  return <CompaniesClient companies={data ?? []} />
}
