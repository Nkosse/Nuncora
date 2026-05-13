import Link from "next/link"
import { TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Disclaimer } from "@/components/shared/disclaimer"

export const metadata = { title: "Sign in" }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-zinc-100">Convex</span>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-zinc-100">Welcome back</h1>
            <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
          </div>

          {/* TODO: Wire up to Supabase Auth */}
          <form className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
              </div>
              <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
            </div>

            <Link href="/dashboard">
              <Button className="w-full gap-2 mt-2">
                Sign in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </form>

          <div className="mt-5 pt-5 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
              No account yet?{" "}
              <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>

        <Disclaimer compact className="mt-4 justify-center" />
      </div>
    </div>
  )
}
