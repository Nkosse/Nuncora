import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface KPICardProps {
  label: string
  value: string
  subValue?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  icon?: LucideIcon
  className?: string
  highlight?: boolean
}

export function KPICard({ label, value, subValue, trend, trendValue, icon: Icon, className, highlight }: KPICardProps) {
  return (
    <div className={cn(
      "rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-2",
      highlight && "border-indigo-500/30 bg-indigo-500/5",
      className
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-zinc-700" />}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-zinc-100 tabular-nums">{value}</span>
        {trend && trendValue && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-zinc-500"
          )}>
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> : trend === "down" ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
            {trendValue}
          </div>
        )}
      </div>
      {subValue && <p className="text-xs text-zinc-600">{subValue}</p>}
    </div>
  )
}
