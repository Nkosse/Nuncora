"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Filter, RotateCcw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Disclaimer } from "@/components/shared/disclaimer"
import { cn } from "@/lib/utils"

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-blue-400"
  if (s >= 50) return "text-amber-400"
  return "text-red-400"
}

function riskBadge(level: string) {
  if (level === "very-high") return "text-red-400 bg-red-500/10"
  if (level === "high")      return "text-orange-400 bg-orange-500/10"
  if (level === "medium")    return "text-amber-400 bg-amber-500/10"
  return "text-emerald-400 bg-emerald-500/10"
}

function fmtMCap(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(0)}M`
  return `$${v}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ScreenerClient({ companies }: { companies: any[] }) {
  const [sector,   setSector]   = useState("all")
  const [minScore, setMinScore] = useState("0")
  const [maxMCap,  setMaxMCap]  = useState("all")
  const [risk,     setRisk]     = useState("all")

  const sectors = useMemo(
    () => Array.from(new Set(companies.map((c) => c.sector).filter(Boolean))).sort() as string[],
    [companies]
  )

  const results = useMemo(() => {
    return companies.filter((c) => {
      const matchSector = sector === "all" || c.sector === sector
      const matchScore  = (c.score_total ?? 0) >= parseInt(minScore)
      const matchMCap   = maxMCap === "all" || (c.market_cap ?? 0) <= parseInt(maxMCap)
      const matchRisk   = risk === "all" || c.risk_level === risk
      return matchSector && matchScore && matchMCap && matchRisk
    })
  }, [companies, sector, minScore, maxMCap, risk])

  function reset() {
    setSector("all"); setMinScore("0"); setMaxMCap("all"); setRisk("all")
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Filter className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-400 font-medium">Pipeline draait nog</p>
        <p className="text-zinc-600 text-sm mt-1">Bedrijven verschijnen hier zodra de nachtelijke pipeline klaar is.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Filters */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="h-4 w-4 text-zinc-500 shrink-0" />

          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Alle sectoren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle sectoren</SelectItem>
              {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={minScore} onValueChange={setMinScore}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Min. score" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Alle scores</SelectItem>
              <SelectItem value="50">Score ≥ 50</SelectItem>
              <SelectItem value="65">Score ≥ 65</SelectItem>
              <SelectItem value="75">Score ≥ 75</SelectItem>
            </SelectContent>
          </Select>

          <Select value={maxMCap} onValueChange={setMaxMCap}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Max. market cap" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle market caps</SelectItem>
              <SelectItem value="500000000">Max. $500M</SelectItem>
              <SelectItem value="1000000000">Max. $1B</SelectItem>
              <SelectItem value="3000000000">Max. $3B</SelectItem>
              <SelectItem value="5000000000">Max. $5B</SelectItem>
            </SelectContent>
          </Select>

          <Select value={risk} onValueChange={setRisk}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Risico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle risico's</SelectItem>
              <SelectItem value="low">Laag</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">Hoog</SelectItem>
              <SelectItem value="very-high">Zeer hoog</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5 ml-auto text-zinc-500">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <span className="text-xs text-zinc-600">{results.length} resultaten</span>
        </div>
      </div>

      {/* Resultaten */}
      {results.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-sm text-zinc-500">Geen bedrijven gevonden met deze filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((c) => (
            <Link key={c.id} href={`/companies/${c.slug}`}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-700 transition-all hover:bg-zinc-800/50 h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-indigo-400">{c.ticker?.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-100 text-sm">{c.ticker}</p>
                      <p className="text-xs text-zinc-600 truncate max-w-[120px]">{c.name}</p>
                    </div>
                  </div>
                  {c.score_total != null && (
                    <div className="text-right shrink-0">
                      <p className={cn("text-xl font-bold tabular-nums", scoreColor(c.score_total))}>{c.score_total}</p>
                      <p className="text-xs text-zinc-700">/100</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Prijs</span>
                    <span className="text-zinc-300 font-medium">${c.price?.toFixed(2) ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Market Cap</span>
                    <span className="text-zinc-300">{c.market_cap ? fmtMCap(c.market_cap) : "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Sector</span>
                    <span className="text-zinc-400 truncate ml-4 text-right">{c.sector ?? "—"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-600">Risico</span>
                    {c.risk_level ? (
                      <span className={cn("rounded px-1.5 py-0.5 font-medium capitalize", riskBadge(c.risk_level))}>
                        {c.risk_level}
                      </span>
                    ) : <span className="text-zinc-700">—</span>}
                  </div>
                </div>

                {c.summary && (
                  <p className="text-xs text-zinc-600 mt-3 leading-relaxed line-clamp-2">{c.summary}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
      <Disclaimer compact />
    </div>
  )
}
