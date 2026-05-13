import { CheckCircle2, Zap, CreditCard, Shield, ExternalLink, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Disclaimer } from "@/components/shared/disclaimer"
import { SUBSCRIPTION_PRICE } from "@/lib/stripe/client"

export const metadata = { title: "Account" }

const planFeatures = [
  "Full access to 50+ company analyses",
  "Asymmetric Upside Score™ for all companies",
  "AI investment thesis generator",
  "Catalyst calendar with event tracking",
  "8 curated thematic watchlists",
  "Advanced screener (20+ filters)",
  "Risk & dilution monitoring",
  "Weekly intelligence updates",
]

export default function AccountPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* User card */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <span className="text-xl font-bold text-indigo-400">NK</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100">Demo User</h2>
            <p className="text-sm text-zinc-500">niek@example.com</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Pro · Active</span>
            </div>
          </div>
          <div className="ml-auto">
            {/* TODO: Wire up to Supabase auth */}
            <Button variant="outline" size="sm">Edit profile</Button>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-400" />
          <h3 className="font-semibold text-zinc-100">Subscription</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-zinc-100">Convex Pro</p>
              <p className="text-sm text-zinc-500">{SUBSCRIPTION_PRICE.displayPrice}/month · Billed monthly</p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />Active
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-500">Current period</span>
              <span className="text-zinc-300">May 1 – Jun 1, 2026</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Next charge</span>
              <span className="text-zinc-300">{SUBSCRIPTION_PRICE.displayPrice} on June 1, 2026</span>
            </div>
          </div>

          <div className="flex gap-3">
            {/* TODO: Wire up to Stripe billing portal — see /lib/stripe/client.ts */}
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <ExternalLink className="h-3.5 w-3.5" />Manage billing
            </Button>
            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10" disabled>
              Cancel subscription
            </Button>
          </div>
          <p className="text-xs text-zinc-700 mt-2">
            Billing is managed via Stripe. Connect your Stripe credentials to enable billing management.
          </p>
        </div>
      </div>

      {/* Plan features */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Shield className="h-4 w-4 text-indigo-400" />
          <h3 className="font-semibold text-zinc-100">Included in your plan</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {planFeatures.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-zinc-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Payment method placeholder */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-zinc-500" />
          <h3 className="font-semibold text-zinc-100">Payment method</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <div className="h-8 w-12 rounded bg-zinc-800 flex items-center justify-center">
              <span className="text-xs font-bold text-zinc-500">VISA</span>
            </div>
            <div>
              <p className="text-sm text-zinc-300">•••• •••• •••• 4242</p>
              <p className="text-xs text-zinc-600">Expires 12/28</p>
            </div>
            <Button variant="ghost" size="sm" className="ml-auto text-xs" disabled>Update</Button>
          </div>
          <p className="text-xs text-zinc-700 mt-2 flex items-center gap-1">
            <Lock className="h-3 w-3" />Secured by Stripe. Convex never stores payment data.
          </p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h3 className="font-semibold text-zinc-100">Account</h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Sign out</p>
              <p className="text-xs text-zinc-600">Sign out from this device</p>
            </div>
            {/* TODO: Wire up to Supabase signOut */}
            <Button variant="outline" size="sm">Sign out</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-400">Delete account</p>
              <p className="text-xs text-zinc-600">Permanently delete your account and data</p>
            </div>
            <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">Delete</Button>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  )
}
