import Link from "next/link"
import { TrendingUp, TrendingDown, AlertTriangle, Calendar, ArrowRight, Zap, Building2, Star, RefreshCw } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { SectorBadge } from "@/components/shared/sector-badge"
import { Disclaimer } from "@/components/shared/disclaimer"
import { Button } from "@/components/ui/button"

export const metadata = { title: "Dashboard" }
export const revalidate = 3600 // ververs elke 60 minuten

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-blue-400"
  if (s >= 50) return "text-amber-400"
  return "text-red-400"
}

function impactColor(level: string) {
  if (level === "Critical") return "text-red-400 bg-red-500/10 border-red-500/20"
  if (level === "High")     return "text-orange-400 bg-orange-500/10 border-orange-500/20"
  return "text-amber-400 bg-amber-500/10 border-amber-500/20"
}

function riskColor(level: string) {
  if (level === "very-high") return "text-red-400"
  if (level === "high")      return "text-orange-400"
  if (level === "medium")    return "text-amber-400"
  return "text-emerald-400"
}

export default async function DashboardPage() {
  // Data ophalen uit Supabase
  const [companiesRes, catalystsRes, runRes, lastNewsRes, lastAnalysisRes] = await Promise.allSettled([
    supabaseAdmin
      .from("companies_with_latest_analysis")
      .select("*")
      .not("score_total", "is", null)
      .order("score_total", { ascending: false }),
    supabaseAdmin
      .from("upcoming_catalysts")
      .select("*")
      .limit(6),
    supabaseAdmin
      .from("pipeline_runs")
      .select("finished_at, status, companies_updated, analyses_run")
      .eq("status", "success")
      .order("finished_at", { ascending: false })
      .limit(1)
      .single(),
    supabaseAdmin
      .from("company_news")
      .select("fetched_at")
      .order("fetched_at", { ascending: false })
      .limit(1)
      .single(),
    supabaseAdmin
      .from("ai_analyses")
      .select("generated_at")
      .order("generated_at", { ascending: false })
      .limit(1)
      .single(),
  ])

  const companies    = companiesRes.status    === "fulfilled" ? (companiesRes.value.data ?? [])    : []
  const catalysts    = catalystsRes.status    === "fulfilled" ? (catalystsRes.value.data ?? [])    : []
  const lastRun      = runRes.status          === "fulfilled" ? runRes.value.data                  : null
  const lastNewsFetch = lastNewsRes.status    === "fulfilled" ? lastNewsRes.value.data?.fetched_at : null
  const lastAnalysis  = lastAnalysisRes.status === "fulfilled" ? lastAnalysisRes.value.data?.generated_at : null

  function timeAgo(ts: string | null): string {
    if (!ts) return "—"
    const diff = Date.now() - new Date(ts).getTime()
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    if (h >= 24) return `${Math.floor(h / 24)}d geleden`
    if (h > 0)   return `${h}u geleden`
    return `${m}m geleden`
  }

  function freshnessColor(ts: string | null, warnAfterHours: number): string {
    if (!ts) return "bg-zinc-600"
    const h = (Date.now() - new Date(ts).getTime()) / 3600000
    if (h < warnAfterHours * 0.5) return "bg-emerald-400"
    if (h < warnAfterHours)       return "bg-amber-400"
    return "bg-red-400"
  }

  const topOpportunities = companies.slice(0, 6)
  const avgScore = companies.length > 0
    ? Math.round(companies.reduce((s, c) => s + (c.score_total ?? 0), 0) / companies.length)
    : 0
  const highRisk = companies.filter((c) => c.risk_level === "high" || c.risk_level === "very-high").slice(0, 3)

  // Sector-overzicht berekenen
  const sectorMap: Record<string, { count: number; totalScore: number; emoji: string }> = {}
  const sectorEmoji: Record<string, string> = {
    "Industrials": "🚀", "Technology": "💻", "Healthcare": "🧬",
    "Energy": "⚡", "Communication Services": "📡", "Consumer Discretionary": "🤖",
    "Financials": "💰", "Materials": "⚗️", "Utilities": "🔋",
  }
  for (const c of companies) {
    const s = c.sector ?? "Other"
    if (!sectorMap[s]) sectorMap[s] = { count: 0, totalScore: 0, emoji: sectorEmoji[s] ?? "📊" }
    sectorMap[s].count++
    sectorMap[s].totalScore += c.score_total ?? 0
  }
  const sectorStats = Object.entries(sectorMap)
    .map(([sector, d]) => ({ sector, count: d.count, avgScore: Math.round(d.totalScore / d.count), emoji: d.emoji }))
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 4)

  const isEmpty = companies.length === 0
  const today = new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Investment Intelligence</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {lastRun
              ? `Bijgewerkt op ${new Date(lastRun.finished_at).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })} · ${lastRun.analyses_run} bedrijven geanalyseerd`
              : `${today} · Wacht op eerste pipeline-run`}
          </p>
        </div>
        <Link href="/companies">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Alle bedrijven
          </Button>
        </Link>
      </div>

      {/* Data versheid */}
      <div className="flex flex-wrap gap-3 text-xs">
        {[
          { label: "Analyses",  ts: lastAnalysis,  warn: 26 },
          { label: "Nieuws",    ts: lastNewsFetch, warn: 26 },
          { label: "Pipeline",  ts: lastRun?.finished_at ?? null, warn: 26 },
        ].map(({ label, ts, warn }) => (
          <div key={label} className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1">
            <span className={`h-1.5 w-1.5 rounded-full ${freshnessColor(ts, warn)}`} />
            <span className="text-zinc-500">{label}:</span>
            <span className="text-zinc-300 font-medium">{timeAgo(ts)}</span>
          </div>
        ))}
      </div>

      {/* Pipeline nog niet gedraaid */}
      {isEmpty && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-6 text-center">
          <RefreshCw className="h-8 w-8 text-indigo-400 mx-auto mb-3 animate-spin" />
          <p className="text-sm font-semibold text-indigo-300">Pipeline is aan het draaien</p>
          <p className="text-xs text-zinc-500 mt-1">Claude is bezig met het ontdekken en analyseren van bedrijven. Dit duurt 15–25 minuten.</p>
        </div>
      )}

      {/* KPI row */}
      {!isEmpty && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Bedrijven gevolgd",    value: companies.length.toString(),       sub: "Actief gevolgd",             icon: Building2,     color: "text-indigo-400" },
            { label: "Gem. Upside Score",    value: `${avgScore}/100`,                 sub: "Over alle bedrijven",        icon: TrendingUp,    color: "text-emerald-400" },
            { label: "Komende catalysts",    value: catalysts.length.toString(),       sub: "Geïdentificeerd",            icon: Calendar,      color: "text-amber-400" },
            { label: "Hoog risico",          value: highRisk.length.toString(),        sub: "Vereisen aandacht",          icon: AlertTriangle, color: "text-red-400" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-zinc-600 mt-1">{stat.sub}</p>
              </div>
            )
          })}
        </div>
      )}

      {!isEmpty && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top kansen */}
          <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400" />
                <h3 className="font-semibold text-zinc-100">Top Asymmetrische Kansen</h3>
              </div>
              <Link href="/companies" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Alle <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {topOpportunities.map((company) => (
                <Link
                  key={company.id}
                  href={`/companies/${company.slug}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-indigo-400">{company.ticker.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-200 group-hover:text-white truncate">{company.name}</span>
                      <span className="text-xs text-zinc-600 font-mono shrink-0">{company.ticker}</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-0.5 truncate">{company.sector}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-lg font-bold tabular-nums ${scoreColor(company.score_total ?? 0)}`}>{company.score_total}</p>
                    <p className="text-xs text-zinc-600">/ 100</p>
                  </div>
                  <div className="text-right shrink-0 w-16">
                    <p className="text-sm font-semibold tabular-nums text-zinc-200">${company.price?.toFixed(2) ?? "—"}</p>
                    <p className={`text-xs ${(company.price_change_pct ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {(company.price_change_pct ?? 0) >= 0 ? "+" : ""}{(company.price_change_pct ?? 0).toFixed(1)}%
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Rechterkolom */}
          <div className="space-y-5">
            {/* Catalysts */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <h3 className="font-semibold text-zinc-100">Komende Catalysts</h3>
                </div>
                <Link href="/catalysts" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  Alle <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {catalysts.length === 0 && (
                  <p className="text-xs text-zinc-600 px-5 py-4">Nog geen catalysts — pipeline loopt nog.</p>
                )}
                {catalysts.map((cat) => (
                  <div key={cat.id} className="px-5 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">{cat.company_ticker} · {cat.title}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">{cat.estimated_period ?? cat.catalyst_date}</p>
                      </div>
                      <span className={`shrink-0 text-xs rounded-md px-1.5 py-0.5 border font-medium ${impactColor(cat.impact_level)}`}>
                        {cat.impact_level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk alerts */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <h3 className="font-semibold text-zinc-100">Risico Alerts</h3>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {highRisk.length === 0 && (
                  <p className="text-xs text-zinc-600 px-5 py-4">Geen hoog-risico bedrijven gevonden.</p>
                )}
                {highRisk.map((company) => (
                  <Link key={company.id} href={`/companies/${company.slug}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/40 transition-colors">
                    <div className="h-7 w-7 rounded bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-red-400">{company.ticker.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-300 truncate">{company.name}</p>
                      <p className={`text-xs mt-0.5 ${riskColor(company.risk_level)}`}>
                        Risico: {company.risk_level}
                      </p>
                    </div>
                    <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sector overzicht */}
      {sectorStats.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sector Overzicht</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sectorStats.map((s) => (
              <Link key={s.sector} href={`/companies?sector=${encodeURIComponent(s.sector)}`}>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors">
                  <div className="text-2xl mb-2">{s.emoji}</div>
                  <p className="text-sm font-semibold text-zinc-200">{s.sector}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-zinc-600">{s.count} bedrijven</span>
                    <span className={`text-xs font-bold ${scoreColor(s.avgScore)}`}>Gem. {s.avgScore}</span>
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${s.avgScore}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/ai-research", icon: Zap,        label: "Research",        desc: "Pipeline status & analyses",           color: "text-violet-400" },
          { href: "/watchlists",  icon: Star,        label: "Watchlists",      desc: "Thematische investeringslijsten",       color: "text-amber-400" },
          { href: "/screener",    icon: TrendingUp,  label: "Screener",        desc: "Filter op score, sector en risico",     color: "text-emerald-400" },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{item.label}</p>
                  <p className="text-xs text-zinc-600">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-700 ml-auto" />
              </div>
            </Link>
          )
        })}
      </div>

      <Disclaimer compact />
    </div>
  )
}
