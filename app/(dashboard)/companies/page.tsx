"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, ArrowUpDown, ChevronUp, ChevronDown, Filter } from "lucide-react"
import { companies, getScoreByCompanyId, getKPIsByCompanyId } from "@/data/mock/companies"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SectorBadge } from "@/components/shared/sector-badge"
import { Disclaimer } from "@/components/shared/disclaimer"
import { cn } from "@/lib/utils"
import type { Sector } from "@/types"

type SortKey = "name" | "score" | "marketCap" | "stockPrice" | "revenueGrowth" | "cashRunway" | "shortInterest"
type SortDir = "asc" | "desc"

const sectors: Sector[] = [
  "AI Infrastructure", "Space Economy", "Quantum Computing", "Energy Transition",
  "Photonics", "Robotics", "Defense Tech", "Next-Gen Connectivity",
]

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-blue-400"
  if (s >= 50) return "text-amber-400"
  return "text-red-400"
}

function dilutionColor(d: string) {
  if (d === "Low")    return "text-emerald-400"
  if (d === "Medium") return "text-amber-400"
  return "text-red-400"
}

function formatMCap(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(2)}B`
  return `$${v.toFixed(0)}M`
}

export default function CompaniesPage() {
  const [search, setSearch] = useState("")
  const [sector, setSector] = useState<string>("all")
  const [minScore, setMinScore] = useState<string>("0")
  const [sortKey, setSortKey] = useState<SortKey>("score")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const rows = useMemo(() => {
    const data = companies.map((c) => ({
      company: c,
      score: getScoreByCompanyId(c.id)!,
      kpis: getKPIsByCompanyId(c.id)!,
    })).filter((x) => x.score && x.kpis)

    return data
      .filter((x) => {
        const q = search.toLowerCase()
        const matchSearch = !q || x.company.name.toLowerCase().includes(q) || x.company.ticker.toLowerCase().includes(q)
        const matchSector = sector === "all" || x.company.sector === sector
        const matchScore = x.score.totalScore >= parseInt(minScore)
        return matchSearch && matchSector && matchScore
      })
      .sort((a, b) => {
        let av = 0, bv = 0
        switch (sortKey) {
          case "name":          av = a.company.name.localeCompare(b.company.name); return sortDir === "asc" ? av : -av
          case "score":         av = a.score.totalScore;         bv = b.score.totalScore; break
          case "marketCap":     av = a.company.marketCapValue;   bv = b.company.marketCapValue; break
          case "stockPrice":    av = a.company.stockPrice;        bv = b.company.stockPrice; break
          case "revenueGrowth": av = a.kpis.revenueGrowthYoY;    bv = b.kpis.revenueGrowthYoY; break
          case "cashRunway":    av = a.kpis.cashRunway;           bv = b.kpis.cashRunway; break
          case "shortInterest": av = a.kpis.shortInterest;        bv = b.kpis.shortInterest; break
        }
        return sortDir === "asc" ? av - bv : bv - av
      })
  }, [search, sector, minScore, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("desc") }
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="h-3.5 w-3.5 text-zinc-700" />
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5 text-indigo-400" /> : <ChevronDown className="h-3.5 w-3.5 text-indigo-400" />
  }

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
          <Input
            placeholder="Search by name or ticker…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={sector} onValueChange={setSector}>
          <SelectTrigger className="w-48">
            <Filter className="h-3.5 w-3.5 text-zinc-500 mr-1" />
            <SelectValue placeholder="All sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sectors</SelectItem>
            {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={minScore} onValueChange={setMinScore}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Min. score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any score</SelectItem>
            <SelectItem value="50">Score ≥ 50</SelectItem>
            <SelectItem value="65">Score ≥ 65</SelectItem>
            <SelectItem value="75">Score ≥ 75</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-zinc-600 ml-auto">{rows.length} companies</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/50">
                {[
                  { key: "name" as SortKey,      label: "Company",         w: "min-w-[180px]" },
                  { key: "score" as SortKey,      label: "Score",           w: "w-20" },
                  { key: "stockPrice" as SortKey, label: "Price",           w: "w-24" },
                  { key: "marketCap" as SortKey,  label: "Market Cap",      w: "w-24" },
                ].map((col) => (
                  <th key={col.key} className={cn("px-4 py-3 text-left", col.w)}>
                    <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors">
                      {col.label}<SortIcon k={col.key} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-left w-32">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sector</span>
                </th>
                {[
                  { key: "revenueGrowth" as SortKey, label: "Rev Growth" },
                  { key: "cashRunway" as SortKey,    label: "Runway" },
                  { key: "shortInterest" as SortKey, label: "Short %" },
                ].map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left w-28">
                    <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-300 transition-colors">
                      {col.label}<SortIcon k={col.key} />
                    </button>
                  </th>
                ))}
                <th className="px-4 py-3 text-left w-24">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Dilution</span>
                </th>
                <th className="px-4 py-3 w-16" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {rows.map(({ company: c, score, kpis }) => (
                <tr key={c.id} className="hover:bg-zinc-800/30 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", c.logoPlaceholder)}>
                        <span className="text-xs font-bold text-white">{c.ticker.slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-zinc-200">{c.name}</p>
                        <p className="text-xs text-zinc-600">{c.ticker} · {c.exchange}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-base font-bold tabular-nums", scoreColor(score.totalScore))}>
                      {score.totalScore}
                    </span>
                    <span className="text-xs text-zinc-700">/100</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-zinc-200 font-medium tabular-nums">${c.stockPrice.toFixed(2)}</p>
                    <p className={cn("text-xs tabular-nums", c.stockPriceChange >= 0 ? "text-emerald-400" : "text-red-400")}>
                      {c.stockPriceChange >= 0 ? "+" : ""}{c.stockPriceChange.toFixed(1)}%
                    </p>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 tabular-nums">{formatMCap(c.marketCapValue)}</td>
                  <td className="px-4 py-3">
                    <SectorBadge sector={c.sector} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-sm font-medium tabular-nums", kpis.revenueGrowthYoY > 0 ? "text-emerald-400" : "text-red-400")}>
                      +{kpis.revenueGrowthYoY.toFixed(0)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-sm tabular-nums", kpis.cashRunway >= 18 ? "text-emerald-400" : kpis.cashRunway >= 12 ? "text-amber-400" : "text-red-400")}>
                      {kpis.cashRunway}m
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-sm tabular-nums", kpis.shortInterest > 12 ? "text-red-400" : kpis.shortInterest > 7 ? "text-amber-400" : "text-zinc-400")}>
                      {kpis.shortInterest.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-medium", dilutionColor(kpis.dilutionRisk))}>
                      {kpis.dilutionRisk}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/companies/${c.slug}`}>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-xs h-7 px-2">
                        Analyze →
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-zinc-600 text-sm">No companies match your filters</td>
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
