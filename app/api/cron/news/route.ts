import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { fetchNewsForTicker } from "@/lib/news/client"

export const runtime = "nodejs"
export const maxDuration = 60

function authorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return refreshNews()
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return refreshNews()
}

async function saveArticles(
  companyId: string,
  ticker: string,
  articles: { title: string; summary: string; url: string; source: string; publishedAt: string }[]
): Promise<number> {
  if (!articles.length) return 0

  // Haal bestaande URLs op voor dit bedrijf om duplicaten te voorkomen
  const { data: existing } = await supabaseAdmin
    .from("company_news")
    .select("url")
    .eq("company_id", companyId)

  const existingUrls = new Set((existing ?? []).map(r => r.url).filter(Boolean))
  const newArticles  = articles.filter(a => a.url && !existingUrls.has(a.url))

  if (!newArticles.length) return 0

  const { error } = await supabaseAdmin.from("company_news").insert(
    newArticles.map(a => ({
      company_id:   companyId,
      ticker,
      title:        a.title,
      summary:      a.summary,
      url:          a.url,
      source:       a.source,
      published_at: a.publishedAt,
    }))
  )
  if (error) throw error
  return newArticles.length
}

async function refreshNews() {
  const { data: companies } = await supabaseAdmin
    .from("companies")
    .select("ticker, name")
    .eq("is_active", true)
    .order("ticker")

  if (!companies?.length) {
    return NextResponse.json({ success: true, message: "Geen bedrijven gevonden", articlesAdded: 0 })
  }

  let articlesAdded = 0
  let errors = 0

  // Haal nieuws op in batches van 16 parallel
  const BATCH = 16
  for (let i = 0; i < companies.length; i += BATCH) {
    const batch = companies.slice(i, i + BATCH)

    const results = await Promise.allSettled(
      batch.map(async (company) => {
        const articles = await fetchNewsForTicker(company.ticker, company.name)
        return saveArticles(company.ticker.toLowerCase(), company.ticker, articles)
      })
    )

    for (const r of results) {
      if (r.status === "fulfilled") articlesAdded += r.value
      else errors++
    }

    if (i + BATCH < companies.length) {
      await new Promise(r => setTimeout(r, 300))
    }
  }

  return NextResponse.json({
    success: true,
    companiesProcessed: companies.length,
    articlesAdded,
    errors,
  })
}
