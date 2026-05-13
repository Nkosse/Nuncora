import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, ExternalLink, TrendingUp, TrendingDown,
  AlertTriangle, Calendar, Users, Building2, Flame
} from "lucide-react"
import {
  getCompanyBySlug, getScoreByCompanyId,
  getKPIsByCompanyId, getThesisByCompanyId, companies
} from "@/data/mock/companies"
import { getCatalystsByCompany } from "@/data/mock/catalysts"
import { aiSummaries } from "@/data/mock/ai-summaries"
import { ScoreCard } from "@/components/shared/score-card"
import { SectorBadge } from "@/components/shared/sector-badge"
import { RiskBadge } from "@/components/shared/risk-badge"
import { Disclaimer } from "@/components/shared/disclaimer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export async function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }))
}

function fmtM(v: number) { return v >= 1000 ? `$${(v / 1000).toFixed(2)}B` : `$${v.toFixed(0)}M` }
function fmtPct(v: number, plus = true) { return `${plus && v > 0 ? "+" : ""}${v.toFixed(1)}%` }

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const company = getCompanyBySlug(slug)
  if (!company) notFound()

  const score   = getScoreByCompanyId(company.id)!
  const kpis    = getKPIsByCompanyId(company.id)!
  const thesis  = getThesisByCompanyId(company.id)!
  const cats    = getCatalystsByCompany(company.id)
  const aiSum   = aiSummaries.find((s) => s.companyId === company.id)

  const upcomingCats = cats.filter((c) => c.isUpcoming).slice(0, 6)

  function impactCls(level: string) {
    if (level === "Critical") return "bg-red-500/10 text-red-400 border border-red-500/20"
    if (level === "High")     return "bg-orange-500/10 text-orange-400 border border-orange-500/20"
    if (level === "Medium")   return "bg-amber-500/10 text-amber-400 border border-amber-500/20"
    return "bg-zinc-800 text-zinc-500"
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link href="/companies" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
        <ArrowLeft className="h-4 w-4" />Back to companies
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-5">
          <div className={cn("h-16 w-16 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-xl", company.logoPlaceholder)}>
            {company.ticker.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-zinc-100">{company.name}</h1>
              <span className="text-zinc-500 font-mono text-sm">{company.ticker}</span>
              <span className="text-xs text-zinc-600 border border-zinc-800 rounded px-2 py-0.5">{company.exchange}</span>
            </div>
            <p className="text-zinc-400 mb-3 italic">{company.oneLiner}</p>
            <div className="flex flex-wrap gap-2">
              <SectorBadge sector={company.sector} />
              <Badge variant="secondary">{company.marketCapCategory} Cap</Badge>
              <Badge variant={kpis.dilutionRisk === "Low" ? "success" : kpis.dilutionRisk === "Medium" ? "warning" : "destructive"}>
                Dilution: {kpis.dilutionRisk}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <p className="text-3xl font-bold text-zinc-100 tabular-nums">${company.stockPrice.toFixed(2)}</p>
              <p className={cn("text-sm font-medium tabular-nums", company.stockPriceChange >= 0 ? "text-emerald-400" : "text-red-400")}>
                {company.stockPriceChange >= 0 ? <TrendingUp className="inline h-3.5 w-3.5 mr-1" /> : <TrendingDown className="inline h-3.5 w-3.5 mr-1" />}
                {fmtPct(company.stockPriceChange)} today
              </p>
            </div>
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />Website
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Market Cap",        value: fmtM(company.marketCapValue),         sub: company.marketCapCategory + " cap" },
          { label: "Revenue (TTM)",     value: fmtM(kpis.revenue),                   sub: fmtPct(kpis.revenueGrowthYoY) + " YoY" },
          { label: "Gross Margin",      value: fmtPct(kpis.grossMargin, false),      sub: "Trailing 12 months" },
          { label: "Cash Runway",       value: `${kpis.cashRunway}m`,                sub: fmtM(kpis.cashOnHand) + " on hand" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{k.label}</p>
            <p className="text-xl font-bold text-zinc-100 tabular-nums">{k.value}</p>
            <p className="text-xs text-zinc-600 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Main tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="catalysts">Catalysts</TabsTrigger>
          <TabsTrigger value="ai-thesis">AI Thesis</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              {/* Company profile */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="font-semibold text-zinc-100 mb-3">Company Profile</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{company.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {[
                    { label: "Founded", value: company.founded.toString() },
                    { label: "HQ", value: company.hq },
                    { label: "Employees", value: company.employees.toLocaleString() },
                  ].map((f) => (
                    <div key={f.label}>
                      <p className="text-xs text-zinc-600 mb-0.5">{f.label}</p>
                      <p className="text-zinc-300 font-medium">{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment thesis */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <h3 className="font-semibold text-zinc-100">Investment Thesis</h3>
                </div>
                <ul className="space-y-2.5">
                  {thesis.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="text-indigo-400 font-bold mt-0.5 shrink-0">→</span>
                      <span className="text-zinc-400">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Scenarios */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="font-semibold text-zinc-100 mb-4">Scenario Analysis</h3>
                <div className="space-y-3">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">🐂 Bull Case</p>
                    <p className="text-sm text-zinc-400">{thesis.bullCase}</p>
                  </div>
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">📊 Base Case</p>
                    <p className="text-sm text-zinc-400">{thesis.baseCase}</p>
                  </div>
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">🐻 Bear Case</p>
                    <p className="text-sm text-zinc-400">{thesis.bearCase}</p>
                  </div>
                </div>
              </div>

              {/* Thesis breakers */}
              <div className="rounded-xl border border-red-500/20 bg-zinc-900 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <h3 className="font-semibold text-zinc-100">Thesis Breakers</h3>
                </div>
                <ul className="space-y-2">
                  {thesis.thesisBreakers.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                      <span className="text-red-400 font-bold shrink-0 mt-0.5">✗</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Score + moat + competitors */}
            <div className="space-y-5">
              <ScoreCard score={score} />

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="font-semibold text-zinc-100 mb-3">Moat Assessment</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{thesis.moatAssessment}</p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="font-semibold text-zinc-100 mb-3">Key Competitors</h3>
                <div className="space-y-1.5">
                  {thesis.competitors.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-sm">
                      <Building2 className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                      <span className="text-zinc-400">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <h3 className="font-semibold text-zinc-100 mb-3">Ownership Structure</h3>
                <div className="space-y-3">
                  {[
                    { label: "Insider Ownership",       value: `${kpis.insiderOwnership}%`,       color: kpis.insiderOwnership >= 10 ? "bg-emerald-500" : "bg-amber-500" },
                    { label: "Institutional Ownership", value: `${kpis.institutionalOwnership}%`, color: "bg-blue-500" },
                    { label: "Short Interest",          value: `${kpis.shortInterest}%`,          color: kpis.shortInterest > 10 ? "bg-red-500" : "bg-amber-500" },
                  ].map((o) => (
                    <div key={o.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-500">{o.label}</span>
                        <span className="text-zinc-300 font-medium">{o.value}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-800">
                        <div className={cn("h-full rounded-full", o.color)} style={{ width: o.value }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Financials */}
        <TabsContent value="financials">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="font-semibold text-zinc-100 mb-4">Financial Health</h3>
              <div className="space-y-3">
                {[
                  { label: "Revenue (TTM)",    value: fmtM(kpis.revenue),                          ok: true },
                  { label: "Rev Growth YoY",   value: fmtPct(kpis.revenueGrowthYoY),               ok: kpis.revenueGrowthYoY > 0 },
                  { label: "Rev Growth QoQ",   value: fmtPct(kpis.revenueGrowthQoQ),               ok: kpis.revenueGrowthQoQ > 0 },
                  { label: "Gross Margin",     value: fmtPct(kpis.grossMargin, false),             ok: kpis.grossMargin >= 30 },
                  { label: "Monthly Burn",     value: fmtM(kpis.burnRate) + "/mo",                 ok: kpis.burnRate < 15 },
                  { label: "Cash on Hand",     value: fmtM(kpis.cashOnHand),                       ok: true },
                  { label: "Cash Runway",      value: kpis.cashRunway + " months",                  ok: kpis.cashRunway >= 18 },
                  { label: "Shares Outstanding", value: kpis.sharesOutstanding.toFixed(1) + "M",  ok: true },
                  { label: "Dilution Risk",    value: kpis.dilutionRisk,                           ok: kpis.dilutionRisk === "Low" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-1.5 border-b border-zinc-800/50 last:border-0">
                    <span className="text-sm text-zinc-500">{r.label}</span>
                    <span className={cn("text-sm font-medium tabular-nums", r.ok ? "text-zinc-200" : "text-amber-400")}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="font-semibold text-zinc-100 mb-4">Risk Dashboard</h3>
              <div className="space-y-4">
                {[
                  { label: "Cash Runway Risk",     level: kpis.cashRunway < 12 ? "High" : kpis.cashRunway < 18 ? "Medium" : "Low" as const },
                  { label: "Dilution Risk",         level: kpis.dilutionRisk as "Low"|"Medium"|"High" },
                  { label: "Short Squeeze Risk",    level: (kpis.shortInterest > 15 ? "High" : kpis.shortInterest > 8 ? "Medium" : "Low") as "Low"|"Medium"|"High" },
                  { label: "Revenue Concentration", level: "Medium" as const },
                  { label: "Competition Risk",      level: "Medium" as const },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-sm text-zinc-500">{r.label}</span>
                    <RiskBadge level={r.level === "High" ? "High" : r.level === "Medium" ? "Medium" : "Low"} />
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">Recent Dilution</span>
                </div>
                <p className="text-xs text-zinc-400">
                  {kpis.recentDilution
                    ? "This company has issued new shares recently. Monitor outstanding share count quarterly."
                    : "No significant dilution in recent quarters. Positive sign for existing shareholders."}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Catalysts */}
        <TabsContent value="catalysts">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <h3 className="font-semibold text-zinc-100">Upcoming Catalysts</h3>
              <span className="text-xs text-zinc-600 ml-auto">{upcomingCats.length} events</span>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {upcomingCats.length === 0 ? (
                <p className="py-12 text-center text-sm text-zinc-600">No upcoming catalysts tracked</p>
              ) : upcomingCats.map((cat) => (
                <div key={cat.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-zinc-200">{cat.title}</span>
                        <span className={cn("text-xs rounded-md px-1.5 py-0.5 border font-medium", impactCls(cat.impactLevel))}>
                          {cat.impactLevel}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">{cat.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{cat.date ?? cat.estimatedPeriod}</span>
                        <span>{cat.type}</span>
                        <span>Confidence: {cat.confidenceLevel}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* AI Thesis */}
        <TabsContent value="ai-thesis">
          {aiSum ? (
            <div className="space-y-5">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI Summary</span>
                  {aiSum.isPlaceholder && <Badge variant="secondary" className="text-[10px]">Mock data</Badge>}
                </div>
                <p className="text-zinc-300 leading-relaxed">{aiSum.summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                  <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3">🐂 Bull Case</p>
                  <p className="text-sm text-zinc-400">{aiSum.bullCase}</p>
                </div>
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">🐻 Bear Case</p>
                  <p className="text-sm text-zinc-400">{aiSum.bearCase}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Bull Price Target", value: aiSum.valuationScenario.bull, color: "text-emerald-400" },
                  { label: "Base Price Target", value: aiSum.valuationScenario.base, color: "text-blue-400" },
                  { label: "Bear Price Target", value: aiSum.valuationScenario.bear, color: "text-red-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
                    <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <h4 className="text-sm font-semibold text-zinc-300 mb-3">Key Catalysts</h4>
                  <ul className="space-y-2">
                    {aiSum.keyCatalysts.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>{c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <h4 className="text-sm font-semibold text-zinc-300 mb-3">Main Risks</h4>
                  <ul className="space-y-2">
                    {aiSum.mainRisks.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="text-red-400 font-bold shrink-0">{i + 1}.</span>{r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs text-amber-400/70">
                  This AI analysis was generated using mock data for demonstration purposes.
                  {/* TODO: Connect to OpenAI API — see /lib/openai/client.ts */}
                  When connected to the OpenAI API, analyses will be generated dynamically based on real-time company data.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
              <p className="text-zinc-500">No AI summary available for this company</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Disclaimer />
    </div>
  )
}
