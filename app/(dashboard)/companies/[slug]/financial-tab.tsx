"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface FinancialData {
  revenue: number | null
  revenueGrowth: number | null
  grossProfit: number | null
  grossMargin: number | null
  operatingIncome: number | null
  operatingMargin: number | null
  netIncome: number | null
  netMargin: number | null
  ebitda: number | null
  eps: number | null
  reportPeriod: string | null
  cash: number | null
  totalDebt: number | null
  netCash: number | null
  totalAssets: number | null
  totalEquity: number | null
  operatingCF: number | null
  capex: number | null
  freeCashFlow: number | null
  peRatio: number | null
  psRatio: number | null
  pbRatio: number | null
  evToRevenue: number | null
  evToEbitda: number | null
}

function fmt(v: number | null, decimals = 0): string {
  if (v == null) return "—"
  const abs = Math.abs(v)
  if (abs >= 1_000_000_000) return `${v < 0 ? "-" : ""}$${(abs / 1_000_000_000).toFixed(1)}B`
  if (abs >= 1_000_000)     return `${v < 0 ? "-" : ""}$${(abs / 1_000_000).toFixed(0)}M`
  if (abs >= 1_000)         return `${v < 0 ? "-" : ""}$${(abs / 1_000).toFixed(0)}K`
  return `$${v.toFixed(decimals)}`
}

function fmtPct(v: number | null): string {
  if (v == null) return "—"
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`
}

function fmtRatio(v: number | null): string {
  if (v == null || v <= 0) return "—"
  return `${v.toFixed(1)}x`
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-zinc-800/60 last:border-0">
      <span className="text-sm text-zinc-500">{label}</span>
      <span className={cn("text-sm font-semibold tabular-nums", valueClass ?? "text-zinc-200")}>{value}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">{title}</h3>
      {children}
    </div>
  )
}

export function FinancialTab({ ticker, price, marketCap, beta }: {
  ticker: string
  price: number | null
  marketCap: number | null
  beta: number | null
}) {
  const [data, setData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false)

  useEffect(() => {
    fetch(`/api/financials?ticker=${ticker}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        // Als alle kerncijfers null zijn → geen data beschikbaar
        const hasAny = d.revenue != null || d.cash != null || d.freeCashFlow != null
        setNoData(!hasAny)
      })
      .catch(() => setNoData(true))
      .finally(() => setLoading(false))
  }, [ticker])

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
        <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-zinc-600 border-t-indigo-400 mb-3" />
        <p className="text-sm text-zinc-500">Financiële data ophalen...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {noData && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-3">
          <p className="text-xs text-amber-400">Gedetailleerde jaarrekeningen niet beschikbaar op het huidige datapakket. Kerndata hieronder is live van de markt.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inkomsten */}
        {data?.revenue != null && (
          <Section title="Inkomsten">
            <Row label="Omzet (meest recent jaar)"  value={fmt(data.revenue)} />
            <Row
              label="Omzetgroei YoY"
              value={fmtPct(data.revenueGrowth)}
              valueClass={data.revenueGrowth != null ? (data.revenueGrowth >= 0 ? "text-emerald-400" : "text-red-400") : undefined}
            />
            <Row label="Brutomarge"           value={data.grossMargin     != null ? `${data.grossMargin.toFixed(1)}%`     : "—"} />
            <Row label="Operationele marge"   value={data.operatingMargin != null ? `${data.operatingMargin.toFixed(1)}%` : "—"}
              valueClass={data.operatingMargin != null ? (data.operatingMargin >= 0 ? "text-emerald-400" : "text-red-400") : undefined}
            />
            <Row label="Nettoresultaat"       value={fmt(data.netIncome)}
              valueClass={data.netIncome != null ? (data.netIncome >= 0 ? "text-emerald-400" : "text-red-400") : undefined}
            />
            {data.ebitda != null && <Row label="EBITDA" value={fmt(data.ebitda)} />}
            {data.eps    != null && <Row label="EPS" value={`$${data.eps.toFixed(2)}`} />}
            {data.reportPeriod && <p className="text-xs text-zinc-700 mt-2">Boekjaar eindigend {data.reportPeriod}</p>}
          </Section>
        )}

        {/* Balans */}
        {(data?.cash != null || data?.totalDebt != null) && (
          <Section title="Balans">
            {data.cash      != null && <Row label="Cash & equivalenten" value={fmt(data.cash)} />}
            {data.totalDebt != null && <Row label="Totale schuld"       value={fmt(data.totalDebt)} />}
            {data.netCash   != null && (
              <Row label="Netto cash / schuld" value={fmt(data.netCash)}
                valueClass={data.netCash >= 0 ? "text-emerald-400" : "text-red-400"}
              />
            )}
            {data.totalAssets  != null && <Row label="Totale activa"  value={fmt(data.totalAssets)} />}
            {data.totalEquity  != null && <Row label="Eigen vermogen" value={fmt(data.totalEquity)} />}
          </Section>
        )}

        {/* Kasstromen */}
        {(data?.operatingCF != null || data?.freeCashFlow != null) && (
          <Section title="Kasstromen">
            {data.operatingCF  != null && <Row label="Operationele kasstroom" value={fmt(data.operatingCF)}
              valueClass={data.operatingCF >= 0 ? "text-emerald-400" : "text-red-400"}
            />}
            {data.capex        != null && <Row label="Capex" value={fmt(data.capex)} />}
            {data.freeCashFlow != null && (
              <Row label="Vrije kasstroom" value={fmt(data.freeCashFlow)}
                valueClass={data.freeCashFlow >= 0 ? "text-emerald-400" : "text-red-400"}
              />
            )}
          </Section>
        )}

        {/* Waardering */}
        <Section title="Waardering">
          <Row label="Prijs"       value={price     != null ? `$${price.toFixed(2)}` : "—"} />
          <Row label="Market Cap"  value={marketCap != null ? fmt(marketCap) : "—"} />
          <Row label="Beta"        value={beta      != null ? beta.toFixed(2) : "—"} />
          {data?.psRatio     != null && <Row label="P/S (TTM)"      value={fmtRatio(data.psRatio)} />}
          {data?.peRatio     != null && <Row label="P/E (TTM)"      value={fmtRatio(data.peRatio)} />}
          {data?.pbRatio     != null && <Row label="P/B"            value={fmtRatio(data.pbRatio)} />}
          {data?.evToRevenue != null && <Row label="EV/Omzet"       value={fmtRatio(data.evToRevenue)} />}
          {data?.evToEbitda  != null && <Row label="EV/EBITDA"      value={fmtRatio(data.evToEbitda)} />}
        </Section>
      </div>
    </div>
  )
}
