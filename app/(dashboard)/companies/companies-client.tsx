"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowUpDown, ChevronUp, ChevronDown, Filter, Target } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Disclaimer } from "@/components/shared/disclaimer"
import { cn } from "@/lib/utils"

type SortKey = "name" | "score" | "price" | "marketCap"
type SortDir = "asc" | "desc"

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

function formatMCap(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`
  if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(0)}M`
  return `$${v.toFixed(0)}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CompaniesClient({ companies }: { companies: any[] }) {
  const [search, setSearch]     = useState("")
  const [sector, setSector]     = useState("all")
  const [minScore, setMinScore] = useState("0")
  const [sortKey, setSortKey]   = useState<SortKey>("score")
  const [sortDir, setSortDir]   = useState<SortDir>("desc")

  const sectors = useMemo(
    () => Array.from(new Set(companies.map((c) => c.sector).filter(Boolean))).sort() as string[],
    [companies]
  )

  const rows = useMemo(() => {
    return companies
      .filter((c) => {
        const q = search.toLowerCase()
        const matchSearch = !q || c.name?.toLowerCase().includes(q) || c.ticker?.toLowerCase().includes(q)
        const matchSector = sector === "all" || c.sector === sector
        const matchScore  = (c.score_total ?? 0) >= parseInt(minScore)
        return matchSearch && matchSector && matchScore
      })
      .sort((a, b) => {
        switch (sortKey) {
          case "name":      return sortDir === "asc"
            ? (a.name ?? "").localeCompare(b.name ?? "")
            : (b.name ?? "").localeCompare(a.name ?? "")
          case "score":     return sortDir === "asc" ? (a.score_total ?? 0) - (b.score_total ?? 0) : (b.score_total ?? 0) - (a.score_total ?? 0)
          case "price":     return sortDir === "asc" ? (a.price ?? 0) - (b.price ?? 0) : (b.price ?? 0) - (a.price ?? 0)
          case "marketCap": return sortDir === "asc" ? (a.market_cap ?? 0) - (b.market_cap ?? 0) : (b.market_cap ?? 0) - (a.market_cap ?? 0)
          default: return 0
        }
      })
  }, [companies, search, sector, minScore, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("desc") }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="h-3.5 w-3.5 text-zinc-700" />
    return sortDir === "asc"
      ? <ChevronUp className="h-3.5 w-3.5 text-indigo-400" />
      : <ChevronDown className="h-3.5 w-3.5 text-indigo-400" />
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-zinc-400 font-medium">Pipeline draait nog</p>
        <p className="text-zinc-600 text-sm mt-1">Bedrijven verschijnen hier zodra de nachtelijke pipeline klaar is.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
          <Input
            placeholder="Zoek op naam of ticker…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-52">
            <Filter className="h-3.5 w-3.5 text-zinc-500 mr-1" />
            <SelectValue placeholder="Alle sectoren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle sectoren</SelectItem>
            {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={minScore} onValueChange={setMinScore}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Min. score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Alle scores</SelectItem>
            <SelectItem value="50">Score ≥ 50</SelectItem>
            <SelectItem value="65">Score ≥ 65</SelectItem>
            <SelectItem value="75">Score ≥ 75</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-zinc-600 ml-auto">{rows.length} bedrijven</span>
      </div>

      {/* Tabel */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                {([
                  { key: "name" as SortKey,      label: "Bedrijf",     w: "min-w-[200px]" },
                  { key: "score" as SortKey,     label: "Score",       w: "w-20" },
                  { key: "price" as SortKey,     label: "Prijs",       w: "w-24" },
                  { key: "marketCap" as SortKey, label: "Market Cap",  w: "w-28" },
                ] as { key: SortKey; label: string; w: string }[]).map((col) => (
                  <th key={col.key} className={cn("px-4 py-3 text-left", col.w)}>
                    <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors">
                      {col.label}<SortIcon k={col.key} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-left w-32 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sector</th>
                <th className="px-4 py-3 text-left w-28 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Risico</th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-indigo-400">{c.ticker?.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-200">{c.name}</p>
                        <p className="text-xs text-zinc-600">{c.ticker} · {c.exchange}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.score_total != null ? (
                      <>
                        <span className={cn("text-base font-bold tabular-nums", scoreColor(c.score_total))}>{c.score_total}</span>
                        <span className="text-xs text-zinc-700">/100</span>
                      </>
                    ) : <span className="text-zinc-700">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <p className="text-zinc-200 font-medium tabular-nums">${c.price?.toFixed(2) ?? "—"}</p>
                      {c.entry_is_opportunity && (
                        <Target className="h-3 w-3 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    {c.price_change_pct != null && (
                      <p className={cn("text-xs tabular-nums", c.price_change_pct >= 0 ? "text-emerald-400" : "text-red-400")}>
                        {c.price_change_pct >= 0 ? "+" : ""}{c.price_change_pct.toFixed(1)}%
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 tabular-nums">{c.market_cap ? formatMCap(c.market_cap) : "—"}</td>
                  <td className="px-4 py-3 text-xs text-zinc-500">{c.sector ?? "—"}</td>
                  <td className="px-4 py-3">
                    {c.risk_level ? (
                      <span className={cn("text-xs font-medium rounded px-1.5 py-0.5", riskBadge(c.risk_level))}>
                        {c.risk_level}
                      </span>
                    ) : <span className="text-zinc-700">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/companies/${c.slug}`}>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-xs h-7 px-2">
                        Analyseer →
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-600 text-sm">Geen bedrijven gevonden</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Disclaimer compact />
    </div>
  )
}
