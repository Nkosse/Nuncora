import { supabaseAdmin } from "@/lib/supabase/admin"
import Link from "next/link"
import { Brain, TrendingUp, AlertTriangle, Calendar, ArrowRight, Newspaper } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = { title: "Research" }
export const revalidate = 300

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-blue-400"
  if (s >= 50) return "text-amber-400"
  return "text-red-400"
}

export default async function AIResearchPage() {
  const { data: companies } = await supabaseAdmin
    .from("companies_with_latest_analysis")
    .select("*")
    .not("score_total", "is", null)
    .order("score_total", { ascending: false })

  const { data: recentNews } = await supabaseAdmin
    .from("recent_news")
    .select("*")
    .limit(10)

  const { data: lastRun } = await supabaseAdmin
    .from("pipeline_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(1)
    .single()

  const all = companies ?? []
  const news = recentNews ?? []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Pipeline status */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <Brain className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Research Pipeline</p>
            <p className="text-xs text-zinc-500">Nachtelijke analyse — elke dag 02:00 Amsterdam</p>
          </div>
          {lastRun && (
            <div className="ml-auto text-right">
              <div className={cn("text-xs font-medium rounded px-2 py-0.5", lastRun.status === "success" ? "text-emerald-400 bg-emerald-500/10" : lastRun.status === "running" ? "text-blue-400 bg-blue-500/10" : "text-amber-400 bg-amber-500/10")}>
                {lastRun.status}
              </div>
              <p className="text-xs text-zinc-600 mt-1">
                {new Date(lastRun.started_at).toLocaleDateString("nl-NL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          )}
        </div>

        {lastRun && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Gevonden",         value: lastRun.companies_found ?? 0,    color: "text-zinc-300" },
              { label: "Prijzen ververst", value: lastRun.prices_refreshed ?? 0,  color: "text-emerald-400" },
              { label: "Analyses",         value: lastRun.analyses_run ?? 0,       color: "text-indigo-400" },
              { label: "Fouten",           value: (lastRun.errors ?? []).length,   color: (lastRun.errors ?? []).length > 0 ? "text-red-400" : "text-zinc-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-3 text-center">
                <p className={cn("text-xl font-bold tabular-nums", s.color)}>{s.value}</p>
                <p className="text-xs text-zinc-600 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {!lastRun && (
          <p className="text-sm text-zinc-500 text-center py-4">Pipeline heeft nog niet gedraaid.</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top analyses */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="font-semibold text-zinc-100">Hoogste Conviction Analyses</h3>
              </div>
              <Link href="/companies" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Alle <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {all.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-12">Pipeline is nog bezig.</p>
            ) : (
              <div className="divide-y divide-zinc-800/50">
                {all.slice(0, 8).map((c) => (
                  <Link key={c.id} href={`/companies/${c.slug}`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-zinc-800/40 transition-colors group">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-indigo-400">{c.ticker?.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-zinc-100">{c.name}</span>
                        <span className="text-xs text-zinc-600 font-mono">{c.ticker}</span>
                      </div>
                      {c.summary && (
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{c.summary}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn("text-lg font-bold tabular-nums", scoreColor(c.score_total ?? 0))}>{c.score_total}</p>
                      <p className="text-xs text-zinc-700">/ 100</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Hoog risico alerts */}
          {all.filter((c) => c.risk_level === "very-high").length > 0 && (
            <div className="rounded-xl border border-red-500/20 bg-zinc-900">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <h3 className="font-semibold text-zinc-100">Zeer Hoog Risico</h3>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {all.filter((c) => c.risk_level === "very-high").map((c) => (
                  <Link key={c.id} href={`/companies/${c.slug}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/40 transition-colors">
                    <span className="text-xs font-bold text-red-400 w-12 shrink-0">{c.ticker}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-300 truncate">{c.name}</p>
                    </div>
                    <span className="text-sm font-bold text-red-400 shrink-0">{c.score_total}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rechts: recent nieuws */}
        <div className="space-y-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
              <Newspaper className="h-4 w-4 text-indigo-400" />
              <h3 className="font-semibold text-zinc-100">Recent Nieuws</h3>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {news.length === 0 ? (
                <p className="text-xs text-zinc-600 px-5 py-4">Nog geen nieuws opgehaald.</p>
              ) : news.map((n) => (
                <a key={n.id} href={n.url ?? "#"} target="_blank" rel="noopener noreferrer"
                  className="block px-5 py-3.5 hover:bg-zinc-800/40 transition-colors">
                  <div className="flex items-start gap-2 mb-1">
                    <span className="text-[10px] font-bold text-indigo-400 shrink-0 mt-0.5">{n.company_ticker}</span>
                    <p className="text-xs font-medium text-zinc-300 leading-snug line-clamp-2">{n.title}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-700">
                    <span>{n.source}</span>
                    {n.published_at && (
                      <span>{new Date(n.published_at).toLocaleDateString("nl-NL")}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Komende catalysts sidebar */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
              <Calendar className="h-4 w-4 text-amber-400" />
              <h3 className="font-semibold text-zinc-100">Komende Catalysts</h3>
            </div>
            <div className="px-5 py-3">
              <Link href="/catalysts" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                Bekijk alle catalysts <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
