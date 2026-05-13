import { supabaseAdmin } from "@/lib/supabase/admin"
import Link from "next/link"
import { Calendar, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = { title: "Catalysts" }
export const revalidate = 3600

function impactCls(level: string) {
  if (level === "Critical") return "text-red-400 bg-red-500/10 border border-red-500/20"
  if (level === "High")     return "text-orange-400 bg-orange-500/10 border border-orange-500/20"
  if (level === "Medium")   return "text-amber-400 bg-amber-500/10 border border-amber-500/20"
  return "text-zinc-400 bg-zinc-800 border border-zinc-700"
}

function typeCls(type: string) {
  const map: Record<string, string> = {
    "Launch":         "text-indigo-400 bg-indigo-500/10",
    "Earnings":       "text-blue-400 bg-blue-500/10",
    "Regulatory":     "text-purple-400 bg-purple-500/10",
    "Contract":       "text-emerald-400 bg-emerald-500/10",
    "Product Launch": "text-cyan-400 bg-cyan-500/10",
    "Partnership":    "text-teal-400 bg-teal-500/10",
    "Financing":      "text-amber-400 bg-amber-500/10",
  }
  return map[type] ?? "text-zinc-400 bg-zinc-800"
}

export default async function CatalystsPage() {
  const { data } = await supabaseAdmin
    .from("upcoming_catalysts")
    .select("*")
    .order("catalyst_date", { ascending: true, nullsFirst: false })

  const all = data ?? []
  const critical = all.filter((c) => c.impact_level === "Critical" || c.impact_level === "High")

  // Groepeer per periode
  const grouped: Record<string, typeof all> = {}
  for (const cat of all) {
    const key = cat.estimated_period
      ?? (cat.catalyst_date
        ? new Date(cat.catalyst_date).toLocaleDateString("nl-NL", { month: "long", year: "numeric" })
        : "Onbekend")
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(cat)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Totaal",    value: all.length,                                              color: "text-indigo-400" },
          { label: "Kritisch",  value: all.filter((c) => c.impact_level === "Critical").length, color: "text-red-400" },
          { label: "Hoog",      value: all.filter((c) => c.impact_level === "High").length,     color: "text-orange-400" },
          { label: "Bedrijven", value: new Set(all.map((c) => c.company_ticker)).size,          color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{s.label}</p>
            <p className={cn("text-2xl font-bold tabular-nums", s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Kritische events */}
      {critical.length > 0 && (
        <div className="rounded-xl border border-red-500/20 bg-zinc-900">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="font-semibold text-zinc-100">Kritische & Hoge Impact Events</h3>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {critical.slice(0, 8).map((cat) => (
              <Link key={cat.id} href={`/companies/${cat.company_id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors">
                <div className="shrink-0 h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-400">{cat.company_ticker?.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    <span className="text-zinc-500 mr-2">{cat.company_ticker}</span>{cat.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-zinc-600">
                    <span>{cat.estimated_period ?? cat.catalyst_date ?? "TBD"}</span>
                    <span className={cn("rounded px-1.5 py-0.5 font-medium", typeCls(cat.catalyst_type))}>{cat.catalyst_type}</span>
                  </div>
                </div>
                <span className={cn("shrink-0 text-xs rounded-md px-1.5 py-0.5 font-medium", impactCls(cat.impact_level))}>
                  {cat.impact_level}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {Object.keys(grouped).length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <Calendar className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">Pipeline is nog bezig — catalysts verschijnen na de eerste run.</p>
        </div>
      ) : Object.entries(grouped).map(([period, cats]) => (
        <div key={period} className="rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-zinc-800 bg-zinc-950/30">
            <Calendar className="h-3.5 w-3.5 text-zinc-600" />
            <h3 className="text-sm font-semibold text-zinc-400 capitalize">{period}</h3>
            <span className="text-xs text-zinc-700 ml-auto">{cats.length} events</span>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {cats.map((cat) => (
              <Link key={cat.id} href={`/companies/${cat.company_id}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors">
                <span className="text-xs font-bold text-indigo-400 w-10 shrink-0">{cat.company_ticker}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{cat.title}</p>
                  <span className={cn("text-[10px] rounded px-1.5 py-0.5 font-medium mt-1 inline-block", typeCls(cat.catalyst_type))}>
                    {cat.catalyst_type}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className={cn("text-xs rounded-md px-1.5 py-0.5 font-medium", impactCls(cat.impact_level))}>
                    {cat.impact_level}
                  </span>
                  <p className="text-xs text-zinc-700 mt-1">{cat.confidence_level}%</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
