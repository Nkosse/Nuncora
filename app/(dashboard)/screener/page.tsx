"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Filter, RotateCcw } from "lucide-react"
import { companies, getScoreByCompanyId, getKPIsByCompanyId } from "@/data/mock/companies"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SectorBadge } from "@/components/shared/sector-badge"
import { ScoreBar } from "@/components/shared/score-bar"
import { Disclaimer } from "@/components/shared/disclaimer"
import { cn } from "@/lib/utils"
import type { Sector } from "@/types"

const sectors: Sector[] = [
  "AI Infrastructure","Space Economy","Quantum Computing","Energy Transition",
  "Photonics","Robotics","Defense Tech","Next-Gen Connectivity",
]

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-blue-400"
  if (s >= 50) return "text-amber-400"
  return "text-red-400"
}

function fmtM(v: number) { return v >= 1000 ? `$${(v / 1000).toFixed(2)}B` : `$${v.toFixed(0)}M` }

export default function ScreenerPage() {
  const [sector, setSector]         = useState("all")
  const [minScore, setMinScore]     = useState("0")
  const [maxMcap, setMaxMcap]       = useState("all")
  const [minRunway, setMinRunway]   = useState("0")
  const [dilution, setDilution]     = useState("all")
  const [maxShort, setMaxShort]     = useState("100")

  const results = useMemo(() => {
    return companies
      .map((c) => ({
        company: c,
        score:   getScoreByCompanyId(c.id)!,
        kpis:    getKPIsByCompanyId(c.id)!,
      }))
      .filter(({ company: c, score, kpis }) => {
        if (!score || !kpis) return false
        if (sector !== "all" && c.sector !== sector) return false
        if (score.totalScore < parseInt(minScore)) return false
        if (kpis.cashRunway < parseInt(minRunway)) return false
        if (dilution !== "all" && kpis.dilutionRisk !== dilution) return false
        if (kpis.shortInterest > parseInt(maxShort)) return false
        if (maxMcap !== "all" && c.marketCapValue > parseInt(maxMcap)) return false
        return true
      })
      .sort((a, b) => b.score.totalScore - a.score.totalScore)
  }, [sector, minScore, maxMcap, minRunway, dilution, maxShort])

  function reset() {
    setSector("all"); setMinScore("0"); setMaxMcap("all")
    setMinRunway("0"); setDilution("all"); setMaxShort("100")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-fade-in">
      {/* Filter panel */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-indigo-400" />
          <h3 className="font-semibold text-zinc-100">Screener Filters</h3>
          <Button variant="ghost" size="sm" onClick={reset} className="ml-auto gap-1.5 text-zinc-500 h-7">
            <RotateCcw className="h-3 w-3" />Reset
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Sector</p>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sectors</SelectItem>
                {sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Min. Score</p>
            <Select value={minScore} onValueChange={setMinScore}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="50">≥ 50</SelectItem>
                <SelectItem value="65">≥ 65</SelectItem>
                <SelectItem value="75">≥ 75</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Max Market Cap</p>
            <Select value={maxMcap} onValueChange={setMaxMcap}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="300">≤ $300M</SelectItem>
                <SelectItem value="500">≤ $500M</SelectItem>
                <SelectItem value="1000">≤ $1B</SelectItem>
                <SelectItem value="2000">≤ $2B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Min. Runway</p>
            <Select value={minRunway} onValueChange={setMinRunway}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Any</SelectItem>
                <SelectItem value="12">≥ 12m</SelectItem>
                <SelectItem value="18">≥ 18m</SelectItem>
                <SelectItem value="24">≥ 24m</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Dilution Risk</p>
            <Select value={dilution} onValueChange={setDilution}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="Low">Low only</SelectItem>
                <SelectItem value="Medium">Medium or lower</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Max Short Int.</p>
            <Select value={maxShort} onValueChange={setMaxShort}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="100">Any</SelectItem>
                <SelectItem value="5">≤ 5%</SelectItem>
                <SelectItem value="10">≤ 10%</SelectItem>
                <SelectItem value="15">≤ 15%</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500"><span className="text-zinc-200 font-semibold">{results.length}</span> companies match</p>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center text-zinc-600 text-sm">
          No companies match your filters. Try relaxing some criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map(({ company: c, score, kpis }) => (
            <Link key={c.id} href={`/companies/${c.slug}`}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors h-full">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold", c.logoPlaceholder)}>
                      {c.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-200 text-sm">{c.name}</p>
                      <p className="text-xs text-zinc-600 font-mono">{c.ticker}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-lg font-bold", scoreColor(score.totalScore))}>{score.totalScore}</p>
                    <p className="text-xs text-zinc-700">/100</p>
                  </div>
                </div>

                <SectorBadge sector={c.sector} className="mb-3" />

                <ScoreBar score={score.totalScore} max={100} showValue={false} size="sm" className="mb-3" />

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-zinc-600 mb-0.5">Price</p>
                    <p className="text-zinc-300 font-medium">${c.stockPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 mb-0.5">M Cap</p>
                    <p className="text-zinc-300 font-medium">{fmtM(c.marketCapValue)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 mb-0.5">Runway</p>
                    <p className={cn("font-medium", kpis.cashRunway >= 18 ? "text-emerald-400" : kpis.cashRunway >= 12 ? "text-amber-400" : "text-red-400")}>
                      {kpis.cashRunway}m
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-600 mb-0.5">Rev Growth</p>
                    <p className="text-emerald-400 font-medium">+{kpis.revenueGrowthYoY.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-zinc-600 mb-0.5">Short %</p>
                    <p className={cn("font-medium", kpis.shortInterest > 12 ? "text-red-400" : "text-zinc-300")}>
                      {kpis.shortInterest.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-600 mb-0.5">Dilution</p>
                    <p className={cn("font-medium", kpis.dilutionRisk === "Low" ? "text-emerald-400" : kpis.dilutionRisk === "Medium" ? "text-amber-400" : "text-red-400")}>
                      {kpis.dilutionRisk}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Disclaimer compact />
    </div>
  )
}
