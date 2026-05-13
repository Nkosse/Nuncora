import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ── Tailwind Class Merger ─────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency & Market Cap Formatting ─────────────────────────

export function formatCurrency(value: number, decimals = 2): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}B`
  return `$${value.toFixed(decimals)}M`
}

export function formatMarketCap(millions: number): string {
  if (millions >= 1000) return `$${(millions / 1000).toFixed(2)}B`
  return `$${millions.toFixed(0)}M`
}

// ── Percentage Formatting ─────────────────────────────────────

export function formatPercentage(value: number, showPlus = true): string {
  const formatted = `${Math.abs(value).toFixed(1)}%`
  if (value > 0 && showPlus) return `+${formatted}`
  if (value < 0) return `-${formatted}`
  return formatted
}

// ── Score Colors ──────────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 75) return 'text-emerald-400'
  if (score >= 60) return 'text-blue-400'
  if (score >= 45) return 'text-amber-400'
  return 'text-red-400'
}

export function getScoreBadgeVariant(
  score: number
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (score >= 75) return 'default'
  if (score >= 60) return 'secondary'
  if (score >= 45) return 'outline'
  return 'destructive'
}

export function getScoreBgColor(score: number): string {
  if (score >= 75) return 'bg-emerald-400/10 border-emerald-400/20'
  if (score >= 60) return 'bg-blue-400/10 border-blue-400/20'
  if (score >= 45) return 'bg-amber-400/10 border-amber-400/20'
  return 'bg-red-400/10 border-red-400/20'
}

// ── Risk Level Colors ─────────────────────────────────────────

export function getRiskColor(risk: string): string {
  switch (risk) {
    case 'Low':
      return 'text-emerald-400'
    case 'Medium':
      return 'text-amber-400'
    case 'High':
      return 'text-orange-400'
    case 'Very High':
      return 'text-red-400'
    default:
      return 'text-slate-400'
  }
}

export function getRiskBgColor(risk: string): string {
  switch (risk) {
    case 'Low':
      return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
    case 'Medium':
      return 'bg-amber-400/10 text-amber-400 border-amber-400/20'
    case 'High':
      return 'bg-orange-400/10 text-orange-400 border-orange-400/20'
    case 'Very High':
      return 'bg-red-400/10 text-red-400 border-red-400/20'
    default:
      return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
  }
}

// ── Impact Level Colors ───────────────────────────────────────

export function getImpactColor(impact: string): string {
  switch (impact) {
    case 'Critical':
      return 'text-red-400'
    case 'High':
      return 'text-orange-400'
    case 'Medium':
      return 'text-amber-400'
    case 'Low':
      return 'text-slate-400'
    default:
      return 'text-slate-400'
  }
}

export function getImpactBgColor(impact: string): string {
  switch (impact) {
    case 'Critical':
      return 'bg-red-400/10 text-red-400 border-red-400/20'
    case 'High':
      return 'bg-orange-400/10 text-orange-400 border-orange-400/20'
    case 'Medium':
      return 'bg-amber-400/10 text-amber-400 border-amber-400/20'
    case 'Low':
      return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
    default:
      return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
  }
}

// ── Stock Price Change Colors ─────────────────────────────────

export function getPriceChangeColor(change: number): string {
  if (change > 0) return 'text-emerald-400'
  if (change < 0) return 'text-red-400'
  return 'text-slate-400'
}

// ── Cash Runway Formatting ────────────────────────────────────

export function formatRunway(months: number): string {
  if (months >= 99) return 'Cash flow positive'
  if (months >= 24) return `${Math.floor(months / 12)}y ${months % 12}m`
  return `${months}m`
}

export function getRunwayColor(months: number): string {
  if (months >= 99) return 'text-emerald-400'
  if (months >= 24) return 'text-emerald-400'
  if (months >= 18) return 'text-amber-400'
  if (months >= 12) return 'text-orange-400'
  return 'text-red-400'
}

// ── String Utilities ──────────────────────────────────────────

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Number Formatting ─────────────────────────────────────────

export function formatLargeNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toFixed(0)
}

export function formatShares(millions: number): string {
  if (millions >= 1000) return `${(millions / 1000).toFixed(2)}B`
  return `${millions.toFixed(1)}M`
}

// ── Date Utilities ────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return `${Math.abs(diffDays)}d ago`
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `In ${diffDays}d`
  if (diffDays < 30) return `In ${Math.floor(diffDays / 7)}w`
  if (diffDays < 365) return `In ${Math.floor(diffDays / 30)}mo`
  return `In ${Math.floor(diffDays / 365)}y`
}

// ── Catalyst Type Styling ─────────────────────────────────────

export function getCatalystTypeColor(type: string): string {
  switch (type) {
    case 'Earnings':
      return 'bg-blue-400/10 text-blue-400 border-blue-400/20'
    case 'Product Launch':
      return 'bg-violet-400/10 text-violet-400 border-violet-400/20'
    case 'Regulatory':
      return 'bg-amber-400/10 text-amber-400 border-amber-400/20'
    case 'Contract':
      return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
    case 'Partnership':
      return 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20'
    case 'Launch':
      return 'bg-orange-400/10 text-orange-400 border-orange-400/20'
    case 'Investor Day':
      return 'bg-pink-400/10 text-pink-400 border-pink-400/20'
    case 'Financing':
      return 'bg-red-400/10 text-red-400 border-red-400/20'
    case 'Conference':
      return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
    default:
      return 'bg-slate-400/10 text-slate-400 border-slate-400/20'
  }
}

// ── Score Bar Width ───────────────────────────────────────────

export function getScoreBarWidth(score: number, max = 10): string {
  return `${(score / max) * 100}%`
}

// ── Dilution Risk ─────────────────────────────────────────────

export function getDilutionRiskColor(risk: 'Low' | 'Medium' | 'High'): string {
  switch (risk) {
    case 'Low':
      return 'text-emerald-400'
    case 'Medium':
      return 'text-amber-400'
    case 'High':
      return 'text-red-400'
    default:
      return 'text-slate-400'
  }
}

// ── Sector Icon Mapping ───────────────────────────────────────

export function getSectorEmoji(sector: string): string {
  switch (sector) {
    case 'AI Infrastructure':
      return '🤖'
    case 'Space Economy':
      return '🚀'
    case 'Quantum Computing':
      return '⚛️'
    case 'Energy Transition':
      return '⚡'
    case 'Photonics':
      return '💡'
    case 'Robotics':
      return '🦾'
    case 'Defense Tech':
      return '🛡️'
    case 'Next-Gen Connectivity':
      return '🌐'
    case 'Biotech':
      return '🧬'
    case 'Semiconductors':
      return '💾'
    default:
      return '📊'
  }
}
