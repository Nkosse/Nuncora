"use client"

import { usePathname } from "next/navigation"
import { Menu, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const pageTitles: Record<string, string> = {
  "/dashboard":   "Dashboard",
  "/companies":   "Companies",
  "/watchlists":  "Watchlists",
  "/catalysts":   "Catalysts",
  "/screener":    "Screener",
  "/ai-research": "Research",
  "/account":     "Account",
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname()
  const base  = "/" + pathname.split("/")[1]
  const title = pageTitles[base] ?? "Nuncora"

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4">
      {/* Hamburger — mobiel only */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 md:hidden shrink-0"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5 text-zinc-400" />
      </Button>

      <h1 className="text-sm font-semibold text-zinc-100 flex-1 truncate">{title}</h1>

      {/* Search — verborgen op mobiel */}
      <div className="relative hidden md:block shrink-0">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
        <Input placeholder="Zoek bedrijf…" className="w-48 pl-8 h-8 text-xs" />
      </div>
    </header>
  )
}
