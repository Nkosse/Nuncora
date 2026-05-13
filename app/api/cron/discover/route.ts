import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { discoverCandidates, validateAndFilterTickers } from "@/lib/discovery/client"

export const runtime = "nodejs"
export const maxDuration = 120

function authorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return discover()
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return discover()
}

async function discover() {
  const { data: existing } = await supabaseAdmin
    .from("companies")
    .select("ticker")
    .eq("is_active", true)

  const existingTickers = existing?.map((c) => c.ticker) ?? []

  const candidates = await discoverCandidates()
  const validated = await validateAndFilterTickers(candidates, existingTickers)

  let added = 0
  for (const v of validated) {
    const companyId = v.ticker.toLowerCase()
    await supabaseAdmin.from("companies").upsert({
      id: companyId,
      slug: companyId,
      ticker: v.ticker,
      name: v.name,
      market_cap: v.marketCap,
      is_active: true,
      discovered_at: new Date().toISOString(),
    }, { onConflict: "id" })
    added++
  }

  return NextResponse.json({
    success: true,
    candidatesFound: candidates.length,
    validated: validated.length,
    added,
    existingBefore: existingTickers.length,
  })
}
