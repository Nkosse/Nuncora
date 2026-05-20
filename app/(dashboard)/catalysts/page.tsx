import { supabaseAdmin } from "@/lib/supabase/admin"
import Link from "next/link"
import { Calendar, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = { title: "Catalyst Timeline · Nuncora" }
export const dynamic = "force-dynamic"

const IMPACT_ORDER: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }

function impactCls(level: string) {
  if (level === "Critical") return "text-red-400 bg-red-500/10 border border-red-500/20"
  if (level === "High")     return "text-orange-400 bg-orange-500/10 border border-orange-500/20"
  if (level === "Medium")   return "text-amber-400 bg-amber-500/10 border border-amber-500/20"
  return "text-zinc-400 bg-zinc-800 border border-zinc-700"
}

function impactDot(level: string) {
  if (level === "Critical") return "bg-red-500 ring-2 ring-red-500/20"
  if (level === "High")     return "bg-orange-500 ring-2 ring-orange-500/20"
  if (level === "Medium")   return "bg-amber-500"
  return "bg-zinc-600"
}

function typeCls(type: string) {
  const map: Record<string, string> = {
    "Earnings":       "text-blue-400 bg-blue-500/10",
    "Regulatory":     "text-purple-400 bg-purple-500/10",
    "Contract":       "text-emerald-400 bg-emerald-500/10",
    "Product Launch": "text-cyan-400 bg-cyan-500/10",
    "Launch":         "text-cyan-400 bg-cyan-500/10",
    "Partnership":    "text-teal-400 bg-teal-500/10",
    "Financing":      "text-amber-400 bg-amber-500/10",
    "FDA Milestone":  "text-pink-400 bg-pink-500/10",
    "Conference":     "text-indigo-400 bg-indigo-500/10",
    "Investor Day":   "text-violet-400 bg-violet-500/10",
  }
  return map[type] ?? "text-zinc-400 bg-zinc-800"
}

// Converts "Q3 2026", "H1 2026", "2026" → sortable number
function periodSortKey(period: string | null): number {
  if (!period || period === "Onbekend") return 999_999
  const p = period.trim().toUpperCase()
  const q = /^Q([1-4])\s+(\d{4})$/.exec(p)
  if (q) return parseInt(q[2]) * 10 + parseInt(q[1])
  // H1 = ends June = after Q2; H2 = ends Dec = after Q3
  const h = /^H([12])\s+(\d{4})$/.exec(p)
  if (h) return parseInt(h[2]) * 10 + (h[1] === "1" ? 2.5 : 3.5)
  const y = /^(\d{4})$/.exec(p)
  if (y) return parseInt(y[1]) * 10 + 5
  return 888_888 // non-standard format — before "Onbekend"
}

function currentQuarter(): string {
  const now = new Date()
  return `Q${Math.ceil((now.getMonth() + 1) / 3)} ${now.getFullYear()}`
}

function periodLabel(period: string): { main: string; sub: string } {
  const p = period.trim().toUpperCase()
  if (/^Q([1-4])\s+(\d{4})$/.test(p)) {
    const [, qtr, year] = /^Q([1-4])\s+(\d{4})$/.exec(p)!
    const months = ["", "Jan – Mar", "Apr – Jun", "Jul – Sep", "Okt – Dec"]
    return { main: period, sub: months[parseInt(qtr)] + " " + year }
  }
  if (/^H([12])\s+(\d{4})$/.test(p)) {
    const [, h, year] = /^H([12])\s+(\d{4})$/.exec(p)!
    return { main: period, sub: h === "1" ? `Jan – Jun ${year}` : `Jul – Dec ${year}` }
  }
  return { main: period, sub: "" }
}

type Cat = {
  id: string
  company_id: string
  company_ticker: string
  company_name?: string
  title: string
  catalyst_type: string
  impact_level: string
  estimated_period: string | null
  catalyst_date: string | null
  confidence_level: number
}

export default async function CatalystsPage() {
  const { data } = await supabaseAdmin
    .from("upcoming_catalysts")
    .select("*")

  const all: Cat[] = data ?? []
  const thisQ = currentQuarter()

  // Group by period
  const grouped = new Map<string, Cat[]>()
  for (const cat of all) {
    const key = cat.estimated_period?.trim()
      ?? (cat.catalyst_date
          ? new Date(cat.catalyst_date).toLocaleDateString("nl-NL", { month: "long", year: "numeric" })
          : "Onbekend")
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(cat)
  }

  // Sort periods chronologically
  const sortedPeriods = [...grouped.entries()].sort(
    (a, b) => periodSortKey(a[0]) - periodSortKey(b[0])
  )

  // Within each period: Critical → High → Medium → Low, then confidence ↓
  for (const [, cats] of sortedPeriods) {
    cats.sort((a, b) => {
      const imp = (IMPACT_ORDER[a.impact_level] ?? 4) - (IMPACT_ORDER[b.impact_level] ?? 4)
      return imp !== 0 ? imp : b.confidence_level - a.confidence_level
    })
  }

  const criticalCount = all.filter(c => c.impact_level === "Critical").length
  const highCount     = all.filter(c => c.impact_level === "High").length
  const companyCount  = new Set(all.map(c => c.company_id)).size

  // Top 4 upcoming high-impact catalysts (for the spotlight)
  const spotlight = [...all]
    .filter(c => c.impact_level === "Critical" || c.impact_level === "High")
    .sort((a, b) => {
      const pk = periodSortKey(a.estimated_period) - periodSortKey(b.estimated_period)
      return pk !== 0 ? pk : (IMPACT_ORDER[a.impact_level] ?? 4) - (IMPACT_ORDER[b.impact_level] ?? 4)
    })
    .slice(0, 4)

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Catalyst Timeline</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Aankomende events gesorteerd per periode · AI-gegenereerd op basis van SEC-filings en marktdata
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Totaal catalysts", value: all.length,    color: "text-zinc-100" },
          { label: "Kritisch",          value: criticalCount, color: "text-red-400" },
          { label: "Hoog impact",       value: highCount,     color: "text-orange-400" },
          { label: "Bedrijven",         value: companyCount,  color: "text-indigo-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={cn("text-2xl font-bold tabular-nums", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Spotlight: eerstvolgende hoge-impact events */}
      {spotlight.length > 0 && (
        <div className="rounded-xl border border-orange-500/20 bg-zinc-900">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-zinc-800">
            <Zap className="h-4 w-4 text-orange-400" />
            <h2 className="font-semibold text-zinc-100">Eerstvolgende hoge-impact events</h2>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {spotlight.map(cat => (
              <Link key={cat.id} href={`/companies/${cat.company_id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors group">
                <div className="shrink-0 h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-400 font-mono">{cat.company_ticker?.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-white">
                    <span className="text-zinc-500 font-mono mr-2">{cat.company_ticker}</span>
                    {cat.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-600">
                    <Calendar className="h-3 w-3" />
                    <span>{cat.estimated_period ?? cat.catalyst_date ?? "TBD"}</span>
                    <span className={cn("rounded px-1.5 py-0.5 font-medium", typeCls(cat.catalyst_type))}>
                      {cat.catalyst_type}
                    </span>
                  </div>
                </div>
                <span className={cn("shrink-0 text-xs rounded-md px-2 py-0.5 font-semibold border", impactCls(cat.impact_level))}>
                  {cat.impact_level}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {all.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <Calendar className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Nog geen catalysts — pipeline draait binnenkort.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Verticale tijdlijn-lijn */}
          <div className="absolute left-[19px] top-4 bottom-4 w-px bg-zinc-800" />

          <div className="space-y-10">
            {sortedPeriods.map(([period, cats]) => {
              const isCurrent = period === thisQ
              const isUnknown = period === "Onbekend"
              const { main, sub } = periodLabel(period)

              return (
                <div key={period} className="relative pl-12">
                  {/* Tijdlijn-stip */}
                  <div className={cn(
                    "absolute left-0 top-0.5 h-10 w-10 rounded-full border-2 flex items-center justify-center transition-colors",
                    isCurrent
                      ? "bg-indigo-500/20 border-indigo-500"
                      : isUnknown
                      ? "bg-zinc-900 border-zinc-700"
                      : "bg-zinc-900 border-zinc-800"
                  )}>
                    <Calendar className={cn("h-4 w-4", isCurrent ? "text-indigo-400" : "text-zinc-600")} />
                  </div>

                  {/* Periode-label */}
                  <div className="flex items-center gap-2 mb-3 pt-1">
                    <div>
                      <span className={cn("text-sm font-bold", isCurrent ? "text-indigo-400" : isUnknown ? "text-zinc-600" : "text-zinc-300")}>
                        {main}
                      </span>
                      {sub && <span className="ml-2 text-xs text-zinc-600">{sub}</span>}
                    </div>
                    {isCurrent && (
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-full px-2 py-0.5 font-semibold uppercase tracking-wider">
                        nu
                      </span>
                    )}
                    <span className="ml-auto text-xs text-zinc-700">
                      {cats.length} {cats.length === 1 ? "catalyst" : "catalysts"}
                    </span>
                  </div>

                  {/* Catalyst-kaarten */}
                  <div className="space-y-2">
                    {cats.map(cat => (
                      <Link key={cat.id} href={`/companies/${cat.company_id}`}
                        className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 hover:bg-zinc-800/60 hover:border-zinc-700 transition-all group">

                        {/* Impact-stip */}
                        <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", impactDot(cat.impact_level))} />

                        {/* Ticker */}
                        <span className="text-xs font-bold text-indigo-400 w-12 shrink-0 font-mono tracking-wide">
                          {cat.company_ticker}
                        </span>

                        {/* Titel + type */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-200 truncate group-hover:text-white leading-snug">
                            {cat.title}
                          </p>
                          <span className={cn("text-[10px] rounded px-1.5 py-0.5 font-medium mt-1 inline-block", typeCls(cat.catalyst_type))}>
                            {cat.catalyst_type}
                          </span>
                        </div>

                        {/* Zekerheidsbalkie */}
                        <div className="shrink-0 hidden sm:flex items-center gap-1.5">
                          <div className="w-14 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full rounded-full",
                                cat.confidence_level >= 70 ? "bg-emerald-500" :
                                cat.confidence_level >= 45 ? "bg-amber-500" : "bg-red-500")}
                              style={{ width: `${cat.confidence_level}%` }}
                            />
                          </div>
                          <span className="text-xs text-zinc-600 w-7 tabular-nums">{cat.confidence_level}%</span>
                        </div>

                        {/* Impact-badge */}
                        <span className={cn("shrink-0 text-xs rounded-md px-1.5 py-0.5 font-semibold border", impactCls(cat.impact_level))}>
                          {cat.impact_level}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-zinc-700 text-center pb-2">
        Catalysts zijn AI-gegenereerd · periodes zijn schattingen, geen garanties
      </p>
    </div>
  )
}
