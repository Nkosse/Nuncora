import { cn } from "@/lib/utils"

type RiskLevel = "Low" | "Medium" | "High" | "Very High"

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
}

const config: Record<RiskLevel, { className: string }> = {
  "Low":      { className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  "Medium":   { className: "bg-amber-500/10 text-amber-400 border border-amber-500/20" },
  "High":     { className: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
  "Very High":{ className: "bg-red-500/10 text-red-400 border border-red-500/20" },
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", config[level].className, className)}>
      {level} Risk
    </span>
  )
}
