import { cn } from "@/lib/utils"

interface ScoreBarProps {
  score: number
  max?: number
  label?: string
  showValue?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

function getBarColor(pct: number) {
  if (pct >= 0.75) return "bg-emerald-500"
  if (pct >= 0.60) return "bg-blue-500"
  if (pct >= 0.45) return "bg-amber-500"
  return "bg-red-500"
}

function getTextColor(pct: number) {
  if (pct >= 0.75) return "text-emerald-400"
  if (pct >= 0.60) return "text-blue-400"
  if (pct >= 0.45) return "text-amber-400"
  return "text-red-400"
}

export function ScoreBar({ score, max = 10, label, showValue = true, size = "md", className }: ScoreBarProps) {
  const pct = score / max
  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2" }

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-zinc-500">{label}</span>}
          {showValue && (
            <span className={cn("text-xs font-semibold tabular-nums", getTextColor(pct))}>
              {score}/{max}
            </span>
          )}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-zinc-800 overflow-hidden", heights[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", getBarColor(pct))}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  )
}
