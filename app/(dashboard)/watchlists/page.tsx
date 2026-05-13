import Link from "next/link"
import { BookMarked, TrendingUp, ArrowRight, AlertTriangle } from "lucide-react"
import { watchlists } from "@/data/mock/watchlists"
import { companies, getScoreByCompanyId } from "@/data/mock/companies"
import { SectorBadge } from "@/components/shared/sector-badge"
import { RiskBadge } from "@/components/shared/risk-badge"
import { Disclaimer } from "@/components/shared/disclaimer"
import { cn } from "@/lib/utils"

export const metadata = { title: "Watchlists" }

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-blue-400"
  if (s >= 50) return "text-amber-400"
  return "text-red-400"
}

export default function WatchlistsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Thematic Watchlists</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Curated baskets of asymmetric opportunities by investment theme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {watchlists.map((wl) => {
          const wlCompanies = wl.companyIds
            .map((id) => companies.find((c) => c.id === id))
            .filter(Boolean) as typeof companies

          return (
            <div key={wl.id} className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-700 transition-colors">
              {/* Header */}
              <div className="px-5 py-4 border-b border-zinc-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <BookMarked className="h-4 w-4 text-indigo-400" />
                      <h3 className="font-semibold text-zinc-100">{wl.name}</h3>
                    </div>
                    <SectorBadge sector={wl.theme} />
                  </div>
                  <div className="text-right shrink-0">
                    <p className={cn("text-2xl font-bold", scoreColor(wl.averageScore))}>{wl.averageScore}</p>
                    <p className="text-xs text-zinc-600">avg score</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 py-3">
                <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">{wl.description}</p>
              </div>

              {/* Companies */}
              <div className="px-5 pb-3">
                <div className="flex flex-wrap gap-2">
                  {wlCompanies.map((c) => {
                    const score = getScoreByCompanyId(c.id)
                    return (
                      <Link key={c.id} href={`/companies/${c.slug}`}>
                        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 hover:border-zinc-700 transition-colors">
                          <div className={cn("h-5 w-5 rounded flex items-center justify-center text-[9px] font-bold text-white", c.logoPlaceholder)}>
                            {c.ticker.slice(0, 2)}
                          </div>
                          <span className="text-xs font-mono text-zinc-400">{c.ticker}</span>
                          {score && (
                            <span className={cn("text-xs font-bold", scoreColor(score.totalScore))}>{score.totalScore}</span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                  {wl.companyIds.length > wlCompanies.length && (
                    <span className="text-xs text-zinc-600 self-center">+{wl.companyIds.length - wlCompanies.length} more</span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <RiskBadge level={wl.riskLevel} />
                  <span className="text-xs text-zinc-600">{wl.companyIds.length} companies</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-indigo-400">
                  <TrendingUp className="h-3 w-3" />
                  <span className="truncate max-w-[180px]">{wl.topCatalyst.split("&")[0].trim()}</span>
                </div>
              </div>

              {/* Top catalyst */}
              <div className="px-5 pb-4">
                <div className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-400/80">{wl.topCatalyst}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Disclaimer compact />
    </div>
  )
}
