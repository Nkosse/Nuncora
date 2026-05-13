import { supabaseAdmin } from "@/lib/supabase/admin"
import Link from "next/link"
import { BookMarked, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = { title: "Watchlists" }
export const revalidate = 3600

function scoreColor(s: number) {
  if (s >= 75) return "text-emerald-400"
  if (s >= 60) return "text-blue-400"
  if (s >= 45) return "text-amber-400"
  return "text-red-400"
}

export default async function WatchlistsPage() {
  const { data: watchlists } = await supabaseAdmin
    .from("watchlists")
    .select("*, watchlist_companies(company_id, companies(ticker, name, score_total:ai_analyses(score_total)))")
    .order("sort_order", { ascending: true })

  // Haal ook alle bedrijven op met hun scores voor de top-companies weergave
  const { data: companies } = await supabaseAdmin
    .from("companies_with_latest_analysis")
    .select("id, ticker, name, sector, score_total, risk_level")
    .not("score_total", "is", null)
    .order("score_total", { ascending: false })

  const all = companies ?? []

  // Als er geen watchlists in Supabase zijn, toon een placeholder
  const lists = watchlists ?? []

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {lists.length === 0 ? (
        // Geen watchlists in DB → toon bedrijven gegroepeerd per sector
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-center">
            <BookMarked className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-400 font-medium">Watchlists worden automatisch aangemaakt door de pipeline</p>
            <p className="text-xs text-zinc-600 mt-1">Ondertussen zie je hier alle geanalyseerde bedrijven per sector</p>
          </div>

          {/* Bedrijven per sector als fallback */}
          {Object.entries(
            all.reduce((acc, c) => {
              const s = c.sector ?? "Overig"
              if (!acc[s]) acc[s] = []
              acc[s].push(c)
              return acc
            }, {} as Record<string, typeof all>)
          ).sort(([, a], [, b]) => {
            const avgA = a.reduce((s, c) => s + (c.score_total ?? 0), 0) / a.length
            const avgB = b.reduce((s, c) => s + (c.score_total ?? 0), 0) / b.length
            return avgB - avgA
          }).map(([sector, companies]) => {
            const avg = Math.round(companies.reduce((s, c) => s + (c.score_total ?? 0), 0) / companies.length)
            return (
              <div key={sector} className="rounded-xl border border-zinc-800 bg-zinc-900">
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
                  <div>
                    <h3 className="font-semibold text-zinc-100">{sector}</h3>
                    <p className="text-xs text-zinc-600 mt-0.5">{companies.length} bedrijven</p>
                  </div>
                  <span className={cn("text-sm font-bold", scoreColor(avg))}>Gem. {avg}</span>
                </div>
                <div className="divide-y divide-zinc-800/50">
                  {companies.slice(0, 5).map((c) => (
                    <Link key={c.id} href={`/companies/${c.id}`}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/40 transition-colors group">
                      <div className="h-7 w-7 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-indigo-400">{c.ticker?.slice(0, 2)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-300 truncate">{c.name}</p>
                        <p className="text-xs text-zinc-600">{c.ticker}</p>
                      </div>
                      {c.score_total != null && (
                        <span className={cn("text-sm font-bold tabular-nums shrink-0", scoreColor(c.score_total))}>
                          {c.score_total}
                        </span>
                      )}
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-700 shrink-0 opacity-0 group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
                {companies.length > 5 && (
                  <div className="px-5 py-3 border-t border-zinc-800">
                    <Link href={`/companies?sector=${encodeURIComponent(sector)}`}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      Alle {companies.length} bedrijven <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        // Echte watchlists uit Supabase
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {lists.map((list) => (
            <div key={list.id} className="rounded-xl border border-zinc-800 bg-zinc-900">
              <div className="px-5 py-4 border-b border-zinc-800">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-zinc-100">{list.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{list.theme}</p>
                  </div>
                  {list.average_score && (
                    <span className={cn("text-sm font-bold tabular-nums shrink-0", scoreColor(list.average_score))}>
                      {list.average_score}
                    </span>
                  )}
                </div>
                {list.description && (
                  <p className="text-xs text-zinc-600 mt-2 leading-relaxed">{list.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
