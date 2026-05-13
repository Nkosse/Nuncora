import type {
  Company,
  CompanyKPIs,
  AsymmetricScore,
  InvestmentThesis,
} from '@/types'

// ============================================================
// CONVEX — Mock Company Data (15 Companies)
// Last updated: May 2026
// ============================================================

// ── 1. Rocket Lab USA (RKLB) ─────────────────────────────────

export const rklbCompany: Company = {
  id: 'rklb',
  slug: 'rocket-lab',
  name: 'Rocket Lab USA',
  ticker: 'RKLB',
  exchange: 'NASDAQ',
  sector: 'Space Economy',
  marketCapCategory: 'Small',
  marketCapValue: 1_840,
  stockPrice: 8.42,
  stockPriceChange: 3.7,
  description:
    'Rocket Lab is an end-to-end space company delivering reliable launch services, spacecraft, satellite components, and on-orbit management. Operating the Electron launch vehicle and developing the medium-lift Neutron rocket, RKLB serves commercial and government customers globally.',
  oneLiner: 'The vertically-integrated launch & spacecraft platform for the new space economy.',
  website: 'https://www.rocketlabusa.com',
  founded: 2006,
  employees: 1_900,
  hq: 'Long Beach, CA',
  logoPlaceholder: 'bg-rose-600',
  lastUpdated: '2026-05-10',
}

export const rklbKPIs: CompanyKPIs = {
  companyId: 'rklb',
  revenueGrowthYoY: 71.2,
  revenueGrowthQoQ: 14.8,
  revenue: 436.5,
  grossMargin: 28.4,
  burnRate: 22.3,
  cashRunway: 28,
  cashOnHand: 624.4,
  insiderOwnership: 18.7,
  institutionalOwnership: 54.3,
  shortInterest: 8.9,
  dilutionRisk: 'Low',
  sharesOutstanding: 218.5,
  recentDilution: false,
}

export const rklbScore: AsymmetricScore = {
  companyId: 'rklb',
  totalScore: 84,
  marketOpportunity: 10,
  technologyMoat: 9,
  revenueTraction: 8,
  insiderAlignment: 8,
  cashRunway: 8,
  dilutionRisk: 9,
  competitivePosition: 8,
  catalystStrength: 9,
  retailAwareness: 8,
  valuationUpside: 7,
  lastCalculated: '2026-05-10',
}

export const rklbThesis: InvestmentThesis = {
  companyId: 'rklb',
  bullets: [
    'Only vertically-integrated small-sat launch company with proven commercial cadence (2–3 launches/month)',
    'Space Systems segment (spacecraft, components) growing >100% YoY and moving toward positive EBITDA',
    'Neutron medium-lift rocket positions RKLB to capture >$10B of DoD and commercial MEO/GEO market',
    'Backlog exceeds $1.1B with government contracts providing revenue visibility',
    'CEO Peter Beck owns ~10% — exceptional founder-operator alignment',
  ],
  bullCase:
    'Neutron achieves first flight in 2027, Electron cadence hits 20 launches/year, Space Systems becomes the dominant smallsat prime contractor. Path to $2B+ revenue by 2028 with 40%+ gross margins as launch economics scale. $25–35 stock price.',
  baseCase:
    'Electron continues 15 launches/year, Space Systems grows to $500M revenue, Neutron delayed to 2028. Revenue reaches $750M by 2027 with improving margins. Stock re-rates to $12–18 as profitability path becomes clear.',
  bearCase:
    'Neutron faces 2-year delay, SpaceX Falcon 9 captures medium-lift contracts, Space Systems competition intensifies. Revenue stalls at $500M, cash burn forces a dilutive raise. Stock retraces to $4–6.',
  thesisBreakers: [
    'Neutron program cancelled or indefinitely delayed',
    'Loss of NASA or DoD flagship contracts',
    'Competing launch providers undercut Electron pricing below cost-recovery',
    'Peter Beck resignation or departure',
  ],
  moatAssessment:
    'Deep moat. End-to-end vertical integration (launch + spacecraft + components) is extraordinarily difficult to replicate. Electron production line has 5+ year head start over any credible competitor. Photon spacecraft and components business creates sticky recurring revenue independent of launch market dynamics.',
  competitors: ['SpaceX', 'Relativity Space', 'ABL Space Systems', 'Firefly Aerospace', 'Exolaunch'],
}

// ── 2. IonQ (IONQ) ───────────────────────────────────────────

export const ionqCompany: Company = {
  id: 'ionq',
  slug: 'ionq',
  name: 'IonQ',
  ticker: 'IONQ',
  exchange: 'NYSE',
  sector: 'Quantum Computing',
  marketCapCategory: 'Small',
  marketCapValue: 2_120,
  stockPrice: 12.18,
  stockPriceChange: -1.4,
  description:
    'IonQ is a pure-play quantum computing company that designs and manufactures trapped-ion quantum computers. The company offers cloud-accessible quantum systems via AWS, Azure, and Google Cloud, while building toward fault-tolerant quantum computation.',
  oneLiner: 'The leading trapped-ion quantum computing company racing toward fault-tolerant supremacy.',
  website: 'https://ionq.com',
  founded: 2015,
  employees: 410,
  hq: 'College Park, MD',
  logoPlaceholder: 'bg-violet-600',
  lastUpdated: '2026-05-10',
}

export const ionqKPIs: CompanyKPIs = {
  companyId: 'ionq',
  revenueGrowthYoY: 94.3,
  revenueGrowthQoQ: 18.2,
  revenue: 58.7,
  grossMargin: 54.2,
  burnRate: 34.1,
  cashRunway: 18,
  cashOnHand: 614.0,
  insiderOwnership: 12.4,
  institutionalOwnership: 48.7,
  shortInterest: 14.2,
  dilutionRisk: 'Medium',
  sharesOutstanding: 174.1,
  recentDilution: false,
}

export const ionqScore: AsymmetricScore = {
  companyId: 'ionq',
  totalScore: 76,
  marketOpportunity: 10,
  technologyMoat: 9,
  revenueTraction: 6,
  insiderAlignment: 6,
  cashRunway: 7,
  dilutionRisk: 6,
  competitivePosition: 8,
  catalystStrength: 8,
  retailAwareness: 9,
  valuationUpside: 7,
  lastCalculated: '2026-05-10',
}

export const ionqThesis: InvestmentThesis = {
  companyId: 'ionq',
  bullets: [
    'Trapped-ion architecture delivers best-in-class gate fidelity (#AQ metric leads IBM and Google on commercial benchmarks)',
    'Revenue almost doubling YoY with enterprise and government customers expanding commitments',
    'DoD/NSA quantum contracts provide non-commercial revenue baseline and credibility',
    'Modular "IonQ Forte" systems enable datacenter-scale quantum deployment by 2027',
    'Only quantum company with systems on all three hyperscaler clouds simultaneously',
  ],
  bullCase:
    'IonQ achieves 1000 #AQ by 2027 — first credible fault-tolerant advantage in a commercial application (drug discovery/logistics optimization). Revenue scales to $300M+ as enterprise quantum SaaS takes hold. Stock reaches $35–50.',
  baseCase:
    'Revenue grows to $150M by 2027, IonQ maintains technology leadership, government contracts expand. Market begins pricing in quantum utility timelines. Stock reaches $18–25.',
  bearCase:
    'IBM or Google achieves fault tolerance first with superconducting qubits, making trapped-ion commercially irrelevant. IonQ burns cash without reaching profitability, forces dilutive financing. Stock falls to $4–7.',
  thesisBreakers: [
    'Competing qubit modalities (superconducting, photonic) achieve commercial fault tolerance first',
    'Government contract losses to Quantinuum or IBM',
    'Failure to demonstrate #AQ roadmap milestones on schedule',
    'Cash runway falls below 12 months without new financing',
  ],
  moatAssessment:
    'Strong moat in trapped-ion physics. Decades of academic IP from University of Maryland. Optical networking between ion traps (barium-based architecture) is a unique technical advantage for modular scaling. However, moat is narrower than appears — superconducting and photonic quantum computing are well-funded alternatives.',
  competitors: ['IBM Quantum', 'Google Quantum AI', 'Quantinuum (Honeywell)', 'Rigetti Computing', 'PsiQuantum'],
}

// ── 3. Intuitive Machines (LUNR) ─────────────────────────────

export const lunrCompany: Company = {
  id: 'lunr',
  slug: 'intuitive-machines',
  name: 'Intuitive Machines',
  ticker: 'LUNR',
  exchange: 'NASDAQ',
  sector: 'Space Economy',
  marketCapCategory: 'Micro',
  marketCapValue: 478,
  stockPrice: 3.24,
  stockPriceChange: -2.8,
  description:
    'Intuitive Machines is a space exploration company providing lunar access services, orbital infrastructure, and data communications. Operating the Nova-C lunar lander under NASA\'s CLPS program, LUNR is positioning itself as the logistics backbone of the emerging lunar economy.',
  oneLiner: 'NASA\'s primary commercial lunar delivery partner and the infrastructure layer for the Moon.',
  website: 'https://intuitivemachines.com',
  founded: 2013,
  employees: 270,
  hq: 'Houston, TX',
  logoPlaceholder: 'bg-slate-500',
  lastUpdated: '2026-05-10',
}

export const lunrKPIs: CompanyKPIs = {
  companyId: 'lunr',
  revenueGrowthYoY: 108.4,
  revenueGrowthQoQ: 22.1,
  revenue: 146.2,
  grossMargin: 18.6,
  burnRate: 14.8,
  cashRunway: 16,
  cashOnHand: 236.8,
  insiderOwnership: 24.1,
  institutionalOwnership: 38.2,
  shortInterest: 18.7,
  dilutionRisk: 'High',
  sharesOutstanding: 147.5,
  recentDilution: true,
}

export const lunrScore: AsymmetricScore = {
  companyId: 'lunr',
  totalScore: 67,
  marketOpportunity: 10,
  technologyMoat: 7,
  revenueTraction: 7,
  insiderAlignment: 7,
  cashRunway: 5,
  dilutionRisk: 5,
  competitivePosition: 6,
  catalystStrength: 9,
  retailAwareness: 7,
  valuationUpside: 9,
  lastCalculated: '2026-05-10',
}

export const lunrThesis: InvestmentThesis = {
  companyId: 'lunr',
  bullets: [
    'Two successful lunar landings establish LUNR as the only proven commercial lunar logistics provider',
    'CLPS contract backlog exceeds $700M — NASA reliance creates durable revenue floor',
    'Near Space Network contract adds $4.82B potential over 10 years in lunar comms infrastructure',
    'Artemis program creates $100B+ commercial lunar market over the next decade',
    'Insider ownership of 24% creates strong founder alignment with minority shareholders',
  ],
  bullCase:
    'IM-3 and IM-4 missions succeed, Near Space Network revenue begins flowing at scale, LUNR wins additional NASA and DoD contracts. Revenue reaches $500M by 2028 with improving margins. Stock reaches $10–15.',
  baseCase:
    'Steady CLPS mission cadence, communications revenue ramps slowly, gross margins improve to 25%+ as fixed costs are absorbed. Revenue reaches $280M by 2027. Stock settles at $5–8.',
  bearCase:
    'IM-3 mission failure undermines NASA confidence, dilutive equity raise at distressed prices, competitors (Firefly, Astrobotic) win key contracts. Stock falls to $1–2.',
  thesisBreakers: [
    'Catastrophic mission failure (IM-3 or beyond)',
    'NASA CLPS program budget cuts or restructuring',
    'Runway falls below 10 months, forcing highly dilutive financing',
    'Loss of Near Space Network contract to Lockheed/Raytheon',
  ],
  moatAssessment:
    'Moderate but defensible moat. Two lunar landings (first US commercial lunar landing in 50 years) creates credibility that is hard to replicate quickly. Deep NASA integration and mission heritage is a significant competitive advantage. However, Firefly Aerospace and Astrobotic are credible threats with similar capabilities.',
  competitors: ['Firefly Aerospace', 'Astrobotic Technology', 'Masten Space Systems', 'ispace (Japan)'],
}

// ── 4. Joby Aviation (JOBY) ──────────────────────────────────

export const jobyCompany: Company = {
  id: 'joby',
  slug: 'joby-aviation',
  name: 'Joby Aviation',
  ticker: 'JOBY',
  exchange: 'NYSE',
  sector: 'Next-Gen Connectivity',
  marketCapCategory: 'Small',
  marketCapValue: 3_640,
  stockPrice: 5.71,
  stockPriceChange: 1.2,
  description:
    'Joby Aviation is developing a fully-electric vertical takeoff and landing (eVTOL) aircraft for commercial air taxi service. The company has logged over 1,000 test flights and is targeting FAA certification in 2026, with Dubai and New York City as launch markets.',
  oneLiner: 'The electric air taxi pioneer closest to FAA certification and commercial revenue.',
  website: 'https://www.jobyaviation.com',
  founded: 2009,
  employees: 2_200,
  hq: 'Santa Cruz, CA',
  logoPlaceholder: 'bg-sky-500',
  lastUpdated: '2026-05-10',
}

export const jobyKPIs: CompanyKPIs = {
  companyId: 'joby',
  revenueGrowthYoY: 0,
  revenueGrowthQoQ: 0,
  revenue: 0,
  grossMargin: 0,
  burnRate: 58.2,
  cashRunway: 24,
  cashOnHand: 1_396.8,
  insiderOwnership: 22.8,
  institutionalOwnership: 62.1,
  shortInterest: 6.4,
  dilutionRisk: 'Medium',
  sharesOutstanding: 637.5,
  recentDilution: false,
}

export const jobyScore: AsymmetricScore = {
  companyId: 'joby',
  totalScore: 71,
  marketOpportunity: 10,
  technologyMoat: 8,
  revenueTraction: 2,
  insiderAlignment: 8,
  cashRunway: 8,
  dilutionRisk: 7,
  competitivePosition: 8,
  catalystStrength: 10,
  retailAwareness: 7,
  valuationUpside: 9,
  lastCalculated: '2026-05-10',
}

export const jobyThesis: InvestmentThesis = {
  companyId: 'joby',
  bullets: [
    '1,000+ test flights completed — leading FAA certification path among all eVTOL competitors',
    'Toyota strategic partnership ($894M committed) and Delta Air Lines deal de-risk execution',
    'Uber Elevate acquisition gave JOBY the leading urban air mobility marketplace and demand data',
    '5-seat aircraft design offers 4x revenue per flight vs. competitors with 1-2 passenger capacity',
    'Dubai contract (2025 launch) provides first-mover international revenue while FAA certification completes',
  ],
  bullCase:
    'FAA Type Certificate granted Q4 2026, commercial US operations begin 2027, Dubai routes generating $50M+ revenue. Toyota begins scaling manufacturing at dedicated facility. Stock reaches $15–22 as revenue visibility increases.',
  baseCase:
    'FAA certification by mid-2027, initial commercial routes in 2027-2028, revenue ramp to $200M by 2028. Toyota partnership ensures manufacturing at scale. Stock reaches $9–13.',
  bearCase:
    'FAA certification delayed to 2029+, competing modes of transport undermine urban air taxi economics, cash burn forces dilutive financing at $3–4/share. Competitors Archer and Lilium (new entity) capture market share. Stock falls to $2–4.',
  thesisBreakers: [
    'FAA certification delayed beyond 2028',
    'Fatal aircraft incident during testing or early commercial operations',
    'Toyota cancels or reduces manufacturing commitment',
    'Urban air taxi economics prove unviable at scale (noise, range, price)',
  ],
  moatAssessment:
    'Deep moat in regulatory positioning — FAA certification is a multi-year, $500M+ undertaking that creates a durable first-mover advantage. Toyota partnership for manufacturing and $1.4B cash runway are additional defensible advantages. Aircraft design (5-seat, tiltrotor) is the most commercially optimized in the industry.',
  competitors: ['Archer Aviation', 'Wisk Aero (Boeing)', 'Lilium', 'Overair', 'Vertical Aerospace'],
}

// ── 5. Arqit Quantum (ARQQ) ──────────────────────────────────

export const arqqCompany: Company = {
  id: 'arqq',
  slug: 'arqit-quantum',
  name: 'Arqit Quantum',
  ticker: 'ARQQ',
  exchange: 'NASDAQ',
  sector: 'Quantum Computing',
  marketCapCategory: 'Micro',
  marketCapValue: 142,
  stockPrice: 4.87,
  stockPriceChange: -5.2,
  description:
    'Arqit Quantum provides quantum-safe encryption software through its QuantumCloud platform. Rather than building a quantum computer, Arqit has pivoted to delivering post-quantum cryptography as-a-service to governments, telcos, and enterprises facing quantum decryption threats.',
  oneLiner: 'Post-quantum encryption SaaS for governments and enterprises ahead of the Q-Day threat.',
  website: 'https://arqit.uk',
  founded: 2017,
  employees: 130,
  hq: 'London, UK',
  logoPlaceholder: 'bg-indigo-600',
  lastUpdated: '2026-05-10',
}

export const arqqKPIs: CompanyKPIs = {
  companyId: 'arqq',
  revenueGrowthYoY: 38.7,
  revenueGrowthQoQ: 8.4,
  revenue: 12.4,
  grossMargin: 71.3,
  burnRate: 5.8,
  cashRunway: 19,
  cashOnHand: 110.2,
  insiderOwnership: 31.4,
  institutionalOwnership: 22.8,
  shortInterest: 22.1,
  dilutionRisk: 'High',
  sharesOutstanding: 29.2,
  recentDilution: true,
}

export const arqqScore: AsymmetricScore = {
  companyId: 'arqq',
  totalScore: 55,
  marketOpportunity: 9,
  technologyMoat: 6,
  revenueTraction: 4,
  insiderAlignment: 7,
  cashRunway: 6,
  dilutionRisk: 4,
  competitivePosition: 5,
  catalystStrength: 6,
  retailAwareness: 5,
  valuationUpside: 8,
  lastCalculated: '2026-05-10',
}

export const arqqThesis: InvestmentThesis = {
  companyId: 'arqq',
  bullets: [
    'NIST post-quantum cryptography standards finalized in 2024 created urgent enterprise upgrade cycle',
    'Government contracts in UK, EU, and Southeast Asia validate QuantumCloud for critical infrastructure',
    'Software-only model (pivoted from satellite delivery) enables 70%+ gross margins at scale',
    'Q-Day timeline (cryptographically-relevant quantum computers by 2030–2033) creates existential urgency for buyers',
    'Arqit\'s symmetric key approach is agnostic to which post-quantum standard wins — broader compatibility than point solutions',
  ],
  bullCase:
    'US DoD and EU adopt QuantumCloud as preferred PQC solution, revenue scales to $80M by 2027 with 75%+ gross margins. A strategic acquisition by a defense prime at 8–12x revenue multiple. Stock reaches $18–28.',
  baseCase:
    'Steady government contract wins, revenue grows to $35M by 2027, margins expand. Company approaches cash flow breakeven by 2028. Stock reaches $8–12.',
  bearCase:
    'Large cybersecurity vendors (Palo Alto, CrowdStrike) bundle PQC modules, commoditizing Arqit\'s value proposition. Revenue stalls, dilutive financing at $2–3/share. Stock falls to $1.50–3.',
  thesisBreakers: [
    'Major cybersecurity platform bundles competitive PQC at no incremental cost',
    'NIST or government mandates a standard that Arqit\'s technology cannot easily support',
    'Revenue fails to reach $20M by end of 2026, signaling commercial traction failure',
    'Another dilutive equity raise below $4/share',
  ],
  moatAssessment:
    'Narrow moat. QuantumCloud\'s symmetric key distribution approach is technically sound but not easily differentiated from alternatives. Government relationships and security certifications (FIPS, CC EAL4+) provide a defensible niche. High short interest reflects genuine skepticism about commercial execution.',
  competitors: ['Post-Quantum (private)', 'PQShield', 'evolutionQ', 'IBM Quantum Safe', 'Thales (quantum-safe HSMs)'],
}

// ── 6. Serve Robotics (SERV) ─────────────────────────────────

export const servCompany: Company = {
  id: 'serv',
  slug: 'serve-robotics',
  name: 'Serve Robotics',
  ticker: 'SERV',
  exchange: 'NASDAQ',
  sector: 'Robotics',
  marketCapCategory: 'Micro',
  marketCapValue: 388,
  stockPrice: 6.14,
  stockPriceChange: 8.3,
  description:
    'Serve Robotics operates autonomous sidewalk delivery robots in Los Angeles and San Diego. A spin-off from Uber with Nvidia as a strategic investor, SERV is building Level 4 autonomous delivery infrastructure for last-mile food and retail logistics.',
  oneLiner: 'Nvidia-backed sidewalk robot delivery network scaling across US cities.',
  website: 'https://www.serverobotics.com',
  founded: 2017,
  employees: 115,
  hq: 'Los Angeles, CA',
  logoPlaceholder: 'bg-green-500',
  lastUpdated: '2026-05-10',
}

export const servKPIs: CompanyKPIs = {
  companyId: 'serv',
  revenueGrowthYoY: 187.4,
  revenueGrowthQoQ: 38.6,
  revenue: 4.8,
  grossMargin: 42.7,
  burnRate: 4.2,
  cashRunway: 22,
  cashOnHand: 92.4,
  insiderOwnership: 8.4,
  institutionalOwnership: 31.7,
  shortInterest: 16.8,
  dilutionRisk: 'Medium',
  sharesOutstanding: 63.2,
  recentDilution: false,
}

export const servScore: AsymmetricScore = {
  companyId: 'serv',
  totalScore: 72,
  marketOpportunity: 9,
  technologyMoat: 7,
  revenueTraction: 5,
  insiderAlignment: 6,
  cashRunway: 8,
  dilutionRisk: 7,
  competitivePosition: 7,
  catalystStrength: 8,
  retailAwareness: 8,
  valuationUpside: 9,
  lastCalculated: '2026-05-10',
}

export const servThesis: InvestmentThesis = {
  companyId: 'serv',
  bullets: [
    'Nvidia\'s $125M Series B investment (and DRIVE platform integration) is the most important AI robotics endorsement available',
    'Uber partnership channels Uber Eats demand directly into SERV\'s fleet — built-in customer acquisition with zero marketing spend',
    'Unit economics improving as fleet scales: delivery cost per order declining 40% QoQ in Q1 2026',
    'Level 4 autonomy in geo-fenced urban zones avoids the hardest regulatory hurdles facing full AV companies',
    'Fleet expansion to 2,000 robots (from 100) planned for 2026–2027 with Uber and Shake Shack commitments',
  ],
  bullCase:
    'Fleet scales to 10,000 robots across 20 cities by 2028. Nvidia hardware pipeline, Uber demand, and improving unit economics create a self-reinforcing flywheel. Revenue reaches $80M+ by 2028. Stock reaches $22–35.',
  baseCase:
    'Fleet reaches 3,000 robots in 8 cities by 2027, revenue grows to $25M, gross margins improve to 55%. Company reaches breakeven by 2029. Stock reaches $12–18.',
  bearCase:
    'Regulatory hurdles in new cities slow expansion, Uber de-emphasizes sidewalk robots in favor of aerial delivery. Battery and maintenance costs remain higher than projected, making unit economics marginal. Stock falls to $3–5.',
  thesisBreakers: [
    'Nvidia reduces or exits strategic relationship',
    'City-level regulation bans or severely restricts sidewalk robots',
    'Uber launches competing in-house delivery robot program',
    'Major safety incident (pedestrian injury) triggers regulatory freeze',
  ],
  moatAssessment:
    'Growing moat driven by Nvidia\'s proprietary hardware + software stack and Uber\'s exclusive demand channel. However, Starship Technologies (backed by SoftBank) and Amazon Scout are well-funded competitors. Moat strengthens with each additional city deployment (operational data creates better AI models).',
  competitors: ['Starship Technologies', 'Amazon Scout', 'Kiwibot', 'Coco (private)'],
}

// ── 7. Kratos Defense (KTOS) ─────────────────────────────────

export const ktosCompany: Company = {
  id: 'ktos',
  slug: 'kratos-defense',
  name: 'Kratos Defense & Security Solutions',
  ticker: 'KTOS',
  exchange: 'NASDAQ',
  sector: 'Defense Tech',
  marketCapCategory: 'Small',
  marketCapValue: 3_120,
  stockPrice: 27.34,
  stockPriceChange: 0.6,
  description:
    'Kratos Defense is a mid-tier defense contractor specializing in unmanned systems, turbine engines, hypersonic test vehicles, satellite communications, microwave electronics, and cyber warfare. Known for the XQ-58A Valkyrie loyal wingman drone developed with USAF.',
  oneLiner: 'The defense pure-play building the drone fleets and hypersonic systems of next-generation warfare.',
  website: 'https://www.kratosdefense.com',
  founded: 1994,
  employees: 7_500,
  hq: 'San Diego, CA',
  logoPlaceholder: 'bg-amber-700',
  lastUpdated: '2026-05-10',
}

export const ktosKPIs: CompanyKPIs = {
  companyId: 'ktos',
  revenueGrowthYoY: 22.8,
  revenueGrowthQoQ: 5.4,
  revenue: 1_048.6,
  grossMargin: 24.7,
  burnRate: 0,
  cashRunway: 99,
  cashOnHand: 312.4,
  insiderOwnership: 4.2,
  institutionalOwnership: 88.6,
  shortInterest: 4.7,
  dilutionRisk: 'Low',
  sharesOutstanding: 114.1,
  recentDilution: false,
}

export const ktosScore: AsymmetricScore = {
  companyId: 'ktos',
  totalScore: 78,
  marketOpportunity: 10,
  technologyMoat: 8,
  revenueTraction: 8,
  insiderAlignment: 5,
  cashRunway: 10,
  dilutionRisk: 9,
  competitivePosition: 8,
  catalystStrength: 7,
  retailAwareness: 7,
  valuationUpside: 6,
  lastCalculated: '2026-05-10',
}

export const ktosThesis: InvestmentThesis = {
  companyId: 'ktos',
  bullets: [
    'XQ-58A Valkyrie collaborative combat aircraft program with USAF is a multi-billion dollar franchise in development',
    'Kratos turbine engines power >80% of US hypersonic test programs — near-monopoly in this sub-sector',
    'Ukraine war drove drone/attritable systems spending acceleration across NATO — KTOS is a primary beneficiary',
    'Unmanned systems segment growing 35%+ YoY with improving contract sizes and multi-year commitments',
    'Priced at only 2.8x forward revenue vs. defense prime peers at 4–5x, despite faster growth profile',
  ],
  bullCase:
    'XQ-58A enters production at 100+ units/year, hypersonic engine contracts accelerate, drone export licenses approved for allied nations. Revenue reaches $2B by 2028 with 30%+ gross margins. Stock reaches $45–60.',
  baseCase:
    'Steady DoD drone/unmanned systems contract wins, revenue grows to $1.4B by 2027, margins improve modestly. Stock re-rates to $35–40 as consensus views KTOS as a top-tier defense growth company.',
  bearCase:
    'DoD procurement delays, defense budget sequestration, or a shift away from attritable/expendable systems undercuts growth. Revenue growth slows to 8–10%, stock de-rates to $18–22.',
  thesisBreakers: [
    'Congressional defense budget cuts targeting unmanned systems',
    'XQ-58A program cancelled or handed to Boeing/Lockheed',
    'Hypersonic test programs shift to competing propulsion vendors',
    'Loss of a flagship satellite communications contract',
  ],
  moatAssessment:
    'Strong moat in turbine engines (near-monopoly for US hypersonic testing), XQ-58A program heritage, and satellite communications infrastructure. KTOS benefits from classification barriers — the full competitive moat is partially invisible because key contracts are classified. Lower insider ownership is offset by near-monopoly positions in critical defense sub-sectors.',
  competitors: ['Northrop Grumman (HALE drones)', 'General Atomics (Predator)', 'Shield AI', 'L3Harris Technologies'],
}

// ── 8. Vicor Corporation (VICR) ──────────────────────────────

export const vicrCompany: Company = {
  id: 'vicr',
  slug: 'vicor',
  name: 'Vicor Corporation',
  ticker: 'VICR',
  exchange: 'NASDAQ',
  sector: 'AI Infrastructure',
  marketCapCategory: 'Small',
  marketCapValue: 1_580,
  stockPrice: 34.62,
  stockPriceChange: 2.1,
  description:
    'Vicor designs and manufactures advanced power components and systems for high-performance computing, AI datacenters, electric vehicles, and defense electronics. Its Factorized Power Architecture delivers industry-leading power density and efficiency for next-gen AI accelerator clusters.',
  oneLiner: 'The power delivery innovator enabling the next generation of AI datacenter density.',
  website: 'https://www.vicr.com',
  founded: 1981,
  employees: 1_040,
  hq: 'Andover, MA',
  logoPlaceholder: 'bg-blue-700',
  lastUpdated: '2026-05-10',
}

export const vicrKPIs: CompanyKPIs = {
  companyId: 'vicr',
  revenueGrowthYoY: 31.4,
  revenueGrowthQoQ: 7.2,
  revenue: 418.7,
  grossMargin: 49.3,
  burnRate: 0,
  cashRunway: 99,
  cashOnHand: 184.2,
  insiderOwnership: 62.4,
  institutionalOwnership: 28.7,
  shortInterest: 3.1,
  dilutionRisk: 'Low',
  sharesOutstanding: 45.6,
  recentDilution: false,
}

export const vicrScore: AsymmetricScore = {
  companyId: 'vicr',
  totalScore: 80,
  marketOpportunity: 9,
  technologyMoat: 9,
  revenueTraction: 7,
  insiderAlignment: 10,
  cashRunway: 10,
  dilutionRisk: 10,
  competitivePosition: 8,
  catalystStrength: 6,
  retailAwareness: 5,
  valuationUpside: 6,
  lastCalculated: '2026-05-10',
}

export const vicrThesis: InvestmentThesis = {
  companyId: 'vicr',
  bullets: [
    'Patrizio Vinciarelli (founder/CEO) owns 62% — exceptional founder-operator alignment with near-zero dilution risk',
    'Factorized Power Architecture (FPA) is 5–10 years ahead of competitors in power density for AI GPU clusters',
    'Hyperscaler design wins (Microsoft, Meta, Nvidia NVLink rack-scale clusters) create multi-year revenue ramp',
    'Each AI server rack with Vicor MCMs generates $800–$2,000 in Vicor content vs. $100–$200 with traditional VRMs',
    'Gross margins of 49%+ reflect true IP moat — competitors cannot match efficiency without 5+ year R&D investment',
  ],
  bullCase:
    'AI capex supercycle drives Vicor content per rack to $2,000+, hyperscalers adopt FPA architecture as standard for 1000W+ GPU clusters. Revenue reaches $900M by 2028, margins expand to 55%. Stock reaches $75–100.',
  baseCase:
    'Steady share gains in AI datacenter and EV markets, revenue grows to $600M by 2027 with 50%+ margins. Design wins at major hyperscalers begin revenue contribution. Stock reaches $50–65.',
  bearCase:
    'Hyperscalers develop in-house power delivery solutions (similar to Google TPU strategy), reducing Vicor content. EV market softness undercuts automotive segment. Revenue stalls at $450M. Stock de-rates to $22–28.',
  thesisBreakers: [
    'Nvidia or hyperscaler develops competing power architecture in-house',
    'Patrizio Vinciarelli health or leadership transition without clear succession',
    'Key design win lost to Infineon, Renesas, or Monolithic Power Systems',
    'AI capex cycle turns down sharply (macro-driven)',
  ],
  moatAssessment:
    'Very deep moat. FPA (Factorized Power Architecture) is a proprietary, patent-protected ecosystem with 30+ years of continuous IP development. The physics of power density make it extremely difficult for competitors to match VICR\'s efficiency without starting from scratch. Founder ownership of 62% virtually eliminates dilution risk — this is one of the cleanest capital structures in small-cap tech.',
  competitors: ['Monolithic Power Systems (MPWR)', 'Infineon Technologies', 'Renesas Electronics', 'Texas Instruments'],
}

// ── 9. Lumentum (LITE) ───────────────────────────────────────

export const liteCompany: Company = {
  id: 'lite',
  slug: 'lumentum',
  name: 'Lumentum Holdings',
  ticker: 'LITE',
  exchange: 'NASDAQ',
  sector: 'Photonics',
  marketCapCategory: 'Small',
  marketCapValue: 1_720,
  stockPrice: 24.18,
  stockPriceChange: -0.8,
  description:
    'Lumentum designs and manufactures photonic products for optical networking, 3D sensing, and industrial laser applications. A key supplier of high-power VCSELs for iPhone Face ID, Lumentum is now pivoting to AI datacenter coherent optical transceivers and solid-state lidar.',
  oneLiner: 'The photonics backbone of AI datacenters, 3D sensing, and next-gen optical networks.',
  website: 'https://www.lumentum.com',
  founded: 2015,
  employees: 3_600,
  hq: 'San Jose, CA',
  logoPlaceholder: 'bg-teal-600',
  lastUpdated: '2026-05-10',
}

export const liteKPIs: CompanyKPIs = {
  companyId: 'lite',
  revenueGrowthYoY: 18.6,
  revenueGrowthQoQ: 4.8,
  revenue: 1_287.4,
  grossMargin: 37.8,
  burnRate: 0,
  cashRunway: 99,
  cashOnHand: 844.6,
  insiderOwnership: 3.7,
  institutionalOwnership: 84.2,
  shortInterest: 7.2,
  dilutionRisk: 'Low',
  sharesOutstanding: 71.2,
  recentDilution: false,
}

export const liteScore: AsymmetricScore = {
  companyId: 'lite',
  totalScore: 69,
  marketOpportunity: 9,
  technologyMoat: 8,
  revenueTraction: 7,
  insiderAlignment: 4,
  cashRunway: 10,
  dilutionRisk: 9,
  competitivePosition: 7,
  catalystStrength: 6,
  retailAwareness: 4,
  valuationUpside: 5,
  lastCalculated: '2026-05-10',
}

export const liteThesis: InvestmentThesis = {
  companyId: 'lite',
  bullets: [
    'EML (Electro-absorption Modulated Laser) products critical for 400G and 800G AI datacenter optical interconnects',
    'Apple VCSEL supply relationship (Face ID, LiDAR Scanner) provides $300M+ stable revenue floor',
    'Coherent optical transceiver market growing 45% annually as AI clusters require intra-datacenter connectivity',
    'Gross margins recovering from telecom downturn — AI datacenter mix shift driving 38%+ margins vs. 28% trough',
    'Trading at 1.3x forward revenue vs. peer Coherent Corp at 2.1x — significant valuation gap',
  ],
  bullCase:
    'AI datacenter optical demand accelerates beyond projections, Lumentum wins 800G/1.6T transceiver share at Nvidia and Microsoft. Revenue reaches $2B by 2028, margins expand to 45%. Stock reaches $42–55.',
  baseCase:
    'Steady recovery in telecom + AI datacenter growth driver, revenue reaches $1.6B by 2027, margins reach 40%. Valuation re-rates to $32–38.',
  bearCase:
    'Telecom spending remains depressed, Apple reduces VCSEL sourcing, AI datacenter optical competition intensifies. Revenue stalls at $1.3B, stock de-rates to $16–20.',
  thesisBreakers: [
    'Apple vertical integration of VCSEL production',
    'Coherent Corp or II-VI take dominant AI datacenter optical market share',
    'Telecom capex remains in multi-year downturn',
    'Regulatory rejection of any pending M&A deal',
  ],
  moatAssessment:
    'Moderate moat. High-power VCSEL manufacturing and EML technology are capital-intensive with meaningful learning curve advantages. Apple relationship creates supplier lock-in that typically persists 3–5 years. However, photonics is a competitive market with well-funded rivals (Coherent, II-VI, Infinera). Insider ownership is low, which is common for large institutional holdings.',
  competitors: ['Coherent Corp (COHR)', 'Sumitomo Electric', 'Acacia Communications', 'Inphi (now Marvell)'],
}

// ── 10. Beam Global (BEEM) ───────────────────────────────────

export const beemCompany: Company = {
  id: 'beem',
  slug: 'beam-global',
  name: 'Beam Global',
  ticker: 'BEEM',
  exchange: 'NASDAQ',
  sector: 'Energy Transition',
  marketCapCategory: 'Micro',
  marketCapValue: 52,
  stockPrice: 2.14,
  stockPriceChange: -3.7,
  description:
    'Beam Global manufactures solar-powered EV charging infrastructure, energy storage products, and emergency power systems. Its EV ARC product line provides off-grid EV charging requiring no electrical infrastructure — deployed by militaries, municipalities, and parking operators globally.',
  oneLiner: 'Off-grid solar EV charging for government and military — infrastructure-free, deployable anywhere.',
  website: 'https://beamforall.com',
  founded: 2006,
  employees: 148,
  hq: 'San Diego, CA',
  logoPlaceholder: 'bg-yellow-500',
  lastUpdated: '2026-05-10',
}

export const beemKPIs: CompanyKPIs = {
  companyId: 'beem',
  revenueGrowthYoY: 42.6,
  revenueGrowthQoQ: 8.1,
  revenue: 28.4,
  grossMargin: 22.8,
  burnRate: 2.8,
  cashRunway: 14,
  cashOnHand: 39.2,
  insiderOwnership: 14.6,
  institutionalOwnership: 24.3,
  shortInterest: 28.4,
  dilutionRisk: 'High',
  sharesOutstanding: 24.3,
  recentDilution: true,
}

export const beemScore: AsymmetricScore = {
  companyId: 'beem',
  totalScore: 48,
  marketOpportunity: 8,
  technologyMoat: 6,
  revenueTraction: 5,
  insiderAlignment: 5,
  cashRunway: 4,
  dilutionRisk: 3,
  competitivePosition: 5,
  catalystStrength: 6,
  retailAwareness: 4,
  valuationUpside: 8,
  lastCalculated: '2026-05-10',
}

export const beemThesis: InvestmentThesis = {
  companyId: 'beem',
  bullets: [
    'Military/government EV charging mandate creates captive demand — DoD is mandating EV adoption with no grid upgrade budget',
    'EV ARC products require zero electrical infrastructure — unique competitive position for remote, forward-deployed, or disaster-resilience applications',
    'European subsidiary (Amiga from Serbia) growing 80%+ and now 40% of total revenue',
    'Patented off-grid architecture is difficult to replicate quickly; competitors are grid-tied',
    'Sub-$60M market cap with $28M trailing revenue — extreme value if margins improve',
  ],
  bullCase:
    'DoD bulk contract for EV ARC units across US bases, European military contracts accelerate, margins improve to 35%+ with volume. Revenue reaches $70M by 2027. Stock reaches $6–10.',
  baseCase:
    'Steady government and municipal order flow, revenue grows to $45M, margins reach 28%. Cash flow breakeven by 2027. Stock reaches $3.50–5.50.',
  bearCase:
    'Dilutive equity raise at $1.50–2.00, DoD delays EV mandates, competition from larger solar charging vendors. Revenue stalls, stock falls to $0.80–1.50.',
  thesisBreakers: [
    'DoD EV mandate delayed or defunded',
    'Equity raise below $2/share triggering further dilution spiral',
    'Grid-tied competitors offer price-competitive alternatives with infrastructure subsidies',
    'European subsidiary revenue declines or is impaired',
  ],
  moatAssessment:
    'Narrow but genuine moat in off-grid solar EV charging for government/military. Patent portfolio on integrated solar-storage-EV-charging architecture is real. The moat is limited by the company\'s small scale and financial fragility — a well-capitalized competitor could develop comparable technology in 2–3 years. High short interest (28%) reflects justified concern about dilution risk.',
  competitors: ['Beam (Evergent)', 'Blink Charging (grid-tied)', 'ChargePoint (grid-tied)', 'Envision Solar'],
}

// ── 11. QuantumScape (QS) ────────────────────────────────────

export const qsCompany: Company = {
  id: 'qs',
  slug: 'quantumscape',
  name: 'QuantumScape Corporation',
  ticker: 'QS',
  exchange: 'NYSE',
  sector: 'Energy Transition',
  marketCapCategory: 'Small',
  marketCapValue: 1_240,
  stockPrice: 4.08,
  stockPriceChange: 1.8,
  description:
    'QuantumScape is developing solid-state lithium-metal batteries designed to replace liquid-electrolyte lithium-ion batteries in electric vehicles. Backed by Volkswagen Group with $300M invested, QS\'s separator technology aims to deliver higher energy density, faster charging, and improved safety.',
  oneLiner: 'Volkswagen-backed solid-state battery developer targeting EV range and charging revolution.',
  website: 'https://www.quantumscape.com',
  founded: 2010,
  employees: 740,
  hq: 'San Jose, CA',
  logoPlaceholder: 'bg-green-700',
  lastUpdated: '2026-05-10',
}

export const qsKPIs: CompanyKPIs = {
  companyId: 'qs',
  revenueGrowthYoY: 0,
  revenueGrowthQoQ: 0,
  revenue: 0,
  grossMargin: 0,
  burnRate: 68.4,
  cashRunway: 18,
  cashOnHand: 1_231.2,
  insiderOwnership: 18.6,
  institutionalOwnership: 44.2,
  shortInterest: 24.8,
  dilutionRisk: 'High',
  sharesOutstanding: 303.9,
  recentDilution: false,
}

export const qsScore: AsymmetricScore = {
  companyId: 'qs',
  totalScore: 58,
  marketOpportunity: 10,
  technologyMoat: 9,
  revenueTraction: 1,
  insiderAlignment: 6,
  cashRunway: 7,
  dilutionRisk: 5,
  competitivePosition: 6,
  catalystStrength: 8,
  retailAwareness: 7,
  valuationUpside: 9,
  lastCalculated: '2026-05-10',
}

export const qsThesis: InvestmentThesis = {
  companyId: 'qs',
  bullets: [
    'Volkswagen\'s $300M investment (and manufacturing partnership) provides financial backing and de-risked commercialization path',
    'Solid-state separator technology (not full cell) — less capital-intensive manufacturing path than competitors attempting full solid-state cell production',
    'Received first automotive qualification sample milestone — battery delivered to Volkswagen for testing',
    'Energy density of 1,000 Wh/L (vs. 700–750 for best Li-ion) and 15-minute fast charge capable = genuine step-change',
    'Total addressable market: $200B+ EV battery market by 2030 — even 5% share equals $10B+ revenue',
  ],
  bullCase:
    'Volkswagen qualifies QuantumScape cells for production by 2027, first vehicles ship 2029, licensing revenue from multiple OEMs begins 2028. Company valued at $15–20B (comparable to CATL minority stake multiple). Stock reaches $25–40.',
  baseCase:
    'Qualification timeline extends to 2028, Volkswagen partnership remains intact, additional OEM licensing deals signed. Company raises further capital at improved terms. Stock reaches $7–12.',
  bearCase:
    'Solid-state cell manufacturing yields remain too low for cost-competitive production, Volkswagen reduces partnership scope, high burn rate forces dilutive financing. CATL and Toyota\'s solid-state programs reach market first. Stock falls to $1.50–2.50.',
  thesisBreakers: [
    'Volkswagen exits or restructures the joint venture',
    'Manufacturing yield remains below 80% at pilot scale, making commercialization economics unviable',
    'Toyota or Samsung SDI solid-state batteries reach commercial production first',
    'Cash runway falls below 12 months without new financing',
  ],
  moatAssessment:
    'Potentially very deep moat if technology is validated — a proven, manufacturable solid-state separator would be defensible for 5–10 years given the IP portfolio and manufacturing know-how required. However, the moat is speculative until commercial-scale production is demonstrated. High short interest (25%) reflects legitimate concern about whether lab results translate to the factory floor.',
  competitors: ['Samsung SDI', 'Toyota (Panasonic JV)', 'Solid Power', 'CATL (solid-state R&D)', 'Factorial Energy'],
}

// ── 12. AeroVironment (AVAV) ─────────────────────────────────

export const avavCompany: Company = {
  id: 'avav',
  slug: 'aerovironment',
  name: 'AeroVironment',
  ticker: 'AVAV',
  exchange: 'NASDAQ',
  sector: 'Defense Tech',
  marketCapCategory: 'Small',
  marketCapValue: 2_840,
  stockPrice: 110.48,
  stockPriceChange: -1.6,
  description:
    'AeroVironment manufactures tactical unmanned aerial systems (UAS) and tactical missile systems for the US military and allied governments. Its Switchblade loitering munitions became globally recognized during the Ukraine war, while Puma and Raven UAS serve US Army reconnaissance missions.',
  oneLiner: 'The tactical drone and loitering munition leader powering modern battlefield dominance.',
  website: 'https://www.avinc.com',
  founded: 1971,
  employees: 3_200,
  hq: 'Arlington, VA',
  logoPlaceholder: 'bg-stone-600',
  lastUpdated: '2026-05-10',
}

export const avavKPIs: CompanyKPIs = {
  companyId: 'avav',
  revenueGrowthYoY: 28.4,
  revenueGrowthQoQ: 6.8,
  revenue: 712.8,
  grossMargin: 42.8,
  burnRate: 0,
  cashRunway: 99,
  cashOnHand: 248.6,
  insiderOwnership: 6.2,
  institutionalOwnership: 92.4,
  shortInterest: 5.8,
  dilutionRisk: 'Low',
  sharesOutstanding: 25.7,
  recentDilution: false,
}

export const avavScore: AsymmetricScore = {
  companyId: 'avav',
  totalScore: 77,
  marketOpportunity: 9,
  technologyMoat: 8,
  revenueTraction: 8,
  insiderAlignment: 5,
  cashRunway: 10,
  dilutionRisk: 9,
  competitivePosition: 9,
  catalystStrength: 7,
  retailAwareness: 6,
  valuationUpside: 6,
  lastCalculated: '2026-05-10',
}

export const avavThesis: InvestmentThesis = {
  companyId: 'avav',
  bullets: [
    'Switchblade 300 and 600 loitering munitions are the most combat-proven precision strike systems in modern warfare',
    'Ukraine conflict drove $500M+ in Switchblade demand and created a NATO-wide evaluation cycle for AV products',
    'JUMP 20 VTOL UAS and Puma 3 AE are embedded in US Army and Marine Corps mission doctrine — very high switching costs',
    'Revenue backlog exceeds $600M with funded government orders providing 12-month revenue visibility',
    'Gross margins of 42%+ reflect IP-intensive products with limited direct commodity competition',
  ],
  bullCase:
    'NATO allies adopt Switchblade as standard loitering munition, JUMP 20 wins additional Multi-Domain Operations contracts, allied export licenses approved. Revenue reaches $1.2B by 2027, margins expand. Stock reaches $160–200.',
  baseCase:
    'Steady US government contract wins, Switchblade international sales grow moderately, JUMP 20 program expands. Revenue reaches $950M by 2027. Stock reaches $130–150.',
  bearCase:
    'DoD procurement delays, sequestration risk, or shift toward cheaper commodity drones from emerging suppliers undercuts AVAV\'s premium positioning. Revenue growth slows to 10%, stock de-rates to $75–90.',
  thesisBreakers: [
    'Congress mandates commodity drone procurement, undermining AVAV\'s premium positioning',
    'Chinese or Turkish drone vendors accepted in allied procurement competitions',
    'Loss of US Army Switchblade indefinite-delivery contract',
    'Defense budget sequestration in FY2027',
  ],
  moatAssessment:
    'Strong moat. AVAV\'s products are deeply embedded in US military doctrine with decades of mission heritage. Switchblade\'s combat record in Ukraine creates an unmatched reference for allied procurement. 42%+ gross margins reflect genuine technological differentiation. Low insider ownership is typical for institutionally-held defense contractors with long government customer relationships.',
  competitors: ['Textron (Aerosonde)', 'Shield AI', 'Joby Defense', 'L3Harris (Trillium)', 'Northrop Grumman (WASP)'],
}

// ── 13. Cerebras Systems (CBRS — Fictional) ──────────────────

export const cbrsCompany: Company = {
  id: 'cbrs',
  slug: 'cerebras-systems',
  name: 'Cerebras Systems',
  ticker: 'CBRS',
  exchange: 'NASDAQ',
  sector: 'AI Infrastructure',
  marketCapCategory: 'Small',
  marketCapValue: 1_840,
  stockPrice: 14.72,
  stockPriceChange: 5.8,
  description:
    'Cerebras Systems designs and manufactures the Wafer-Scale Engine (WSE) — the world\'s largest computer chip — specifically optimized for large-scale AI model training and inference. With 4 trillion transistors and 900,000 AI cores on a single 46,000mm² die, the WSE-3 offers unparalleled memory bandwidth for generative AI workloads.',
  oneLiner: 'The wafer-scale AI chip company making Nvidia\'s cluster architecture obsolete for large models.',
  website: 'https://www.cerebras.net',
  founded: 2016,
  employees: 680,
  hq: 'Sunnyvale, CA',
  logoPlaceholder: 'bg-orange-600',
  lastUpdated: '2026-05-10',
}

export const cbrsKPIs: CompanyKPIs = {
  companyId: 'cbrs',
  revenueGrowthYoY: 142.8,
  revenueGrowthQoQ: 28.4,
  revenue: 186.4,
  grossMargin: 38.6,
  burnRate: 24.8,
  cashRunway: 26,
  cashOnHand: 644.8,
  insiderOwnership: 34.8,
  institutionalOwnership: 38.4,
  shortInterest: 11.2,
  dilutionRisk: 'Medium',
  sharesOutstanding: 124.9,
  recentDilution: false,
}

export const cbrsScore: AsymmetricScore = {
  companyId: 'cbrs',
  totalScore: 82,
  marketOpportunity: 10,
  technologyMoat: 10,
  revenueTraction: 8,
  insiderAlignment: 9,
  cashRunway: 8,
  dilutionRisk: 7,
  competitivePosition: 8,
  catalystStrength: 8,
  retailAwareness: 6,
  valuationUpside: 8,
  lastCalculated: '2026-05-10',
}

export const cbrsThesis: InvestmentThesis = {
  companyId: 'cbrs',
  bullets: [
    'Wafer-Scale Engine achieves 100x memory bandwidth advantage over Nvidia H100 clusters for large language model training',
    'CS-3 system trains GPT-4 class models in hours vs. weeks with A100 clusters — compelling TCO for hyperscalers',
    'G42 (UAE sovereign wealth) $1.4B partnership validates commercial demand and provides Middle East datacenter expansion',
    'Growing order backlog from national labs (Argonne, Los Alamos) and top AI research labs (Cerebras is the compute layer for several frontier models)',
    '35% founder/insider ownership ensures deep alignment with long-term capital allocation decisions',
  ],
  bullCase:
    'Microsoft or Amazon adopts Cerebras as alternative AI training silicon, breaking Nvidia\'s near-monopoly. Revenue scales to $800M by 2028 with improving gross margins as TSMC yields improve. Stock reaches $45–65.',
  baseCase:
    'Steady hyperscaler and government lab expansion, revenue reaches $400M by 2027. Inference market emerges as second growth driver. Stock reaches $25–35.',
  bearCase:
    'Nvidia Blackwell/Rubin maintains insurmountable ecosystem lock-in (CUDA), Cerebras limited to niche training workloads. Revenue growth decelerates, requiring additional capital raise. Stock falls to $8–12.',
  thesisBreakers: [
    'Nvidia\'s Rubin architecture closes the memory bandwidth gap through HBM4 adoption',
    'TSMC yield challenges make WSE-3 economics uncompetitive at scale',
    'G42 partnership collapses due to geopolitical/regulatory pressures',
    'Major hyperscaler (Meta, Google) develops competitive in-house AI chip and reduces procurement',
  ],
  moatAssessment:
    'Extremely deep technology moat. The physics of wafer-scale integration is something that only TSMC has the manufacturing capability to produce at this scale, and Cerebras has exclusive IP on the design. No competitor has attempted wafer-scale AI silicon — the R&D investment required would take 5–7 years to replicate. The primary risk is ecosystem, not technology.',
  competitors: ['Nvidia (H100/Blackwell)', 'Google TPU v5', 'Amazon Trainium2', 'AMD MI300X', 'Groq (inference only)'],
}

// ── 14. NovaStar Photonics (NVPH — Fictional) ────────────────

export const nvphCompany: Company = {
  id: 'nvph',
  slug: 'novastar-photonics',
  name: 'NovaStar Photonics',
  ticker: 'NVPH',
  exchange: 'NASDAQ',
  sector: 'Photonics',
  marketCapCategory: 'Micro',
  marketCapValue: 284,
  stockPrice: 7.34,
  stockPriceChange: 4.2,
  description:
    'NovaStar Photonics develops integrated photonic circuits (PICs) for AI datacenter optical interconnects, autonomous vehicle lidar, and quantum communication links. Its silicon photonics platform enables co-packaged optics at less than 1/3 the cost of discrete optical components, with volume production from TSMC\'s photonics-enhanced nodes.',
  oneLiner: 'Silicon photonics ICs enabling next-generation AI datacenter connectivity and quantum comms.',
  website: 'https://www.novastarphoto.com',
  founded: 2019,
  employees: 186,
  hq: 'Austin, TX',
  logoPlaceholder: 'bg-cyan-600',
  lastUpdated: '2026-05-10',
}

export const nvphKPIs: CompanyKPIs = {
  companyId: 'nvph',
  revenueGrowthYoY: 228.4,
  revenueGrowthQoQ: 42.6,
  revenue: 18.4,
  grossMargin: 58.4,
  burnRate: 6.8,
  cashRunway: 20,
  cashOnHand: 136.0,
  insiderOwnership: 28.6,
  institutionalOwnership: 22.4,
  shortInterest: 8.4,
  dilutionRisk: 'Medium',
  sharesOutstanding: 38.7,
  recentDilution: false,
}

export const nvphScore: AsymmetricScore = {
  companyId: 'nvph',
  totalScore: 75,
  marketOpportunity: 10,
  technologyMoat: 9,
  revenueTraction: 6,
  insiderAlignment: 8,
  cashRunway: 7,
  dilutionRisk: 7,
  competitivePosition: 7,
  catalystStrength: 8,
  retailAwareness: 4,
  valuationUpside: 9,
  lastCalculated: '2026-05-10',
}

export const nvphThesis: InvestmentThesis = {
  companyId: 'nvph',
  bullets: [
    'Co-packaged optics is the defining architecture shift for >800G AI datacenter interconnects — NovaStar is building the PIC silicon',
    'Production at TSMC photonics-enhanced nodes gives NVPH the same supply chain reliability as leading-edge CMOS',
    'Design wins at two top-5 AI datacenter operators (non-disclosed) represent >$50M in future revenue commitments',
    'Quantum communication link applications provide a diversified second market with government/defense pull',
    '58%+ gross margins at small revenue scale reflects the IP density of photonic integrated circuit design',
  ],
  bullCase:
    'Co-packaged optics becomes standard for Nvidia rack-scale AI clusters by 2028. NVPH wins foundry-qualified PIC supply position for two hyperscalers. Revenue reaches $150M by 2028, margins expand to 65%. Stock reaches $28–42.',
  baseCase:
    'Steady design win conversion, datacenter revenue grows to $60M by 2027, quantum comms adds $10M. Gross margins hold at 58%+. Stock reaches $14–20.',
  bearCase:
    'Intel or Broadcom captures co-packaged optics market with proprietary solutions. NVPH limited to niche quantum comms applications. Revenue stalls at $25M. Stock falls to $3–5.',
  thesisBreakers: [
    'Intel\'s integrated photonics (IFS) program wins the co-packaged optics standard battle',
    'Hyperscalers develop in-house PIC solutions (Google has photonics R&D)',
    'TSMC photonics capacity constrained, delaying NVPH volume production',
    'Key customer design win lost to Broadcom or Marvell',
  ],
  moatAssessment:
    'Strong and growing moat. Silicon photonics ICs require 3–5 years of design iteration to reach production yields. NVPH\'s TSMC relationship and platform IP create barriers that pure-hardware competitors cannot overcome quickly. The primary risk is that larger semiconductor companies (Intel, Broadcom) decide this market is worth entering with 10x the R&D budget.',
  competitors: ['Intel (Silicon Photonics)', 'Broadcom (PIC transceivers)', 'Ayar Labs', 'Lightmatter', 'Ranovus'],
}

// ── 15. GridFlex Energy (GRFX — Fictional) ───────────────────

export const grfxCompany: Company = {
  id: 'grfx',
  slug: 'gridflex-energy',
  name: 'GridFlex Energy',
  ticker: 'GRFX',
  exchange: 'NYSE American',
  sector: 'Energy Transition',
  marketCapCategory: 'Micro',
  marketCapValue: 178,
  stockPrice: 4.86,
  stockPriceChange: 2.4,
  description:
    'GridFlex Energy develops modular, containerized battery energy storage systems (BESS) with integrated AI-driven grid management software. Serving utility, C&I, and microgrid customers, GRFX\'s FlexStore platform enables grid operators to monetize stored energy across energy arbitrage, frequency regulation, and capacity markets simultaneously.',
  oneLiner: 'AI-managed modular BESS enabling utilities to monetize grid-scale energy storage across multiple revenue streams.',
  website: 'https://www.gridflexenergy.com',
  founded: 2020,
  employees: 212,
  hq: 'Denver, CO',
  logoPlaceholder: 'bg-lime-600',
  lastUpdated: '2026-05-10',
}

export const grfxKPIs: CompanyKPIs = {
  companyId: 'grfx',
  revenueGrowthYoY: 88.4,
  revenueGrowthQoQ: 18.2,
  revenue: 42.8,
  grossMargin: 32.4,
  burnRate: 5.4,
  cashRunway: 18,
  cashOnHand: 97.2,
  insiderOwnership: 22.4,
  institutionalOwnership: 34.8,
  shortInterest: 12.4,
  dilutionRisk: 'Medium',
  sharesOutstanding: 36.6,
  recentDilution: true,
}

export const grfxScore: AsymmetricScore = {
  companyId: 'grfx',
  totalScore: 66,
  marketOpportunity: 10,
  technologyMoat: 7,
  revenueTraction: 6,
  insiderAlignment: 7,
  cashRunway: 6,
  dilutionRisk: 6,
  competitivePosition: 6,
  catalystStrength: 7,
  retailAwareness: 3,
  valuationUpside: 8,
  lastCalculated: '2026-05-10',
}

export const grfxThesis: InvestmentThesis = {
  companyId: 'grfx',
  bullets: [
    'US utility BESS market growing 68% CAGR through 2030 driven by IRA tax credits and grid reliability mandates',
    'FlexStore AI optimization software generates 22–28% higher revenue per MWh vs. competitor systems — quantified customer ROI advantage',
    'Modular containerized design enables fast-deploy (6-week site deployment vs. 18-month utility-scale installation)',
    'Pipeline of 450 MWh under contract with 12 utility and C&I customers provides 18-month revenue visibility',
    'Software attach rate growing: 68% of new deployments include FlexStore SaaS (recurring revenue layer)',
  ],
  bullCase:
    'IRA BESS tax credits (30% ITC) drive utility procurement surge, GRFX wins regional utility framework contracts, FlexStore SaaS reaches 80% attach rate. Revenue reaches $180M by 2028 with 40%+ gross margins. Stock reaches $14–20.',
  baseCase:
    'Steady utility and C&I customer additions, 450 MWh pipeline converts, revenue grows to $90M by 2027. Software margin mix improves. Stock reaches $8–12.',
  bearCase:
    'CATL or BYD direct-to-utility pricing undercuts GRFX hardware margins, IRA tax credits reduced or phased out, grid-scale BESS project delays. Revenue stalls, dilutive financing at $3/share. Stock falls to $2–3.',
  thesisBreakers: [
    'IRA energy storage tax credits repealed or significantly reduced',
    'CATL or BYD vertically integrates into BESS system integration with aggressive pricing',
    'FlexStore software loses key utility customer to competitor (Stem, Fluence)',
    'Project execution failures (cost overruns, delays) undermine customer confidence',
  ],
  moatAssessment:
    'Moderate moat. FlexStore\'s AI optimization edge is real but not insurmountable. The fast-deploy advantage is meaningful for C&I customers. The software attach rate (68%) is the most important moat-building metric — recurring SaaS revenue from deployed hardware creates switching costs that grow with each year of operational data. Biggest risk is commoditization of the hardware layer by Chinese BESS vendors.',
  competitors: ['Stem Inc.', 'Fluence (Siemens/AES JV)', 'Wärtsilä Energy', 'CATL (direct)', 'Tesla Megapack'],
}

// ── Aggregate Exports ─────────────────────────────────────────

export const companies: Company[] = [
  rklbCompany, ionqCompany, lunrCompany, jobyCompany, arqqCompany,
  servCompany, ktosCompany, vicrCompany, liteCompany, beemCompany,
  qsCompany, avavCompany, cbrsCompany, nvphCompany, grfxCompany,
]

export const companyKPIs: CompanyKPIs[] = [
  rklbKPIs, ionqKPIs, lunrKPIs, jobyKPIs, arqqKPIs,
  servKPIs, ktosKPIs, vicrKPIs, liteKPIs, beemKPIs,
  qsKPIs, avavKPIs, cbrsKPIs, nvphKPIs, grfxKPIs,
]

export const asymmetricScores: AsymmetricScore[] = [
  rklbScore, ionqScore, lunrScore, jobyScore, arqqScore,
  servScore, ktosScore, vicrScore, liteScore, beemScore,
  qsScore, avavScore, cbrsScore, nvphScore, grfxScore,
]

export const investmentTheses: InvestmentThesis[] = [
  rklbThesis, ionqThesis, lunrThesis, jobyThesis, arqqThesis,
  servThesis, ktosThesis, vicrThesis, liteThesis, beemThesis,
  qsThesis, avavThesis, cbrsThesis, nvphThesis, grfxThesis,
]

export function getCompanyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id)
}

export function getCompanyBySlug(slug: string): Company | undefined {
  return companies.find((c) => c.slug === slug)
}

export function getCompanyByTicker(ticker: string): Company | undefined {
  return companies.find((c) => c.ticker === ticker)
}

export function getKPIsByCompanyId(id: string): CompanyKPIs | undefined {
  return companyKPIs.find((k) => k.companyId === id)
}

export function getScoreByCompanyId(id: string): AsymmetricScore | undefined {
  return asymmetricScores.find((s) => s.companyId === id)
}

export function getThesisByCompanyId(id: string): InvestmentThesis | undefined {
  return investmentTheses.find((t) => t.companyId === id)
}

export function getCompaniesBySector(sector: string): Company[] {
  return companies.filter((c) => c.sector === sector)
}
