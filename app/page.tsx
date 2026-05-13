import Link from "next/link"
import {
  Brain, Shield, Zap, BarChart3, Calendar,
  CheckCircle2, ArrowRight, Star, Lock, Globe
} from "lucide-react"
import { ConvexLogo } from "@/components/shared/logo"
import { Button } from "@/components/ui/button"
import { Disclaimer } from "@/components/shared/disclaimer"

const features = [
  { icon: BarChart3, title: "Asymmetric Upside Score™", description: "Proprietary 10-factor scoring model that identifies high-potential smallcaps before the crowd discovers them." },
  { icon: Brain,     title: "AI Investment Thesis",     description: "Generate detailed bull/bear cases, catalyst timelines, and valuation scenarios powered by advanced AI." },
  { icon: Calendar,  title: "Catalyst Calendar",         description: "Never miss a product launch, earnings date, or regulatory milestone. Track 100+ upcoming catalysts." },
  { icon: Shield,    title: "Risk Intelligence",         description: "Dilution risk alerts, short interest tracking, and insider activity monitoring across your entire watchlist." },
  { icon: Zap,       title: "Thematic Watchlists",       description: "Curated lists across AI Infrastructure, Space Economy, Quantum Computing, Defense Tech, and more." },
  { icon: Globe,     title: "Advanced Screener",         description: "Filter by score, sector, cash runway, market cap, and 20+ KPIs to find your next asymmetric opportunity." },
]

const sectors = ["AI Infrastructure","Space Economy","Quantum Computing","Energy Transition","Photonics","Robotics","Defense Tech","Next-Gen Connectivity"]

const testimonials = [
  { text: "Convex helped me identify RKLB at $4. The catalyst calendar and upside score gave me conviction to hold through volatility.", author: "Michael T.", role: "Retail Investor", stars: 5 },
  { text: "Finally a platform that takes smallcap research seriously. The AI thesis generator saves me hours every week.", author: "Sarah K.", role: "Independent Analyst", stars: 5 },
  { text: "The dilution risk tracker alone is worth the subscription. I've avoided two toxic ATM offerings this quarter.", author: "David R.", role: "Growth Investor", stars: 5 },
]

const planFeatures = [
  "Full access to 50+ company analyses",
  "Asymmetric Upside Score™ for all companies",
  "AI investment thesis generator",
  "Catalyst calendar with alerts",
  "8 curated thematic watchlists",
  "Advanced screener with 20+ filters",
  "Risk & dilution monitoring",
  "Weekly market intelligence updates",
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md px-6">
        <div className="flex items-center gap-2">
          <ConvexLogo size="md" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link href="/register"><Button size="sm">Start analyzing</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-400 mb-6">
            <Zap className="h-3 w-3" /> AI-powered · Future-tech · Smallcaps
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-zinc-100 leading-tight mb-6">
            Find asymmetric opportunities{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">before the crowd</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Convex is an AI-powered intelligence platform built for serious retail investors who want institutional-grade research on future-tech smallcaps — space, quantum, AI infrastructure, defense, robotics, and more.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"><Button size="xl" variant="premium" className="gap-2">Start analyzing for free <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/dashboard"><Button size="xl" variant="outline">View demo dashboard</Button></Link>
          </div>
          <p className="text-xs text-zinc-600 mt-4">No credit card required · €10,99/month after trial · Cancel anytime</p>
        </div>

        {/* Dashboard preview */}
        <div className="relative mt-16 max-w-5xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-1 shadow-2xl shadow-black/50">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
                <span className="ml-3 text-xs text-zinc-600">Convex · Dashboard</span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Companies Tracked", value: "52", color: "text-indigo-400" },
                  { label: "Avg. Score", value: "67/100", color: "text-emerald-400" },
                  { label: "Upcoming Catalysts", value: "28", color: "text-amber-400" },
                  { label: "Risk Alerts", value: "3", color: "text-red-400" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                    <p className="text-xs text-zinc-600 mb-1">{s.label}</p>
                    <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: "Rocket Lab", ticker: "RKLB", score: 84, change: "+3.7%" },
                  { name: "IonQ", ticker: "IONQ", score: 76, change: "+1.2%" },
                  { name: "Serve Robotics", ticker: "SERV", score: 71, change: "-0.8%" },
                ].map((c) => (
                  <div key={c.ticker} className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-zinc-300">{c.name}</span>
                      <span className="text-xs font-mono text-zinc-500">{c.ticker}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-indigo-400 font-bold">Score {c.score}</span>
                      <span className={`text-xs font-medium ${c.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>{c.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sectors strip */}
      <section className="py-10 px-6 border-y border-zinc-800/50">
        <p className="text-center text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-5">Covering the most important future-tech sectors</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {sectors.map((s) => (
            <span key={s} className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-sm text-zinc-400">{s}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">Everything you need to find the next asymmetric winner</h2>
            <p className="text-zinc-500 max-w-xl mx-auto">Built by investors, for investors. Not Bloomberg. Not Robinhood. Something in between — focused entirely on future-tech opportunity.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-700 transition-colors">
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/10 border border-indigo-500/20">
                    <Icon className="h-4 w-4 text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Score model */}
      <section className="py-20 px-6 bg-zinc-900/30 border-y border-zinc-800">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 mb-5">Proprietary Model</div>
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">The Asymmetric Upside Score™</h2>
            <p className="text-zinc-500 mb-6 leading-relaxed">Our 10-factor scoring model evaluates every company across market opportunity, technology moat, revenue traction, insider alignment, cash runway, and more. One number. Ten dimensions. Full transparency.</p>
            <div className="space-y-2">
              {["Market Opportunity","Technology Moat","Revenue Traction","Insider Alignment","Cash Runway"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />{item}
                </div>
              ))}
              <div className="text-sm text-zinc-600 ml-6">+ 5 more factors</div>
            </div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="font-semibold text-zinc-100">Rocket Lab (RKLB)</p>
                <p className="text-xs text-zinc-500">Space Economy · NASDAQ</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative w-14 h-14 rounded-full" style={{ background: "conic-gradient(#10b981 302deg, #27272a 0deg)" }}>
                  <div className="absolute inset-1 rounded-full bg-zinc-900 flex items-center justify-center">
                    <span className="text-sm font-bold text-zinc-100">84</span>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-medium mt-1">Excellent</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {[["Market Opportunity",10],["Technology Moat",9],["Revenue Traction",8],["Catalyst Strength",9],["Valuation Upside",7]].map(([l, v]) => (
                <div key={l as string} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">{l}</span>
                    <span className="text-emerald-400 font-medium">{v}/10</span>
                  </div>
                  <div className="h-1 rounded-full bg-zinc-800">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(v as number) * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-zinc-100 text-center mb-12">Trusted by serious retail investors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.author} className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-zinc-300">{t.author}</p>
                  <p className="text-xs text-zinc-600">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-zinc-900/30 border-y border-zinc-800" id="pricing">
        <div className="max-w-sm mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-100 mb-3">Simple, transparent pricing</h2>
          <p className="text-zinc-500 mb-10">One plan. Full access. No surprises.</p>
          <div className="rounded-2xl border border-indigo-500/30 bg-zinc-900 p-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400 mb-5">
              <Zap className="h-3 w-3" />Pro Plan
            </div>
            <div className="mb-6">
              <div className="flex items-end justify-center gap-1">
                <span className="text-5xl font-bold text-zinc-100">€10,99</span>
                <span className="text-zinc-500 mb-1">/month</span>
              </div>
              <p className="text-xs text-zinc-600 mt-1">Billed monthly · Cancel anytime</p>
            </div>
            <div className="space-y-2.5 mb-8 text-left">
              {planFeatures.map((f) => (
                <div key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-zinc-300">{f}</span>
                </div>
              ))}
            </div>
            <Link href="/register" className="block">
              <Button size="lg" variant="premium" className="w-full gap-2">Start analyzing <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <p className="text-xs text-zinc-600 mt-3">
              <Lock className="inline h-3 w-3 mr-1" />Powered by Stripe · Secure checkout
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-zinc-100 mb-4">Ready to find your next asymmetric opportunity?</h2>
          <p className="text-zinc-500 mb-8">Join hundreds of retail investors using Convex to research future-tech smallcaps smarter.</p>
          <Link href="/register"><Button size="xl" variant="premium" className="gap-2">Start analyzing for free <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <Disclaimer className="mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <ConvexLogo size="sm" className="opacity-50" />
            </div>
            <p className="text-xs text-zinc-700">© 2026 Convex. For research and education only. Not financial advice.</p>
            <div className="flex items-center gap-4 text-xs text-zinc-700">
              <Link href="/login" className="hover:text-zinc-400">Sign in</Link>
              <Link href="/register" className="hover:text-zinc-400">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
