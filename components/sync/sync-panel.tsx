"use client"

import { useState } from "react"
import { Zap, RefreshCw, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SyncResult, ProcessedCompany } from "@/app/api/sync/route"

type SyncMode = "seed" | "screen" | "full"

const MODES: { value: SyncMode; label: string; desc: string; time: string }[] = [
  {
    value: "seed",
    label: "Curated seed list",
    desc: "Analyze 25 hand-picked future-tech tickers",
    time: "~3–5 min",
  },
  {
    value: "screen",
    label: "FMP screener + seed",
    desc: "Screen $50M–$3B smallcaps + curated list",
    time: "~8–12 min",
  },
  {
    value: "full",
    label: "Full AI discovery",
    desc: "Screener → Claude filters → analyze all matches",
    time: "~15–25 min",
  },
]

export function SyncPanel() {
  const [mode, setMode] = useState<SyncMode>("seed")
  const [limit, setLimit] = useState(10)
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle")
  const [result, setResult] = useState<SyncResult | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  async function runSync() {
    setStatus("running")
    setResult(null)
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, limit }),
      })
      const data = (await res.json()) as SyncResult
      setResult(data)
      setStatus(data.success ? "done" : "error")
    } catch (e) {
      setResult({
        success: false,
        processed: 0,
        companies: [],
        errors: [String(e)],
        durationMs: 0,
      })
      setStatus("error")
    }
  }

  const selectedMode = MODES.find((m) => m.value === mode)!

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Zap className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">AI Data Sync</p>
          <p className="text-xs text-zinc-500">Discover & analyze companies with Claude</p>
        </div>
        {status === "done" && result && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {result.processed} companies analyzed
          </div>
        )}
      </div>

      {/* Config */}
      <div className="px-5 py-4 space-y-4">
        {/* Mode selector */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-zinc-400">Discovery mode</p>
          <div className="grid grid-cols-1 gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                disabled={status === "running"}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-all",
                  mode === m.value
                    ? "border-indigo-500/40 bg-indigo-500/8"
                    : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors",
                    mode === m.value ? "border-indigo-400 bg-indigo-400" : "border-zinc-600"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        mode === m.value ? "text-indigo-300" : "text-zinc-300"
                      )}
                    >
                      {m.label}
                    </span>
                    <span className="text-[10px] text-zinc-600">{m.time}</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 mt-0.5">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Limit slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-400">Companies to analyze</p>
            <span className="text-xs font-semibold text-indigo-400">{limit}</span>
          </div>
          <input
            type="range"
            min={3}
            max={25}
            step={1}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            disabled={status === "running"}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-zinc-700">
            <span>3 (fast)</span>
            <span>25 (thorough)</span>
          </div>
        </div>

        {/* Run button */}
        <button
          onClick={runSync}
          disabled={status === "running"}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
            status === "running"
              ? "bg-indigo-600/40 text-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          )}
        >
          <RefreshCw className={cn("h-4 w-4", status === "running" && "animate-spin")} />
          {status === "running" ? "Analyzing companies…" : "Run AI Sync"}
        </button>

        {status === "running" && (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-2">
            <p className="text-xs text-zinc-400">
              Claude is analyzing each company — fetching financials from FMP, then running
              investment analysis. This takes {selectedMode.time}.
            </p>
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full bg-indigo-500/20 overflow-hidden"
                >
                  <div
                    className="h-full bg-indigo-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {result && status !== "running" && (
        <div className="border-t border-zinc-800">
          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-zinc-800 border-b border-zinc-800">
            <div className="px-4 py-3 text-center">
              <p className="text-lg font-bold text-zinc-100">{result.processed}</p>
              <p className="text-[10px] text-zinc-600">Analyzed</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-lg font-bold text-emerald-400">
                {result.companies.filter((c) => c.score >= 65).length}
              </p>
              <p className="text-[10px] text-zinc-600">High conviction</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-lg font-bold text-zinc-400">{result.errors.length}</p>
              <p className="text-[10px] text-zinc-600">Errors</p>
            </div>
          </div>

          {/* Company list */}
          <div className="divide-y divide-zinc-800/50 max-h-96 overflow-y-auto">
            {result.companies.map((company) => (
              <CompanyRow
                key={company.ticker}
                company={company}
                expanded={expanded === company.ticker}
                onToggle={() =>
                  setExpanded(expanded === company.ticker ? null : company.ticker)
                }
              />
            ))}
          </div>

          {result.errors.length > 0 && (
            <div className="px-5 py-3 border-t border-zinc-800">
              <p className="text-xs font-medium text-amber-400 flex items-center gap-1.5 mb-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {result.errors.length} errors
              </p>
              {result.errors.slice(0, 3).map((e, i) => (
                <p key={i} className="text-[10px] text-zinc-600 truncate">
                  {e}
                </p>
              ))}
            </div>
          )}

          <div className="px-5 py-2 border-t border-zinc-800">
            <p className="text-[10px] text-zinc-700">
              Completed in {(result.durationMs / 1000).toFixed(1)}s
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function CompanyRow({
  company,
  expanded,
  onToggle,
}: {
  company: ProcessedCompany
  expanded: boolean
  onToggle: () => void
}) {
  const scoreColor =
    company.score >= 75
      ? "text-emerald-400"
      : company.score >= 60
        ? "text-blue-400"
        : company.score >= 45
          ? "text-amber-400"
          : "text-red-400"

  const riskColors: Record<string, string> = {
    low: "text-emerald-400 bg-emerald-400/10",
    medium: "text-amber-400 bg-amber-400/10",
    high: "text-orange-400 bg-orange-400/10",
    "very-high": "text-red-400 bg-red-400/10",
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-zinc-900/50 transition-colors text-left"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-100">{company.ticker}</span>
            <span className="text-[10px] text-zinc-600 truncate">{company.name}</span>
          </div>
          <p className="text-[10px] text-zinc-600 truncate mt-0.5">{company.sector}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={cn("text-sm font-bold tabular-nums", scoreColor)}>
            {company.score}
          </span>
          <span
            className={cn(
              "text-[10px] font-medium rounded px-1.5 py-0.5",
              riskColors[company.riskLevel] ?? "text-zinc-400 bg-zinc-800"
            )}
          >
            {company.riskLevel}
          </span>
          {expanded ? (
            <ChevronUp className="h-3 w-3 text-zinc-600" />
          ) : (
            <ChevronDown className="h-3 w-3 text-zinc-600" />
          )}
        </div>
      </button>
      {expanded && (
        <div className="px-5 pb-3 space-y-2">
          <p className="text-xs text-zinc-400 leading-relaxed">{company.summary}</p>
          <p className="text-[11px] text-zinc-600 leading-relaxed border-l border-indigo-500/30 pl-2">
            {company.thesis}
          </p>
        </div>
      )}
    </div>
  )
}
