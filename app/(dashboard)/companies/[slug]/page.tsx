import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, AlertTriangle, Calendar, Newspaper, Brain, BarChart2, LineChart, Target } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { Disclaimer } from "@/components/shared/disclaimer"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { FinancialTab } from "./financial-tab"
import { PriceChart } from "./price-chart"
import { PrognoseTracker } from "./prognose-tracker"

export const dynamic = "force-dynamic"

function scoreColor(s: number) {
  if (s >= 80) return "text-emerald-400"
  if (s >= 65) return "text-blue-400"
  if (s >= 50) return "text-amber-400"
  return "text-red-400"
}

function impactCls(level: string) {
  if (level === "Critical") return "bg-red-500/10 text-red-400 border border-red-500/20"
  if (level === "High")     return "bg-orange-500/10 text-orange-400 border border-orange-500/20"
  if (level === "Medium")   return "bg-amber-500/10 text-amber-400 border border-amber-500/20"
  return "bg-zinc-800 text-zinc-500 border border-zinc-700"
}

function riskCls(level: string) {
  if (level === "very-high") return "text-red-400 bg-red-500/10 border-red-500/20"
  if (level === "high")      return "text-orange-400 bg-orange-500/10 border-orange-500/20"
  if (level === "medium")    return "text-amber-400 bg-amber-500/10 border-amber-500/20"
  return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
}

function fmtMCap(v: number) {
  if (v >= 1_000_000_000) return `$${(v / 1_000_000_000).toFixed(2)}B`
  if (v >= 1_000_000)     return `$${(v / 1_000_000).toFixed(0)}M`
  return `$${v}`
}

const SUB_SCORE_LABELS: Record<string, string> = {
  score_revenue_growth:     "Revenue Growth",
  score_cash_runway:        "Cash Runway",
  score_tam_size:           "TAM Size",
  score_competitive_adv:    "Competitive Advantage",
  score_management:         "Management Quality",
  score_catalysts:          "Catalyst Density",
  score_short_interest:     "Short Interest Squeeze",
  score_dilution_risk:      "Dilution Risk (laag = goed)",
  score_sector_tailwind:    "Sector Tailwind",
  score_valuation:          "Valuation Discount",
  score_insider_ownership:  "Insider Ownership & Activiteit",
  score_tech_moat:          "Technologische Verdedigbaarheid",
}

const SUB_SCORE_INFO: Record<string, { desc: string; high: string; mid: string; low: string }> = {
  score_revenue_growth: {
    desc: "Jaarlijkse omzetgroei op basis van SEC EDGAR-data.",
    high: "Sterke groei — het bedrijf schaalt snel en wint marktaandeel.",
    mid:  "Gematigde groei — de markt wordt geleidelijk veroverd.",
    low:  "Trage of negatieve groei — groeikatalysatoren ontbreken voorlopig.",
  },
  score_cash_runway: {
    desc: "Hoe lang het bedrijf kan doordraaien zonder extra financiering.",
    high: "Lange cashbaan (>24 mnd) of al FCF-positief — geen acuut financieringsrisico.",
    mid:  "12–24 maanden cash — aandachtspunt, maar geen directe nood.",
    low:  "Minder dan 12 maanden cash — bijuitgifte of financieringsnood dreigt op korte termijn.",
  },
  score_tam_size: {
    desc: "Omvang van de totale adresseerbare markt (TAM).",
    high: "Enorme markt — zelfs een klein marktaandeel vertegenwoordigt miljarden aan omzet.",
    mid:  "Aantrekkelijke markt van substantiële omvang met ruimte voor meerdere winnaars.",
    low:  "Nichemarkt — het groeipotentieel is structureel beperkt.",
  },
  score_competitive_adv: {
    desc: "Duurzaam concurrentievoordeel via IP, netwerk, switching costs of schaalvoordelen.",
    high: "Sterk moat — het aanbod is lastig te repliceren door concurrenten.",
    mid:  "Enige differentiatie aanwezig, maar concurrentiedruk is voelbaar.",
    low:  "Weinig bescherming — commoditisatierisico drukt op lange-termijn marges.",
  },
  score_management: {
    desc: "Track record, visie en executievermogen van het leiderschapsteam.",
    high: "Bewezen leiders met een solide staat van dienst en heldere strategie.",
    mid:  "Competent maar nog niet volledig bewezen op dit schaalniveau.",
    low:  "Zwak of wisselend management — executierisico is een reële zorg.",
  },
  score_catalysts: {
    desc: "Aantal en kwaliteit van concrete aankomende groeikatalysatoren.",
    high: "Meerdere concrete catalysts op korte termijn — koersdruk kan snel omslaan.",
    mid:  "Enkele katalysatoren in het verschiet, tijdlijn is onzeker.",
    low:  "Weinig zichtbare triggers — de koers blijft waarschijnlijk vlak zonder verrassing.",
  },
  score_short_interest: {
    desc: "Hoog short interest creëert squeeze-potentieel bij positief nieuws.",
    high: "Hoog short interest — goed nieuws kan een explosieve short squeeze veroorzaken.",
    mid:  "Gemiddeld short interest — beperkt squeeze-potentieel als extra brandstof.",
    low:  "Laag short interest — weinig extra opwaartse kracht vanuit gedekte shorts.",
  },
  score_dilution_risk: {
    desc: "Risico op aandelenverwatering via bijuitgifte of convertibles (hoge score = laag risico).",
    high: "Laag verwateringsrisico — de kapitaalstructuur is gezond.",
    mid:  "Enige kans op bijuitgifte, maar niet acuut dreigend.",
    low:  "Hoog verwateringsrisico — bestaande aandeelhouders lopen kans op significante verwatering.",
  },
  score_sector_tailwind: {
    desc: "Mate waarin macrotrends en beleid de sector structureel ondersteunen.",
    high: "Krachtige structurele tailwind — de sector groeit hard en trekt kapitaal aan.",
    mid:  "Positieve trend aanwezig, maar geen explosieve sectorgroei verwacht.",
    low:  "Beperkte sectorsteun — tegenwind of stagnatie kan de waardering drukken.",
  },
  score_valuation: {
    desc: "Hoe aantrekkelijk de waardering is t.o.v. sectorgenoten (P/S, EV/Revenue).",
    high: "Significant undervalued vs peers — grote veiligheidsmarge en re-rating-potentieel.",
    mid:  "Redelijk gewaardeerd — discount is beperkt maar aanwezig.",
    low:  "Geprijsd voor perfectie — weinig ruimte voor teleurstellingen in de executie.",
  },
  score_insider_ownership: {
    desc: "Insider activiteit op basis van SEC Form 4 filings (aankopen vs verkopen).",
    high: "Insiders kopen actief bij eigen aandelen — sterk signaal van intern vertrouwen.",
    mid:  "Stabiel insider ownership — geen alarmsignalen, maar ook geen actieve aankopen.",
    low:  "Zware insider verkopen gedetecteerd — bearish signaal vanuit het management zelf.",
  },
  score_tech_moat: {
    desc: "Hoe wetenschappelijk en technisch moeilijk het product na te maken is door concurrenten. Referentie: ASML EUV = 10, generieke SaaS = 2.",
    high: "Uitzonderlijk hoge technologische barrière — het product vereist jaren R&D, unieke expertise of geheime processen die vrijwel niet te repliceren zijn.",
    mid:  "Betekenisvolle technische complexiteit — concurrenten kunnen het bouwen maar hebben een flinke achterstand in tijd en kapitaal.",
    low:  "Relatief eenvoudig na te maken — de technologie is beschikbaar en de concurrentiemacht is beperkt.",
  },
}

export default async function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [companyRes, analysisRes, catalystsRes, newsRes] = await Promise.allSettled([
    supabaseAdmin
      .from("companies_with_latest_analysis")
      .select("*")
      .eq("slug", slug)
      .single(),
    supabaseAdmin
      .from("ai_analyses")
      .select("*")
      .eq("company_id", slug)
      .order("generated_at", { ascending: false })
      .limit(1)
      .single(),
    supabaseAdmin
      .from("catalysts")
      .select("*")
      .eq("company_id", slug)
      .eq("is_upcoming", true)
      .order("catalyst_date", { ascending: true }),
    supabaseAdmin
      .from("company_news")
      .select("*")
      .eq("company_id", slug)
      .order("published_at", { ascending: false })
      .limit(15),
  ])

  const company  = companyRes.status === "fulfilled"  ? companyRes.value.data  : null
  const analysis = analysisRes.status === "fulfilled" ? analysisRes.value.data : null
  const catalysts = catalystsRes.status === "fulfilled" ? (catalystsRes.value.data ?? []) : []
  const news      = newsRes.status === "fulfilled"     ? (newsRes.value.data ?? [])      : []

  if (!company) notFound()

  const keyRisks: string[]   = Array.isArray(analysis?.key_risks) ? analysis.key_risks : []
  const aiCatalysts: unknown[] = Array.isArray(analysis?.catalysts) ? analysis.catalysts : []

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Terug */}
      <Link href="/companies" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Terug naar bedrijven
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-5">
          <div className="h-16 w-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-indigo-400">{company.ticker?.slice(0, 2)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-zinc-100">{company.name}</h1>
              <span className="text-zinc-500 font-mono text-sm">{company.ticker}</span>
              <span className="text-xs text-zinc-600 border border-zinc-800 rounded px-2 py-0.5">{company.exchange}</span>
              {analysis?.risk_level && (
                <span className={cn("text-xs rounded border px-2 py-0.5 font-medium", riskCls(analysis.risk_level))}>
                  {analysis.risk_level} risk
                </span>
              )}
            </div>
            <p className="text-zinc-500 text-sm mb-3">{company.sector} · {company.industry}</p>
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">{company.description}</p>
          </div>
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right">
              <p className="text-3xl font-bold text-zinc-100 tabular-nums">${company.price?.toFixed(2) ?? "—"}</p>
              {company.price_change_pct != null && (
                <p className={cn("text-sm font-medium", company.price_change_pct >= 0 ? "text-emerald-400" : "text-red-400")}>
                  {company.price_change_pct >= 0
                    ? <TrendingUp className="inline h-3.5 w-3.5 mr-1" />
                    : <TrendingDown className="inline h-3.5 w-3.5 mr-1" />}
                  {company.price_change_pct >= 0 ? "+" : ""}{company.price_change_pct.toFixed(1)}% vandaag
                </p>
              )}
            </div>
            {company.website && (
              <a href={company.website} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" /> Website
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Market Cap",       value: company.market_cap ? fmtMCap(company.market_cap) : "—",             sub: "Live van FMP" },
          { label: "Conviction Score",   value: company.score_total != null ? `${company.score_total}/100` : "—",   sub: "10 factoren · 0–100" },
          { label: "Prijsdoel (base)", value: analysis?.price_target_base ? `$${analysis.price_target_base}` : "—", sub: "12-maands prognose" },
          { label: "Prijsdoel (bull)", value: analysis?.price_target_bull ? `$${analysis.price_target_bull}` : "—", sub: "Bull scenario" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{k.label}</p>
            <p className="text-xl font-bold text-zinc-100 tabular-nums">{k.value}</p>
            <p className="text-xs text-zinc-600 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Instap Opportunity banner */}
      {analysis?.entry_is_opportunity && (
        <div className={cn(
          "rounded-xl border p-4 flex items-start gap-4",
          analysis.entry_strength === "strong"
            ? "border-emerald-500/30 bg-emerald-500/5"
            : analysis.entry_strength === "moderate"
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-zinc-700 bg-zinc-900"
        )}>
          <div className="h-9 w-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Target className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-zinc-100">Instap Kans geïdentificeerd</p>
              <span className={cn(
                "text-[10px] font-semibold rounded border px-1.5 py-0.5",
                analysis.entry_strength === "strong"
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : analysis.entry_strength === "moderate"
                  ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                  : "text-zinc-400 bg-zinc-800 border-zinc-700"
              )}>
                {analysis.entry_strength}
              </span>
              {analysis.entry_trigger_type && (
                <span className="text-[10px] text-zinc-500 bg-zinc-800 rounded px-1.5 py-0.5">
                  {(({
                    price_dip: "Koersdaling",
                    catalyst_approaching: "Catalyst nadert",
                    undervalued: "Onderwaardering",
                    combined: "Meerdere signalen",
                  } as Record<string, string>)[analysis.entry_trigger_type]) ?? analysis.entry_trigger_type}
                </span>
              )}
            </div>
            <p className="text-sm text-zinc-400">{analysis.entry_reason}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="w-full md:w-auto flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="chart" className="gap-1.5">
            <LineChart className="h-3.5 w-3.5" /> Grafiek
          </TabsTrigger>
          <TabsTrigger value="financials" className="gap-1.5">
            <BarChart2 className="h-3.5 w-3.5" /> Financieel
          </TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
          <TabsTrigger value="catalysts">Catalysts ({catalysts.length})</TabsTrigger>
          <TabsTrigger value="news">Nieuws ({news.length})</TabsTrigger>
        </TabsList>

        {/* Overzicht */}
        <TabsContent value="overview" className="space-y-5 mt-5">
          {!analysis ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <Brain className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Analyse nog niet beschikbaar — pipeline draait nog.</p>
            </div>
          ) : (
            <>
            {/* Begrijpelijke uitleg */}
            {analysis.plain_summary && (
              <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-5 space-y-5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">In gewone taal</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Wat doen ze?</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{analysis.plain_summary.whatTheyDo}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Concurrenten</p>
                    <ul className="space-y-1.5">
                      {(analysis.plain_summary.competitors ?? []).map((c: string, i: number) => (
                        <li key={i} className="text-sm text-zinc-400 leading-snug flex items-start gap-1.5">
                          <span className="text-zinc-600 shrink-0 mt-0.5">·</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Waarom kan het werken?</p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{analysis.plain_summary.whyItCouldWork}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                {/* Samenvatting */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <h3 className="font-semibold text-zinc-100 mb-3">Samenvatting</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{analysis.summary}</p>
                </div>

                {/* Investment thesis */}
                <div className="rounded-xl border border-indigo-500/20 bg-zinc-900 p-5">
                  <h3 className="font-semibold text-zinc-100 mb-3">Investment Thesis</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{analysis.thesis}</p>
                </div>

                {/* Bull / Bear */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">Bull Case</p>
                    <p className="text-sm text-zinc-400">{analysis.bull_case}</p>
                  </div>
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Bear Case</p>
                    <p className="text-sm text-zinc-400">{analysis.bear_case}</p>
                  </div>
                </div>

                {/* Key risks */}
                {keyRisks.length > 0 && (
                  <div className="rounded-xl border border-red-500/20 bg-zinc-900 p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                      <h3 className="font-semibold text-zinc-100">Key Risks</h3>
                    </div>
                    <ul className="space-y-2">
                      {keyRisks.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                          <span className="text-red-400 font-bold shrink-0 mt-0.5">✗</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Rechts: prijsdoelen + bedrijfsinfo */}
              <div className="space-y-5">
                {/* Prijsdoelen */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <h3 className="font-semibold text-zinc-100 mb-4">12-maands Prijsdoelen</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Bull",   value: analysis.price_target_bull,  cls: "text-emerald-400" },
                      { label: "Base",   value: analysis.price_target_base,  cls: "text-blue-400" },
                      { label: "Bear",   value: analysis.price_target_bear,  cls: "text-red-400" },
                    ].map((t) => (
                      <div key={t.label} className="flex items-center justify-between py-1.5 border-b border-zinc-800 last:border-0">
                        <span className="text-sm text-zinc-500">{t.label} scenario</span>
                        <span className={cn("text-sm font-bold tabular-nums", t.cls)}>
                          {t.value ? `$${t.value}` : "—"}
                        </span>
                      </div>
                    ))}
                    {company.price && analysis.price_target_bull && (
                      <div className="mt-2 pt-2 border-t border-zinc-800">
                        <p className="text-xs text-zinc-600 text-right">
                          Upside bull: +{Math.round(((analysis.price_target_bull - company.price) / company.price) * 100)}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bedrijfsinfo */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <h3 className="font-semibold text-zinc-100 mb-3">Bedrijfsinfo</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: "CEO",          value: company.ceo },
                      { label: "Medewerkers",  value: company.employees?.toLocaleString() },
                      { label: "IPO datum",    value: company.ipo_date },
                      { label: "Beurs",        value: company.exchange },
                      { label: "Land",         value: company.country },
                    ].filter((f) => f.value).map((f) => (
                      <div key={f.label} className="flex justify-between py-1 border-b border-zinc-800/50 last:border-0">
                        <span className="text-zinc-600">{f.label}</span>
                        <span className="text-zinc-300">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analyse meta */}
                <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3">
                  <p className="text-xs text-zinc-600">
                    Bijgewerkt op {new Date(analysis.generated_at).toLocaleDateString("nl-NL")} · {analysis.news_used} nieuwsartikelen meegenomen
                  </p>
                </div>
              </div>
            </div>

            <PrognoseTracker
              entryPrice={analysis.entry_price ?? null}
              currentPrice={company.price ?? null}
              targetBear={analysis.price_target_bear ?? null}
              targetBase={analysis.price_target_base ?? null}
              targetBull={analysis.price_target_bull ?? null}
              analysisDate={analysis.generated_at}
            />
            </>
          )}
        </TabsContent>

        {/* Grafiek */}
        <TabsContent value="chart" className="mt-5">
          <PriceChart ticker={company.ticker} exchange={company.exchange} />
          <p className="mt-2 text-xs text-zinc-700 text-right">Grafiek via TradingView · weekkoers</p>
        </TabsContent>

        {/* Financieel */}
        <TabsContent value="financials" className="mt-5">
          <FinancialTab
            ticker={company.ticker}
            price={company.price}
            marketCap={company.market_cap}
            beta={company.beta}
          />
        </TabsContent>

        {/* Score breakdown */}
        <TabsContent value="score" className="mt-5">
          {!analysis ? (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <p className="text-sm text-zinc-500">Score nog niet beschikbaar.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
              {/* Totaalscore */}
              <div className="flex items-center gap-5">
                <div className="relative h-24 w-24 shrink-0">
                  <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#27272a" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke={analysis.score_total >= 75 ? "#34d399" : analysis.score_total >= 60 ? "#60a5fa" : "#f59e0b"}
                      strokeWidth="3"
                      strokeDasharray={`${analysis.score_total} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={cn("text-2xl font-bold", scoreColor(analysis.score_total))}>{analysis.score_total}</span>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-bold text-zinc-100">Asymmetric Upside Score™</p>
                  <p className="text-sm text-zinc-500 mt-0.5">Gewogen score op basis van 10 factoren · 0–100</p>
                  <p className={cn("text-sm font-medium mt-2 capitalize", riskCls(analysis.risk_level).split(" ")[0])}>
                    Risicoprofiel: {analysis.risk_level}
                  </p>
                </div>
              </div>

              {/* Sub-scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(SUB_SCORE_LABELS).map(([key, label]) => {
                  const val = analysis[key as keyof typeof analysis] as number ?? 0
                  const pct = (val / 10) * 100
                  const color = pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-blue-500" : pct >= 30 ? "bg-amber-500" : "bg-red-500"
                  const info = SUB_SCORE_INFO[key]
                  const interp = info ? (val >= 7 ? info.high : val >= 4 ? info.mid : info.low) : null
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 font-medium">{label}</span>
                        <span className={cn("font-bold", scoreColor(pct))}>{val}/10</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-800">
                        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
                      </div>
                      {info && (
                        <p className="text-xs text-zinc-600 leading-snug pt-0.5">
                          <span className="text-zinc-700">{info.desc}</span>{" "}
                          <span className={val >= 7 ? "text-emerald-600" : val >= 4 ? "text-amber-600" : "text-red-600"}>{interp}</span>
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Samenvatting sterkste / zwakste factoren */}
              {(() => {
                const scored = Object.entries(SUB_SCORE_LABELS)
                  .map(([key, label]) => ({ key, label, val: (analysis[key as keyof typeof analysis] as number) ?? 0 }))
                  .filter(f => f.val > 0)
                  .sort((a, b) => b.val - a.val)
                const top    = scored.slice(0, 3)
                const bottom = scored.slice(-2).reverse()
                return (
                  <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Wat betekent dit voor het aandeel?</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-emerald-500 font-medium mb-1.5">Sterke punten</p>
                        <ul className="space-y-1">
                          {top.map(f => (
                            <li key={f.key} className="flex items-start gap-1.5 text-zinc-400">
                              <span className="text-emerald-500 shrink-0">✓</span>
                              <span><span className="text-zinc-300">{f.label}</span> ({f.val}/10) — {SUB_SCORE_INFO[f.key]?.high ?? ""}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-red-500 font-medium mb-1.5">Aandachtspunten</p>
                        <ul className="space-y-1">
                          {bottom.map(f => (
                            <li key={f.key} className="flex items-start gap-1.5 text-zinc-400">
                              <span className="text-red-500 shrink-0">!</span>
                              <span><span className="text-zinc-300">{f.label}</span> ({f.val}/10) — {SUB_SCORE_INFO[f.key]?.low ?? ""}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-600 pt-1 border-t border-zinc-800">
                      {analysis.score_total >= 75
                        ? "Sterke asymmetrische kans — meerdere factoren wijzen op significant opwaarts potentieel."
                        : analysis.score_total >= 60
                        ? "Interessante kans met duidelijke risico's — selectieve positionering is verstandig."
                        : analysis.score_total >= 45
                        ? "Speculatieve thesis — hoge onzekerheid vereist strikte positiegrootte."
                        : "Hoog risicoprofiel — alleen geschikt voor kleine speculatieve posities."}
                    </p>
                  </div>
                )
              })()}
            </div>
          )}
        </TabsContent>

        {/* Catalysts */}
        <TabsContent value="catalysts" className="mt-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
              <Calendar className="h-4 w-4 text-indigo-400" />
              <h3 className="font-semibold text-zinc-100">Aankomende Catalysts</h3>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {catalysts.length === 0 ? (
                <p className="py-12 text-center text-sm text-zinc-600">Geen catalysts geïdentificeerd</p>
              ) : catalysts.map((cat) => (
                <div key={cat.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-zinc-200">{cat.title}</span>
                        <span className={cn("text-xs rounded-md px-1.5 py-0.5 font-medium", impactCls(cat.impact_level))}>
                          {cat.impact_level}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-zinc-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {cat.estimated_period ?? cat.catalyst_date ?? "Onbekend"}
                        </span>
                        <span>{cat.catalyst_type}</span>
                        <span>Zekerheid: {cat.confidence_level}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Nieuws */}
        <TabsContent value="news" className="mt-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-800">
              <Newspaper className="h-4 w-4 text-indigo-400" />
              <h3 className="font-semibold text-zinc-100">Recent Nieuws</h3>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {news.length === 0 ? (
                <p className="py-12 text-center text-sm text-zinc-600">Geen recent nieuws opgehaald</p>
              ) : news.map((n) => (
                <a
                  key={n.id}
                  href={n.url ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-5 py-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <p className="text-sm font-medium text-zinc-200 leading-snug mb-1">{n.title}</p>
                  {n.summary && <p className="text-xs text-zinc-500 line-clamp-2">{n.summary}</p>}
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-700">
                    <span>{n.source}</span>
                    {n.published_at && <span>{new Date(n.published_at).toLocaleDateString("nl-NL")}</span>}
                    {n.url && <ExternalLink className="h-3 w-3 ml-auto" />}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Disclaimer compact />
    </div>
  )
}
