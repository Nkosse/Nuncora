import { cn } from "@/lib/utils"
import type { AsymmetricScore } from "@/types"
import { ScoreBar } from "./score-bar"

interface ScoreCardProps {
  score: AsymmetricScore
  compact?: boolean
  className?: string
}

const scoreKeys = [
  { key: "marketOpportunity",  label: "Market Opportunity" },
  { key: "technologyMoat",     label: "Technology Moat" },
  { key: "revenueTraction",    label: "Revenue Traction" },
  { key: "insiderAlignment",   label: "Insider Alignment" },
  { key: "cashRunway",         label: "Cash Runway" },
  { key: "dilutionRisk",       label: "Dilution Safety" },
  { key: "competitivePosition",label: "Competitive Position" },
  { key: "catalystStrength",   label: "Catalyst Strength" },
  { key: "retailAwareness",    label: "Retail Awareness" },
  { key: "valuationUpside",    label: "Valuation Upside" },
] as const

function getRingColor(s: number) {
  if (s >= 80) return "#10b981"
  if (s >= 65) return "#3b82f6"
  if (s >= 50) return "#f59e0b"
  return "#ef4444"
}

function getLabel(s: number) {
  if (s >= 80) return { text: "Excellent", cls: "text-emerald-400" }
  if (s >= 65) return { text: "Strong",    cls: "text-blue-400" }
  if (s >= 50) return { text: "Average",   cls: "text-amber-400" }
  return { text: "Weak", cls: "text-red-400" }
}

export function ScoreCard({ score, compact = false, className }: ScoreCardProps) {
  const lbl = getLabel(score.totalScore)
  const color = getRingColor(score.totalScore)
  const deg = score.totalScore * 3.6

  return (
    <div className={cn("rounded-xl border border-zinc-800 bg-zinc-900", className)}>
      <div className="p-5 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-zinc-100">Asymmetric Upside Score™</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Proprietary multi-factor model</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div
              className="relative flex items-center justify-center w-16 h-16 rounded-full"
              style={{ background: `conic-gradient(${color} ${deg}deg, #27272a 0deg)` }}
            >
              <div className="absolute inset-1 rounded-full bg-zinc-900 flex items-center justify-center">
                <span className="text-lg font-bold text-zinc-100">{score.totalScore}</span>
              </div>
            </div>
            <span className={cn("text-xs font-medium", lbl.cls)}>{lbl.text}</span>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className={cn(compact ? "grid grid-cols-2 gap-3" : "space-y-3")}>
          {scoreKeys.map(({ key, label }) => (
            <ScoreBar
              key={key}
              score={score[key]}
              label={label}
              size="sm"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
