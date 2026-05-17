import { cn } from "@/lib/utils"

type Props = {
  entryPrice: number | null
  currentPrice: number | null
  targetBear: number | null
  targetBase: number | null
  targetBull: number | null
  analysisDate: string
}

function pct(from: number, to: number) {
  return ((to - from) / from) * 100
}

function monthsAgo(dateStr: string) {
  const d    = new Date(dateStr)
  const now  = new Date()
  const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24 * 30.5)
  return Math.round(diff)
}

function monthsUntil(dateStr: string, months = 12) {
  const target = new Date(dateStr)
  target.setMonth(target.getMonth() + months)
  const now    = new Date()
  const diff   = (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.5)
  return Math.max(0, Math.round(diff))
}

export function PrognoseTracker({ entryPrice, currentPrice, targetBear, targetBase, targetBull, analysisDate }: Props) {
  if (!entryPrice || !currentPrice || !targetBear || !targetBase || !targetBull) return null

  // Stel de schaal in op basis van alle prijzen
  const allPrices  = [entryPrice, currentPrice, targetBear, targetBase, targetBull]
  const scaleMin   = Math.min(...allPrices) * 0.88
  const scaleMax   = Math.max(...allPrices) * 1.12
  const toPos      = (p: number) => Math.max(0, Math.min(100, ((p - scaleMin) / (scaleMax - scaleMin)) * 100))

  const currentPct = pct(entryPrice, currentPrice)
  const basePct    = pct(entryPrice, targetBase)
  const bullPct    = pct(entryPrice, targetBull)
  const bearPct    = pct(entryPrice, targetBear)

  const aboveBull  = currentPrice >= targetBull
  const aboveBase  = currentPrice >= targetBase
  const aboveBear  = currentPrice >= targetBear

  const statusColor = aboveBull  ? "text-emerald-400"
    : aboveBase ? "text-blue-400"
    : aboveBear ? "text-amber-400"
    : "text-red-400"

  const statusLabel = aboveBull  ? "Boven bull target"
    : aboveBase ? "Boven base target"
    : aboveBear ? "Tussen bear en base"
    : "Onder bear target"

  const elapsed   = monthsAgo(analysisDate)
  const remaining = monthsUntil(analysisDate, 12)

  const markers: { label: string; price: number; color: string; pos: number }[] = [
    { label: "Bear", price: targetBear, color: "text-red-400",     pos: toPos(targetBear) },
    { label: "Base", price: targetBase, color: "text-blue-400",    pos: toPos(targetBase) },
    { label: "Bull", price: targetBull, color: "text-emerald-400", pos: toPos(targetBull) },
  ]

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-zinc-100">Prognose Tracker</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className={cn("font-medium", statusColor)}>{statusLabel}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-600">
            {elapsed === 0 ? "Vandaag gestart" : `${elapsed}m geleden`}
            {remaining > 0 ? ` · ${remaining}m resterend` : " · Doel bereikt"}
          </span>
        </div>
      </div>

      {/* Schaal */}
      <div className="relative h-10 mb-6 select-none">
        {/* Achtergrond zones */}
        <div className="absolute inset-x-0 top-4 h-2 rounded-full bg-zinc-800" />

        {/* Gekleurde zones */}
        <div
          className="absolute top-4 h-2 bg-red-500/20 rounded-l-full"
          style={{ left: `${toPos(scaleMin)}%`, width: `${toPos(targetBear) - toPos(scaleMin)}%` }}
        />
        <div
          className="absolute top-4 h-2 bg-amber-500/20"
          style={{ left: `${toPos(targetBear)}%`, width: `${toPos(targetBase) - toPos(targetBear)}%` }}
        />
        <div
          className="absolute top-4 h-2 bg-emerald-500/20 rounded-r-full"
          style={{ left: `${toPos(targetBase)}%`, width: `${toPos(scaleMax) - toPos(targetBase)}%` }}
        />

        {/* Entry marker */}
        <div className="absolute top-2.5 -translate-x-1/2 flex flex-col items-center" style={{ left: `${toPos(entryPrice)}%` }}>
          <div className="w-0.5 h-5 bg-zinc-500" />
          <span className="absolute -top-4 text-[10px] text-zinc-500 whitespace-nowrap">Entry</span>
        </div>

        {/* Doel markers */}
        {markers.map(m => (
          <div key={m.label} className="absolute top-2.5 -translate-x-1/2 flex flex-col items-center" style={{ left: `${m.pos}%` }}>
            <div className="w-0.5 h-5 bg-zinc-600" />
            <span className={cn("absolute -bottom-5 text-[10px] whitespace-nowrap", m.color)}>{m.label}</span>
          </div>
        ))}

        {/* Huidige koers — dikke markering */}
        <div
          className={cn("absolute top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-zinc-900 shadow-lg", aboveBull ? "bg-emerald-400" : aboveBase ? "bg-blue-400" : aboveBear ? "bg-amber-400" : "bg-red-400")}
          style={{ left: `${toPos(currentPrice)}%` }}
        />
      </div>

      {/* Stats rij */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2 text-xs">
        {[
          { label: "Entry prijs",   value: `$${entryPrice.toFixed(2)}`,                               sub: new Date(analysisDate).toLocaleDateString("nl-NL") },
          { label: "Huidige koers", value: `$${currentPrice.toFixed(2)}`,                             sub: `${currentPct >= 0 ? "+" : ""}${currentPct.toFixed(1)}% t.o.v. entry`, cls: currentPct >= 0 ? "text-emerald-400" : "text-red-400" },
          { label: "Base target",   value: `$${targetBase.toFixed(2)}`,                               sub: `${basePct >= 0 ? "+" : ""}${basePct.toFixed(1)}% vanaf entry` },
          { label: "Bull target",   value: `$${targetBull.toFixed(2)}`,                               sub: `${bullPct >= 0 ? "+" : ""}${bullPct.toFixed(1)}% vanaf entry` },
        ].map(s => (
          <div key={s.label} className="rounded-lg bg-zinc-800/60 px-3 py-2">
            <p className="text-zinc-600 mb-0.5">{s.label}</p>
            <p className={cn("font-bold text-zinc-200 tabular-nums", s.cls)}>{s.value}</p>
            <p className="text-zinc-600 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
