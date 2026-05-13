// ============================================================
// CONVEX INVESTOR DASHBOARD — Core TypeScript Types
// ============================================================

// ── Enums / Literals ─────────────────────────────────────────

export type Sector =
  | 'AI Infrastructure'
  | 'Space Economy'
  | 'Quantum Computing'
  | 'Energy Transition'
  | 'Photonics'
  | 'Robotics'
  | 'Defense Tech'
  | 'Next-Gen Connectivity'
  | 'Biotech'
  | 'Semiconductors'

export type Exchange = 'NASDAQ' | 'NYSE' | 'NYSE American' | 'OTC' | 'TSX'

export type MarketCap = 'Micro' | 'Small' | 'Mid' | 'Large'

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High'

export type ImpactLevel = 'Low' | 'Medium' | 'High' | 'Critical'

export type CatalystType =
  | 'Earnings'
  | 'Product Launch'
  | 'Regulatory'
  | 'Investor Day'
  | 'Contract'
  | 'Partnership'
  | 'Launch'
  | 'FDA Milestone'
  | 'Financing'
  | 'Conference'

// ── Core Entities ─────────────────────────────────────────────

export interface Company {
  id: string
  slug: string
  name: string
  ticker: string
  exchange: Exchange
  sector: Sector
  marketCapCategory: MarketCap
  marketCapValue: number // in millions USD
  stockPrice: number
  stockPriceChange: number // percentage
  description: string
  oneLiner: string
  website: string
  founded: number
  employees: number
  hq: string
  logoPlaceholder: string // tailwind color class for placeholder avatar
  lastUpdated: string
}

export interface CompanyKPIs {
  companyId: string
  revenueGrowthYoY: number // percentage
  revenueGrowthQoQ: number // percentage
  revenue: number // TTM, in millions USD
  grossMargin: number // percentage
  burnRate: number // monthly, in millions USD
  cashRunway: number // months
  cashOnHand: number // millions USD
  insiderOwnership: number // percentage
  institutionalOwnership: number // percentage
  shortInterest: number // percentage of float
  dilutionRisk: 'Low' | 'Medium' | 'High'
  sharesOutstanding: number // millions
  recentDilution: boolean
}

export interface AsymmetricScore {
  companyId: string
  totalScore: number // out of 100
  marketOpportunity: number // out of 10
  technologyMoat: number // out of 10
  revenueTraction: number // out of 10
  insiderAlignment: number // out of 10
  cashRunway: number // out of 10
  dilutionRisk: number // out of 10 (higher = less dilution risk)
  competitivePosition: number // out of 10
  catalystStrength: number // out of 10
  retailAwareness: number // out of 10
  valuationUpside: number // out of 10
  lastCalculated: string
}

export interface InvestmentThesis {
  companyId: string
  bullets: string[]
  bullCase: string
  baseCase: string
  bearCase: string
  thesisBreakers: string[]
  moatAssessment: string
  competitors: string[]
}

export interface Catalyst {
  id: string
  companyId: string
  companyName: string
  companyTicker: string
  title: string
  description: string
  date: string | null // null = estimated / TBD
  estimatedPeriod: string | null // e.g. "Q3 2025"
  type: CatalystType
  impactLevel: ImpactLevel
  confidenceLevel: number // 0–100
  isUpcoming: boolean
}

export interface Watchlist {
  id: string
  name: string
  theme: Sector | 'Hidden Gems'
  description: string
  companyIds: string[]
  averageScore: number
  riskLevel: RiskLevel
  topCatalyst: string
}

export interface AISummary {
  companyId: string
  generatedAt: string
  bullCase: string
  bearCase: string
  keyCatalysts: string[]
  mainRisks: string[]
  thesisBreakers: string[]
  valuationScenario: {
    bull: string
    base: string
    bear: string
  }
  summary: string
  isPlaceholder: boolean
}

export interface User {
  id: string
  email: string
  fullName: string
  createdAt: string
  subscriptionStatus: 'active' | 'inactive' | 'trial' | 'cancelled'
  subscriptionPlan: 'free' | 'pro'
  stripeCustomerId?: string
}

// ── Composite / Utility Types ─────────────────────────────────

export interface CompanyWithScore extends Company {
  kpis: CompanyKPIs
  score: AsymmetricScore
}

export interface CompanyFull extends Company {
  kpis: CompanyKPIs
  score: AsymmetricScore
  thesis: InvestmentThesis
  catalysts: Catalyst[]
  aiSummary: AISummary
}

export type SortField =
  | 'score'
  | 'marketCapValue'
  | 'stockPrice'
  | 'stockPriceChange'
  | 'revenueGrowthYoY'
  | 'grossMargin'
  | 'cashRunway'

export type SortDirection = 'asc' | 'desc'

export interface FilterState {
  sectors: Sector[]
  exchanges: Exchange[]
  marketCaps: MarketCap[]
  minScore: number
  maxScore: number
  minMarketCap: number
  maxMarketCap: number
  searchQuery: string
}
