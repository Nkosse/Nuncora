import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function Disclaimer({ className, compact }: { className?: string; compact?: boolean }) {
  if (compact) {
    return (
      <p className={cn("text-xs text-zinc-600 flex items-start gap-1.5", className)}>
        <AlertTriangle className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
        Not financial advice. For research and education only. You remain solely responsible for your investment decisions.
      </p>
    )
  }
  return (
    <div className={cn("rounded-lg border border-amber-500/15 bg-amber-500/5 p-4 text-xs text-amber-400/70 space-y-1.5", className)}>
      <div className="flex items-center gap-2 font-semibold text-amber-400">
        <AlertTriangle className="h-3.5 w-3.5" />
        Important Disclaimer
      </div>
      <p>
        Convex is an <strong>information and research platform</strong>, not a financial advisor. Nothing on this platform constitutes investment advice, a recommendation to buy or sell any security, or a solicitation of any offer.
      </p>
      <p>
        All analysis, scores, and commentary are for <strong>educational and informational purposes only</strong>. Investing in smallcap stocks involves significant risk, including the possible loss of principal. You are solely responsible for your own investment decisions.
      </p>
    </div>
  )
}
