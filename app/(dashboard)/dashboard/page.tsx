import Link from "next/link"
import {
  TrendingUp, TrendingDown, AlertTriangle, Calendar,
  ArrowRight, Zap, Building2, Star
} from "lucide-react"
import { companies, asymmetricScores, getScoreByCompanyId, getKPIsByCompanyId } from "@/data/mock/companies"
import { catalysts } from "@/data/mock/catalysts"
import { SectorBadge } from "@/components/shared/sector-badge"
import { Disclaimer } from "@/components/shared/disclaimer"
import { Button } from "@/components/ui/button"
import { SyncPanel } from "@/components/sync/sync-panel"

export const metadata = { title: "Dashboard" }

// Top opportunities: sorted by score
const topOpportunities = companies
  .map((c) => ({ company: c, score: getScoreByCompanyId(c.id)! }))
  .filter((x) => x.score)
  .sort((a, b) => b.score.totalScore - a.score.totalScore)
  .slice(0, 6)

// Upcoming catalysts (next 60 days)
const upcomingCatalysts = catalysts
  .filter((c) => c.isUpcoming && c.date)
  .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime())
  .slice(0, 5)

// Risk alerts: high dilution risk or high short interest
const riskAlerts = companies
  .map((c) => ({ company: c, kpis: getKPIsByCompanyId(c.id)! }))
  .filter((x) => x.kpis && (x.kpis.dilutionRisk === "High" || x.kpis.shortInterest > 12))
  .slice(0, 3)

const sectorStats = [
  { sector: "Space Economy",     count: 2, avgScore: 77, emoji: "🚀" },
  { sector: "Quantum Computing", count: 2, avgScore: 69, emoji: "⚛️" },
  { sector: "AI Infrastructure", count: 2, avgScore: 73, emoji: "🤖" },
  { sector: "Defense Tech",      count: 2, avgScore: 72, emoji: "🛡️" },
]

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-blue-400"
  if (s >= 50) return "text-amber-400"
  return "text-red-400"
}

function impactColor(level: string) {
  if (level === "Critical") return "text-red-400 bg-red-500/10 border-red-500/20"
  if (level === "High")     return "text-orange-400 bg-orange-500/10 border-orange-500/20"
  return "text-amber-400 bg-amber-500/10 border-amber-500/20"
}

export default function DashboardPage() {
  const avgScore = Math.round(asymmetricScores.reduce((s, x) => s + x.totalScore, 0) / asymmetricScores.length)

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Good morning, Demo User</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Here&apos;s your investment intelligence for 12 May 2026</p>
        </div>
        <Link href="/companies">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Building2 className="h-3.5 w-3.5" />
            Browse companies
          </Button>
        </Link>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Companies Tracked", value: companies.length.toString(), sub: "15 sectors covered", icon: Building2, color: "text-indigo-400" },
          { label: "Avg. Upside Score",  value: `${avgScore}/100`,           sub: "Across all companies", icon: TrendingUp, color: "text-emerald-400" },
          { label: "Upcoming Catalysts", value: upcomingCatalysts.length.toString(), sub: "Next 60 days",   icon: Calendar, color: "text-amber-400" },
          { label: "Risk Alerts",        value: riskAlerts.length.toString(), sub: "Require attention",   icon: AlertTriangle, color: "text-red-400" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-bold tabular-nums ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-zinc-600 mt-1">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      {/* AI Sync Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SyncPanel />
        </div>
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-zinc-100">How AI Sync works</h3>
          </div>
          <ol className="space-y-2">
            {[
              { n: "1", text: "FMP screener finds $50M–$3B smallcap companies in future-tech sectors" },
              { n: "2", text: "Financial data is pulled: income statement, balance sheet, cash flow, key metrics" },
              { n: "3", text: "Claude (claude-opus-4-7) analyzes each company and generates an Asymmetric Upside Score™" },
              { n: "4", text: "Results are ranked by score — highest conviction opportunities surface to the top" },
            ].map((step) => (
              <li key={step.n} className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400">
                  {step.n}
                </span>
                <p className="text-xs text-zinc-500 leading-relaxed pt-0.5">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
            <p className="text-[11px] text-amber-400">
              Requires <code className="font-mono">ANTHROPIC_API_KEY</code> and <code className="font-mono">FMP_API_KEY</code> in <code className="font-mono">.env.local</code>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Opportunities */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-400" />
              <h3 className="font-semibold text-zinc-100">Top Asymmetric Opportunities</h3>
            </div>
            <Link href="/companies" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/50">
            {topOpportunities.map(({ company, score }) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/40 transition-colors group"
              >
                <div className={`h-9 w-9 rounded-lg ${company.logoPlaceholder} flex items-center justify-center shrink-0`}>
                  <span className="text-xs font-bold text-white">{company.ticker.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-200 group-hover:text-white truncate">{company.name}</span>
                    <span className="text-xs text-zinc-600 font-mono shrink-0">{company.ticker}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <SectorBadge sector={company.sector} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold tabular-nums ${scoreColor(score.totalScore)}`}>{score.totalScore}</p>
                  <p className="text-xs text-zinc-600">/ 100</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold tabular-nums ${company.stockPriceChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    ${company.stockPrice.toFixed(2)}
                  </p>
                  <p className={`text-xs ${company.stockPriceChange >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {company.stockPriceChange >= 0 ? "+" : ""}{company.stockPriceChange.toFixed(1)}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Upcoming catalysts */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-400" />
                <h3 className="font-semibold text-zinc-100">Upcoming Catalysts</h3>
              </div>
              <Link href="/catalysts" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {upcomingCatalysts.map((cat) => (
                <div key={cat.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-200 truncate">{cat.companyTicker} · {cat.title}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{cat.date ?? cat.estimatedPeriod}</p>
                    </div>
                    <span className={`shrink-0 text-xs rounded-md px-1.5 py-0.5 border font-medium ${impactColor(cat.impactLevel)}`}>
                      {cat.impactLevel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk alerts */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h3 className="font-semibold text-zinc-100">Risk Alerts</h3>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {riskAlerts.map(({ company, kpis }) => (
                <Link key={company.id} href={`/companies/${company.slug}`} className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/40 transition-colors">
                  <div className={`h-7 w-7 rounded ${company.logoPlaceholder} flex items-center justify-center shrink-0`}>
                    <span className="text-xs font-bold text-white">{company.ticker.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-300 truncate">{company.name}</p>
                    <p className="text-xs text-red-400 mt-0.5">
                      {kpis.dilutionRisk === "High" ? "High dilution risk" : `Short interest ${kpis.shortInterest}%`}
                    </p>
                  </div>
                  <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sector cards */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sector Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sectorStats.map((s) => (
            <Link key={s.sector} href={`/companies?sector=${encodeURIComponent(s.sector)}`}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors">
                <div className="text-2xl mb-2">{s.emoji}</div>
                <p className="text-sm font-semibold text-zinc-200">{s.sector}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-zinc-600">{s.count} companies</span>
                  <span className={`text-xs font-bold ${scoreColor(s.avgScore)}`}>Avg {s.avgScore}</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-zinc-800">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${s.avgScore}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/ai-research", icon: Zap, label: "Generate AI Thesis", desc: "AI-powered analysis for any company", color: "text-violet-400" },
          { href: "/watchlists",  icon: Star, label: "View Watchlists",    desc: "8 curated thematic portfolios",       color: "text-amber-400" },
          { href: "/screener",    icon: TrendingUp, label: "Open Screener", desc: "Filter 15 companies by 20+ metrics",  color: "text-emerald-400" },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">{item.label}</p>
                  <p className="text-xs text-zinc-600">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-zinc-700 ml-auto" />
              </div>
            </Link>
          )
        })}
      </div>

      <Disclaimer compact />
    </div>
  )
}
