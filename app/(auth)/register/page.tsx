import Link from "next/link"
import { TrendingUp, ArrowRight, CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Disclaimer } from "@/components/shared/disclaimer"

export const metadata = { title: "Create account" }

const highlights = [
  "Asymmetric Upside Score™ for 50+ companies",
  "AI-powered investment thesis generator",
  "Catalyst calendar & risk alerts",
  "8 curated thematic watchlists",
]

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: value prop */}
        <div className="hidden md:block">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-zinc-100">Convex</span>
          </div>
          <h2 className="text-3xl font-bold text-zinc-100 mb-4 leading-tight">
            Intelligence platform for asymmetric opportunities
          </h2>
          <p className="text-zinc-500 mb-8 leading-relaxed">
            Stop scrolling Reddit for stock tips. Get structured, AI-powered research on future-tech smallcaps with real investment intelligence.
          </p>
          <div className="space-y-3">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-3 text-sm text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                {h}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-300">Pro Plan · €10,99/month</span>
            </div>
            <p className="text-xs text-zinc-500">Full access. Cancel anytime. Secure checkout via Stripe.</p>
          </div>
        </div>

        {/* Right: form */}
        <div>
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-zinc-100">Convex</span>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-zinc-100">Create your account</h1>
              <p className="text-sm text-zinc-500 mt-1">Start your research today</p>
            </div>

            {/* TODO: Wire up to Supabase Auth + Stripe checkout */}
            <form className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" type="text" placeholder="Jan de Vries" autoComplete="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jan@example.com" autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Min. 8 characters" autoComplete="new-password" />
              </div>

              <Link href="/dashboard">
                <Button className="w-full gap-2 mt-2" variant="premium">
                  Create account & start analyzing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <p className="text-xs text-zinc-600 text-center">
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            <div className="mt-5 pt-5 border-t border-zinc-800 text-center">
              <p className="text-sm text-zinc-500">
                Already have an account?{" "}
                <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
              </p>
            </div>
          </div>

          <Disclaimer compact className="mt-4" />
        </div>
      </div>
    </div>
  )
}
