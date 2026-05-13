import type { Watchlist } from '@/types'

// ============================================================
// CONVEX — Mock Watchlists (8 themed watchlists)
// ============================================================

export const watchlists: Watchlist[] = [

  // ── 1. AI Infrastructure ───────────────────────────────────
  {
    id: 'wl-ai-infrastructure',
    name: 'AI Infrastructure',
    theme: 'AI Infrastructure',
    description:
      'The physical and silicon layer enabling the AI revolution. These companies build the chips, power delivery systems, and specialized compute architectures that hyperscalers and frontier AI labs depend on. High-conviction picks for the multi-decade AI infrastructure buildout — focused on components where pricing power and IP moats are strongest.',
    companyIds: ['cbrs', 'vicr'],
    averageScore: 81,
    riskLevel: 'High',
    topCatalyst: 'Cerebras CS-4 announcement & Vicor hyperscaler revenue ramp (Q2–Q4 2026)',
  },

  // ── 2. Space Economy ───────────────────────────────────────
  {
    id: 'wl-space-economy',
    name: 'Space Economy',
    theme: 'Space Economy',
    description:
      'Commercial space is transitioning from government-dominated to private-sector led. These companies are building the launch vehicles, lunar landers, and space infrastructure that will define the next 30 years of economic activity off-planet. High-risk, high-reward — mission success or failure is binary and market-moving.',
    companyIds: ['rklb', 'lunr'],
    averageScore: 76,
    riskLevel: 'Very High',
    topCatalyst: 'IM-3 lunar mission launch & Rocket Lab Neutron engine hotfire (Q3 2026)',
  },

  // ── 3. Quantum Computing ────────────────────────────────────
  {
    id: 'wl-quantum-computing',
    name: 'Quantum Computing',
    theme: 'Quantum Computing',
    description:
      'The race to fault-tolerant quantum computing is the most consequential technology competition of the decade. IonQ is the pure-play leader with the best-in-class trapped-ion hardware. Arqit provides the software hedge — post-quantum cryptography that becomes essential whether or not quantum computers arrive on schedule.',
    companyIds: ['ionq', 'arqq'],
    averageScore: 66,
    riskLevel: 'Very High',
    topCatalyst: 'IonQ #AQ 100 milestone & ARQQ UK NCSC certification (Q3–Q4 2026)',
  },

  // ── 4. Energy Transition ────────────────────────────────────
  {
    id: 'wl-energy-transition',
    name: 'Energy Transition',
    theme: 'Energy Transition',
    description:
      'The energy transition is the largest capital reallocation in human history. These picks span battery technology, grid-scale storage, and off-grid renewable charging — each at a different risk-return point. QuantumScape is the moonshot, GridFlex is the revenue-stage grower, and Beam Global is the contrarian microcap with a military catalyst.',
    companyIds: ['qs', 'grfx', 'beem'],
    averageScore: 57,
    riskLevel: 'High',
    topCatalyst: 'QuantumScape VW B-sample qualification & GridFlex utility framework contract (Q4 2026)',
  },

  // ── 5. Photonics ───────────────────────────────────────────
  {
    id: 'wl-photonics',
    name: 'Photonics',
    theme: 'Photonics',
    description:
      'Light-based computing and communication is the next frontier in AI infrastructure and quantum communications. Lumentum is the established leader in optical networking components; NovaStar is the high-growth silicon photonics disruptor. Together they offer exposure to the photonics supercycle at different risk profiles.',
    companyIds: ['lite', 'nvph'],
    averageScore: 72,
    riskLevel: 'Medium',
    topCatalyst: 'NovaStar hyperscaler design win disclosure & Lumentum Apple supply confirmation (Q3 2026)',
  },

  // ── 6. Robotics ────────────────────────────────────────────
  {
    id: 'wl-robotics',
    name: 'Robotics',
    theme: 'Robotics',
    description:
      'Autonomous physical systems are moving from industrial floors to public sidewalks and warehouses at scale. Serve Robotics is the most asymmetric pure-play in sidewalk delivery robotics — Nvidia-backed, Uber-integrated, and operating in the most lucrative last-mile logistics market. Watch fleet deployment speed and unit economics closely.',
    companyIds: ['serv'],
    averageScore: 72,
    riskLevel: 'High',
    topCatalyst: 'Fleet expansion to 2,000 robots & new city regulatory approval (Q3–Q4 2026)',
  },

  // ── 7. Defense Tech ────────────────────────────────────────
  {
    id: 'wl-defense-tech',
    name: 'Defense Tech',
    theme: 'Defense Tech',
    description:
      'Geopolitical fragmentation is driving the largest increase in defense spending since the Cold War. These defense pure-plays are positioned at the intersection of drone warfare, precision strike systems, and the emerging era of attritable autonomous combat systems. Lower volatility than space/quantum, but with significant upside from major contract events.',
    companyIds: ['ktos', 'avav'],
    averageScore: 78,
    riskLevel: 'Medium',
    topCatalyst: 'Kratos CCA contract award & AVAV NATO Switchblade standardization (Q4 2026)',
  },

  // ── 8. Hidden Gems ─────────────────────────────────────────
  {
    id: 'wl-hidden-gems',
    name: 'Hidden Gems',
    theme: 'Hidden Gems',
    description:
      'Under-the-radar positions with high asymmetry and low retail awareness. These companies have either very low trading volume, minimal analyst coverage, or an unconventional thesis that makes them easy to overlook. Highest potential upside, requires tolerance for illiquidity and information scarcity. Only for the conviction-strong investor.',
    companyIds: ['vicr', 'nvph', 'grfx', 'beem'],
    averageScore: 67,
    riskLevel: 'Very High',
    topCatalyst: 'Vicor AI rack revenue ramp, NovaStar design win, GridFlex utility contract (H2 2026)',
  },
]

// ── Utility Helpers ───────────────────────────────────────────

export function getWatchlistById(id: string): Watchlist | undefined {
  return watchlists.find((w) => w.id === id)
}

export function getWatchlistsByCompany(companyId: string): Watchlist[] {
  return watchlists.filter((w) => w.companyIds.includes(companyId))
}

export function getWatchlistByTheme(theme: string): Watchlist | undefined {
  return watchlists.find((w) => w.theme === theme)
}
