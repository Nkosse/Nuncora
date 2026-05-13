import { cn } from "@/lib/utils"
import type { Sector } from "@/types"

interface SectorBadgeProps {
  sector: Sector | string
  className?: string
}

const sectorConfig: Record<string, { emoji: string; className: string }> = {
  "AI Infrastructure":      { emoji: "🤖", className: "bg-violet-500/10 text-violet-400 border border-violet-500/20" },
  "Space Economy":          { emoji: "🚀", className: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  "Quantum Computing":      { emoji: "⚛️", className: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" },
  "Energy Transition":      { emoji: "⚡", className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" },
  "Photonics":              { emoji: "💡", className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" },
  "Robotics":               { emoji: "🦾", className: "bg-orange-500/10 text-orange-400 border border-orange-500/20" },
  "Defense Tech":           { emoji: "🛡️", className: "bg-red-500/10 text-red-400 border border-red-500/20" },
  "Next-Gen Connectivity":  { emoji: "📡", className: "bg-sky-500/10 text-sky-400 border border-sky-500/20" },
  "Biotech":                { emoji: "🧬", className: "bg-pink-500/10 text-pink-400 border border-pink-500/20" },
  "Semiconductors":         { emoji: "💻", className: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" },
  "Hidden Gems":            { emoji: "💎", className: "bg-zinc-700/50 text-zinc-300 border border-zinc-700" },
}

export function SectorBadge({ sector, className }: SectorBadgeProps) {
  const config = sectorConfig[sector] ?? { emoji: "📊", className: "bg-zinc-800 text-zinc-400 border border-zinc-700" }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap", config.className, className)}>
      <span>{config.emoji}</span>
      <span>{sector}</span>
    </span>
  )
}
