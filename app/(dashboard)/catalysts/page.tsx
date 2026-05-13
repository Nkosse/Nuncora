"use client"

import { useState, useMemo } from "react"
import { Calendar, Filter } from "lucide-react"
import { catalysts } from "@/data/mock/catalysts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Disclaimer } from "@/components/shared/disclaimer"
import { cn } from "@/lib/utils"
import Link from "next/link"

const catalystTypes = ["Earnings", "Product Launch", "Regulatory", "Investor Day", "Contract", "Partnership", "Launch", "FDA Milestone", "Financing", "Conference"] as const

function impactCls(level: string) {
  if (level === "Critical") return "bg-red-500/10 text-red-400 border border-red-500/20"
  if (level === "High")     return "bg-orange-500/10 text-orange-400 border border-orange-500/20"
  if (level === "Medium")   return "bg-amber-500/10 text-amber-400 border border-amber-500/20"
  return "bg-zinc-800 text-zinc-500"
}

function typeCls(type: string) {
  const map: Record<string, string> = {
    "Earnings":       "bg-blue-500/10 text-blue-400",
    "Product Launch": "bg-violet-500/10 text-violet-400",
    "Regulatory":     "bg-orange-500/10 text-orange-400",
    "Contract":       "bg-emerald-500/10 text-emerald-400",
    "Launch":         "bg-sky-500/10 text-sky-400",
    "Partnership":    "bg-cyan-500/10 text-cyan-400",
    "Financing":      "bg-red-500/10 text-red-400",
    "Investor Day":   "bg-indigo-500/10 text-indigo-400",
    "Conference":     "bg-zinc-700 text-zinc-400",
  }
  return map[type] ?? "bg-zinc-800 text-zinc-500"
}

function confidenceColor(v: number) {
  if (v >= 80) return "text-emerald-400"
  if (v >= 60) return "text-blue-400"
  if (v >= 40) return "text-amber-400"
  return "text-red-400"
}

export default function CatalystsPage() {
  const [type, setType] = useState("all")
  const [impact, setImpact] = useState("all")
  const [period, setPeriod] = useState("upcoming")

  const filtered = useMemo(() => {
    return catalysts
      .filter((c) => {
        const matchType   = type === "all" || c.type === type
        const matchImpact = impact === "all" || c.impactLevel === impact
        const matchPeriod = period === "all" || (period === "upcoming" && c.isUpcoming)
        return matchType && matchImpact && matchPeriod
      })
      .sort((a, b) => {
        const da = a.date ?? "2099-01-01"
        const db = b.date ?? "2099-01-01"
        return new Date(da).getTime() - new Date(db).getTime()
      })
  }, [type, impact, period])

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    filtered.forEach((c) => {
      const key = c.date
        ? new Date(c.date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : c.estimatedPeriod ?? "TBD"
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(c)
    })
    return map
  }, [filtered])

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-in">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="all">All events</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-44">
            <Filter className="h-3.5 w-3.5 text-zinc-500 mr-1" />
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {catalystTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={impact} onValueChange={setImpact}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Any impact" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any impact</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-zinc-600 ml-auto">{filtered.length} events</span>
      </div>

      {/* Timeline */}
      {grouped.size === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center text-zinc-600 text-sm">
          No catalysts match your filters
        </div>
      ) : (
        Array.from(grouped.entries()).map(([month, events]) => (
          <div key={month}>
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{month}</h3>
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-xs text-zinc-600">{events.length}</span>
            </div>
            <div className="space-y-2">
              {events.map((cat) => (
                <div key={cat.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Date */}
                    <div className="text-center min-w-[52px] pt-0.5">
                      {cat.date ? (
                        <>
                          <p className="text-lg font-bold text-zinc-100 leading-none">
                            {new Date(cat.date).getDate()}
                          </p>
                          <p className="text-xs text-zinc-600">
                            {new Date(cat.date).toLocaleDateString("en-US", { month: "short" })}
                          </p>
                        </>
                      ) : (
                        <p className="text-xs text-zinc-600">{cat.estimatedPeriod}</p>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Link href={`/companies/${cat.companyTicker.toLowerCase()}`} className="font-semibold text-zinc-200 hover:text-white text-sm">
                          {cat.companyTicker}
                        </Link>
                        <span className="text-zinc-500 text-sm">—</span>
                        <span className="text-sm text-zinc-300">{cat.title}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-2">{cat.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn("text-xs rounded-md px-2 py-0.5 font-medium", typeCls(cat.type))}>{cat.type}</span>
                        <span className={cn("text-xs rounded-md px-2 py-0.5 border font-medium", impactCls(cat.impactLevel))}>{cat.impactLevel}</span>
                        <span className="text-xs text-zinc-600">
                          Confidence: <span className={cn("font-medium", confidenceColor(cat.confidenceLevel))}>{cat.confidenceLevel}%</span>
                        </span>
                      </div>
                    </div>

                    {/* Confidence ring */}
                    <div className="shrink-0 hidden sm:flex flex-col items-center gap-1">
                      <div
                        className="relative w-10 h-10 rounded-full"
                        style={{ background: `conic-gradient(${cat.confidenceLevel >= 75 ? "#10b981" : cat.confidenceLevel >= 50 ? "#3b82f6" : "#f59e0b"} ${cat.confidenceLevel * 3.6}deg, #27272a 0deg)` }}
                      >
                        <div className="absolute inset-1 rounded-full bg-zinc-900 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-zinc-300">{cat.confidenceLevel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <Disclaimer compact />
    </div>
  )
}
