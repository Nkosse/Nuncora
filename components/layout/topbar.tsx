"use client"

import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard":   { title: "Dashboard",        description: "Your investment intelligence overview" },
  "/companies":   { title: "Companies",         description: "Browse and analyze future-tech smallcaps" },
  "/watchlists":  { title: "Watchlists",        description: "Your curated investment themes" },
  "/catalysts":   { title: "Catalyst Calendar", description: "Upcoming events and milestones" },
  "/screener":    { title: "Screener",          description: "Filter and discover asymmetric opportunities" },
  "/ai-research": { title: "AI Research",       description: "AI-powered investment thesis generator" },
  "/account":     { title: "Account",           description: "Manage your subscription and settings" },
}

export function Topbar() {
  const pathname = usePathname()
  const base = "/" + pathname.split("/")[1]
  const info = pageTitles[base] ?? { title: "Convex", description: "Investment intelligence platform" }

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-zinc-800 bg-zinc-950 px-6">
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-zinc-100 truncate">{info.title}</h1>
        <p className="text-xs text-zinc-600 hidden sm:block truncate">{info.description}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
          <Input placeholder="Search companies…" className="w-52 pl-8 h-8 text-xs" />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4 text-zinc-500" />
        </Button>
      </div>
    </header>
  )
}
