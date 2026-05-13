"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ConvexLogo } from "@/components/shared/logo"
import {
  LayoutDashboard,
  Building2,
  BookMarked,
  Calendar,
  Filter,
  Brain,
  User,
  ChevronRight,
  Zap,
} from "lucide-react"

const navItems = [
  { href: "/dashboard",   label: "Dashboard",  icon: LayoutDashboard },
  { href: "/companies",   label: "Companies",  icon: Building2 },
  { href: "/watchlists",  label: "Watchlists", icon: BookMarked },
  { href: "/catalysts",   label: "Catalysts",  icon: Calendar },
  { href: "/screener",    label: "Screener",   icon: Filter },
  { href: "/ai-research", label: "Research",   icon: Brain },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-zinc-800 px-4">
        <ConvexLogo size="md" />
        <span className="ml-auto text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5">
          BETA
        </span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/20"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-indigo-400" : "text-zinc-600 group-hover:text-zinc-400"
              )} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight className="h-3 w-3 text-indigo-500/60" />}
            </Link>
          )
        })}

        {/* Status card */}
        <div className="mt-4 mx-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-zinc-500">Live data</span>
          </div>
          <p className="text-xs text-zinc-700 mt-1">Nachtelijks bijgewerkt</p>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-zinc-800 px-2 py-3">
        <Link
          href="/account"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-all group border border-transparent",
            pathname === "/account"
              ? "bg-indigo-600/15 text-indigo-400 border-indigo-500/20"
              : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
          )}
        >
          <User className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-400" />
          Account
        </Link>

        {/* User chip */}
        <div className="mt-2 flex items-center gap-2.5 px-2.5 py-2">
          <div className="h-7 w-7 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-indigo-400">NK</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-300 truncate">Niek</p>
            <p className="text-xs text-zinc-600 truncate">nuncora.vercel.app</p>
          </div>
          <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
        </div>
      </div>
    </aside>
  )
}
