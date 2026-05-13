import type { AISummary } from '@/types'

// ============================================================
// CONVEX — Mock AI Investment Summaries (15 Companies)
// Model: GPT-4o (simulated) | Generated: May 2026
// isPlaceholder: true — replace with live OpenAI API calls
// ============================================================

export const aiSummaries: AISummary[] = [

  // ── 1. Rocket Lab (RKLB) ─────────────────────────────────

  {
    companyId: 'rklb',
    generatedAt: '2026-05-10T08:14:22Z',
    summary:
      'Rocket Lab stands as the most credibly de-risked asymmetric opportunity in the commercial space sector. Unlike competitors still in development, RKLB generates real revenue across two distinct and growing business lines. The Space Systems segment — building spacecraft and satellite components for government and commercial customers — is increasingly the company\'s earnings engine, growing at triple-digit rates while providing margin expansion that the launch business alone cannot deliver. The Neutron medium-lift rocket, while the most frequently cited catalyst, is actually the option value on top of an already compelling standalone business. Our core thesis does not require Neutron to succeed — Electron cadence and Space Systems alone justify a $12–15 stock price. Neutron is the asymmetric upside overlay.',
    bullCase:
      'Neutron successfully completes its first flight in 2027 and captures 25% of the medium-lift launch market (currently dominated by a single provider). Electron reaches 20 launches/year by 2026, generating $220M in annual launch revenue. Space Systems crosses $400M revenue in 2027 with 35% gross margins as spacecraft production scales. Total revenue reaches $800M by 2027. Applying a 4x forward revenue multiple (justified by Neutron optionality), the stock reaches $28–35. This scenario has a 25% probability in our base model.',
    bearCase:
      'Neutron faces a program-level delay to 2030 or beyond due to engine development challenges. Competition intensifies in small-sat launch as SpaceX Transporter rideshare expands capacity. Space Systems wins slow as customers consolidate with primes. Revenue growth decelerates to 25% by 2027, margins stall at 22%. Stock de-rates to 1.5x revenue — approximately $5–7. This scenario has a 20% probability.',
    keyCatalysts: [
      'Neutron Archimedes engine full-duration hotfire (Q3 2026) — binary event for Neutron timeline credibility',
      'NASA ESCAPADE mission launch — validates Electron for interplanetary science payloads',
      'Space Systems quarterly revenue crossing $120M (annualized $480M) — forces institutional re-rating',
      'New DoD prime spacecraft contract — validates RKLB as a prime, not just a component supplier',
      'Q2 2026 gross margin expansion above 32% — confirms Space Systems margin thesis',
    ],
    mainRisks: [
      'Neutron engine development delays or technical failure during hotfire testing',
      'SpaceX Falcon 9 rideshare expansion cannibalizes Electron\'s addressable market faster than expected',
      'Space Systems competition from Northrop Grumman or Airbus Defence on small satellite prime contracts',
      'CEO Peter Beck health or departure — the company\'s identity and strategy are inseparably tied to his leadership',
      'Equity dilution risk if Neutron development costs exceed current cash reserves',
    ],
    thesisBreakers: [
      'Neutron program formally cancelled or delayed beyond 2029',
      'Peter Beck resignation or health emergency',
      'Loss of NASA or DoD contracts representing >20% of Space Systems backlog',
      'Quarterly Electron launch rate declining below 12 per year for two consecutive quarters',
    ],
    valuationScenario: {
      bull: '$28–35 | 4x 2027 forward revenue | Neutron validates, Space Systems at $400M | 25% probability',
      base: '$12–16 | 2.8x 2027 forward revenue | Electron at 18 launches, Space Systems at $250M | 55% probability',
      bear: '$5–7 | 1.5x 2027 forward revenue | Neutron delayed, Space Systems growth moderates | 20% probability',
    },
    isPlaceholder: true,
  },

  // ── 2. IonQ (IONQ) ───────────────────────────────────────

  {
    companyId: 'ionq',
    generatedAt: '2026-05-10T08:22:11Z',
    summary:
      'IonQ occupies a unique position in the quantum computing landscape: it is simultaneously the most commercially credible and the most technically differentiated pure-play quantum company. The trapped-ion approach — using individual barium and ytterbium atoms as qubits — offers gate fidelity that superconducting competitors struggle to match. Revenue near-doubling annually with government and enterprise customers demonstrates that "quantum utility" is not entirely hypothetical. Our core concern is timeline risk — fault-tolerant quantum computing that delivers provable commercial advantage over classical computing may arrive in 2027 or 2035, and IonQ\'s valuation is priced for the former.',
    bullCase:
      'IonQ demonstrates 100 #AQ on the Forte Enterprise system by Q3 2026, enabling quantum advantage on commercially relevant optimization problems. The DoD and NSA significantly expand their quantum computing contracts. Revenue reaches $200M in 2027 as enterprise pharmaceutical and logistics customers begin paying for quantum optimization services. A strategic acquisition by IBM, Honeywell, or Microsoft at 20x revenue ($3B+) materializes. Stock reaches $35–50.',
    bearCase:
      'IBM\'s Eagle/Heron superconducting processors achieve fault tolerance first, capturing enterprise mindshare and government contracts. IonQ\'s #AQ roadmap slips by 4+ quarters. Cash runway falls below 15 months, requiring dilutive financing at $8–10/share. Revenue growth decelerates to 40% by 2027 as competition intensifies. Stock retraces to $4–7.',
    keyCatalysts: [
      '#AQ 100 milestone achievement — the most important near-term technical de-risking event',
      'US Air Force Research Lab contract award ($40–60M) — validates government quantum expansion',
      'Forte Enterprise commercial availability — opens on-premises government and financial sector market',
      'Q3 2026 revenue beat above $20M — demonstrates commercial traction acceleration',
      'Any partnership with a Tier 1 pharmaceutical or financial institution (named customer)',
    ],
    mainRisks: [
      'Competing qubit architectures (IBM superconducting, PsiQuantum photonic) achieve fault tolerance ahead of IonQ',
      'Government quantum computing budgets face sequestration or restructuring',
      '#AQ roadmap slippage — IonQ has previously revised timelines',
      'High short interest (14%) creates downward pressure and signals informed skepticism',
      'Cash burn rate of $34M/month requires continued capital markets access',
    ],
    thesisBreakers: [
      'IBM or Google publicly demonstrates fault-tolerant advantage on a commercially relevant problem before IonQ reaches 100 #AQ',
      'IonQ misses #AQ 100 target by more than 6 months',
      'Government contract non-renewals or competitive losses exceeding 15% of revenue',
      'Cash runway falls below 12 months without a commitment from a strategic investor',
    ],
    valuationScenario: {
      bull: '$35–50 | 10x 2027 forward revenue | 100 #AQ achieved, DoD expansion, strategic M&A premium | 20% probability',
      base: '$18–25 | 6x 2027 forward revenue | Steady growth, government contracts intact, #AQ milestones on track | 50% probability',
      bear: '$4–7 | 2x 2027 forward revenue | Competing architectures advance, timeline slippage, dilutive raise | 30% probability',
    },
    isPlaceholder: true,
  },

  // ── 3. Intuitive Machines (LUNR) ─────────────────────────

  {
    companyId: 'lunr',
    generatedAt: '2026-05-10T08:31:04Z',
    summary:
      'Intuitive Machines is the most binary near-term investment in this portfolio. The company executed the first commercial US lunar landing in 50 years with IM-1, then landed IM-2 at the lunar south pole — the exact coordinates that Artemis astronauts will one day walk. This heritage is commercially invaluable. However, the company operates with a thin cash buffer and high dilution risk, making LUNR suitable only for investors who understand the mission-success binary nature of space investing. The Near Space Network contract ($4.82B potential over 10 years) is the transformative catalyst that, if it materializes, converts LUNR from a mission-driven startup to an infrastructure company with stable recurring revenue.',
    bullCase:
      'IM-3 successfully lands at the lunar south pole in Q3 2026, delivering PRIME-1 water ice data to NASA and garnering global media attention. NSN revenue ramp accelerates to $80M annually. LUNR wins additional Artemis support contracts valued at $300M. Stock reaches $10–15 as the company\'s infrastructure thesis gains institutional credibility.',
    bearCase:
      'IM-3 mission failure (landing anomaly) triggers loss of NASA confidence. NSN revenue ramp is delayed as NASA reassesses commercial lunar program structure. Dilutive equity raise at $1.50–2.00/share to fund IM-4 development. Stock falls to $1–2 as the commercial lunar thesis is reset.',
    keyCatalysts: [
      'IM-3 mission launch and successful lunar south pole landing — the single highest-impact catalyst',
      'Near Space Network first material revenue recognition (Q2 2026) — validates infrastructure thesis',
      'New CLPS task order awards above $50M — confirms NASA pipeline momentum',
      'IM-4 mission announcement with commercial payload manifest — validates post-IM-3 pipeline',
      'Q1 2026 cash position above $200M — reduces short-term dilution risk',
    ],
    mainRisks: [
      'IM-3 mission failure — would be catastrophic for investor and NASA confidence',
      'Cash runway falls below 10 months, forcing dilutive equity raise',
      'NASA reduces CLPS program funding or delays task orders',
      'Competitor mission success (Firefly Blue Ghost) captures NASA preferred provider status',
      'Near Space Network contract revenue ramp slower than projected',
    ],
    thesisBreakers: [
      'IM-3 mission failure followed by loss of IM-4 contract',
      'Equity raise below $2.00/share',
      'NASA pauses CLPS program for more than 6 months',
      'Management guidance revision implying >12 months additional dilution risk',
    ],
    valuationScenario: {
      bull: '$10–15 | IM-3 success, NSN revenue ramp, Artemis contracts | 35% probability',
      base: '$5–8 | Steady CLPS mission cadence, NSN ramps slowly, margins improve | 40% probability',
      bear: '$1–2 | Mission failure, dilutive raise, NASA program restructuring | 25% probability',
    },
    isPlaceholder: true,
  },

  // ── 4. Joby Aviation (JOBY) ──────────────────────────────

  {
    companyId: 'joby',
    generatedAt: '2026-05-10T08:39:55Z',
    summary:
      'Joby Aviation is the most credible eVTOL investment available — and that is not high praise given the competitive landscape. The company has 1,000+ test flights, a $1.4B cash cushion, a Toyota manufacturing partner with $894M committed, and a FAA certification process that is genuinely further along than any competitor. The Dubai commercial launch, while small in revenue terms, is the proof of concept that air taxi economics can work in premium urban markets. The core risk is regulatory timing — FAA certification in a new aviation category is inherently unpredictable, and a 12-18 month delay from the current Q4 2026 target would significantly increase cash burn risk and force additional financing.',
    bullCase:
      'FAA Type Certificate granted Q4 2026, Dubai operations generate $20M+ revenue in 2026, Toyota announces dedicated manufacturing facility. Delta Air Lines activates its fleet order, adding 200 aircraft to JOBY\'s production commitments. Stock reaches $15–22 as the pre-revenue risk premium evaporates and revenue visibility emerges.',
    bearCase:
      'FAA certification delayed to late 2028, Dubai operations face operational challenges (noise, infrastructure), Toyota reduces manufacturing commitment amid broader EV market softness. Stock falls to $2.50–4.00 as cash burn continues without revenue, raising the possibility of a dilutive raise at a distressed price.',
    keyCatalysts: [
      'FAA Type Certificate — the single most important event in JOBY\'s history',
      'Dubai commercial launch generating first revenue — proves urban air taxi economics',
      'Toyota manufacturing facility groundbreaking — de-risks production scale-up',
      'Delta Air Lines fleet commitment activation — creates secondary demand catalyst',
      'Additional GCAA or EASA certification (international markets) — expands TAM faster',
    ],
    mainRisks: [
      'FAA certification delay of 12+ months from current Q4 2026 guidance',
      'Aircraft incident during testing or early commercial operations',
      'Urban air taxi economics less attractive than projected (noise restrictions, infrastructure costs)',
      'Competitor Archer Aviation achieves FAA certification ahead of Joby',
      'Toyota manufacturing commitment reduction amid EV market headwinds',
    ],
    thesisBreakers: [
      'FAA certification delayed beyond 2028',
      'Fatal aircraft incident during testing',
      'Toyota exits or significantly restructures manufacturing partnership',
      'US Congress restricts urban air taxi operations in major cities',
    ],
    valuationScenario: {
      bull: '$15–22 | FAA cert Q4 2026, Dubai operational, Toyota manufacturing confirmed | 30% probability',
      base: '$8–13 | FAA cert mid-2027, limited initial commercial operations | 45% probability',
      bear: '$2.50–4 | FAA cert delay 2028+, dilutive financing, competitor advances | 25% probability',
    },
    isPlaceholder: true,
  },

  // ── 5. Arqit Quantum (ARQQ) ──────────────────────────────

  {
    companyId: 'arqq',
    generatedAt: '2026-05-10T08:47:18Z',
    summary:
      'Arqit is the highest-risk, highest-controversy position in the quantum space. The company has faced legitimate skepticism about its original satellite-based key distribution business model, and the pivot to pure software PQC SaaS was jarring for early investors. However, the software-only model is now a strength — 71%+ gross margins, no hardware capex, and a TAM that scales with global enterprise and government PQC upgrade cycles. NIST\'s finalization of PQC standards in 2024 created a mandate-driven spending cycle that benefits Arqit disproportionately. The key question is whether a $142M market cap reflects an appropriate risk premium or a genuine mispricing. We believe it\'s the latter, with 22% short interest representing informed pessimism about revenue execution that management has now begun to address.',
    bullCase:
      'UK NCSC grants QuantumCloud certification, triggering a cascade of UK government department contracts. EU NIS2 directive compliance requirements drive a wave of European enterprise PQC demand. Revenue reaches $50M in 2027 with 73% gross margins, approaching cash flow breakeven. Stock reaches $18–28 as institutional coverage initiates and short interest covers.',
    bearCase:
      'Palo Alto Networks or CrowdStrike bundles PQC modules in their existing platform, commoditizing Arqit\'s standalone value proposition. Revenue stalls at $15M, burn rate forces another dilutive equity raise at $2–3/share. Short interest remains elevated as the market prices continued execution risk. Stock falls to $1.50–2.50.',
    keyCatalysts: [
      'UK NCSC certification — most important government validation available to Arqit',
      'Q3 2026 revenue crossing $4M quarterly — first proof of meaningful commercial acceleration',
      'Named US Federal Government contract — validates trans-Atlantic government demand',
      'Partnership with a Tier 1 telco or bank — demonstrates enterprise PQC urgency',
      'Short interest decline from 22% to below 15% — signals informed capitulation',
    ],
    mainRisks: [
      'Established cybersecurity platforms bundle PQC at zero incremental cost to customers',
      'Revenue fails to accelerate despite NIST standards finalization',
      'High short interest creates constant selling pressure and borrowing costs',
      'Additional equity dilution below $4/share',
      'NIST or government mandates a competing PQC standard incompatible with Arqit\'s approach',
    ],
    thesisBreakers: [
      'Q4 2026 revenue below $3.5M — signals commercial traction failure',
      'Dilutive raise below $3/share',
      'UK government declines QuantumCloud for a competing solution',
      'Palo Alto or CrowdStrike announces bundled PQC offering at existing subscription prices',
    ],
    valuationScenario: {
      bull: '$18–28 | NCSC cert, US gov contract, revenue at $50M by 2027 | 25% probability',
      base: '$8–12 | Steady gov contracts, revenue $25–30M by 2027, breakeven path | 45% probability',
      bear: '$1.50–2.50 | Revenue stalls, dilutive raise, platform competition | 30% probability',
    },
    isPlaceholder: true,
  },

  // ── 6. Serve Robotics (SERV) ─────────────────────────────

  {
    companyId: 'serv',
    generatedAt: '2026-05-10T08:54:33Z',
    summary:
      'Serve Robotics has the most distinctive strategic asymmetry in the robotics space: Nvidia owns a strategic stake, Uber provides embedded demand with zero customer acquisition cost, and the company\'s Level 4 autonomous sidewalk delivery platform is generating real revenue with improving unit economics. The $388M market cap feels low given the Nvidia endorsement alone. In robotics investing, the technology validation question is usually unanswered — with Serve, Nvidia has already answered it by investing at $125M. Our primary concern is execution speed: the window for first-mover advantage in sidewalk delivery robotics is not unlimited, and Starship Technologies (SoftBank-backed) is the competitive threat that most investors underestimate.',
    bullCase:
      'Fleet reaches 5,000 robots by 2027 across 12 cities. Unit economics achieve $0.80 gross profit per delivery at scale. Uber deepens exclusivity by acquiring a stake in Serve. Revenue reaches $40M in 2027, Nvidia announces Serve as a reference deployment for DRIVE robotics platform. Stock reaches $22–35.',
    bearCase:
      'City regulatory pushback (pedestrian safety ordinances) slows expansion to 3 cities by 2027. Starship Technologies deploys 10,000 robots in Europe, demonstrating superior cold-weather and mixed-terrain capability. Unit economics remain marginal at $0.30 gross profit per delivery. Revenue reaches only $12M by 2027. Stock falls to $3–5.',
    keyCatalysts: [
      'Fleet expansion to 2,000 robots — validates Nvidia/Uber deployment commitment',
      'Chicago or Austin regulatory approval — cold-weather/new geography validation',
      'Deliveries per robot per day crossing 5.0 — unit economics inflection signal',
      'Nvidia DRIVE platform integration announcement — technology ecosystem expansion',
      'New restaurant/retail partner announcement (beyond Shake Shack/Uber Eats)',
    ],
    mainRisks: [
      'City ordinances restricting or banning sidewalk robots (San Francisco precedent)',
      'Starship Technologies raises additional capital and accelerates US expansion',
      'Nvidia reduces strategic commitment or stakes in competing robotics platforms',
      'Battery and maintenance costs remain higher than projected, keeping margins low',
      'Major safety incident involving a pedestrian',
    ],
    thesisBreakers: [
      'Nvidia exits Serve Robotics investment or announces competing investment',
      'Uber launches in-house sidewalk robot delivery program',
      'Federal regulation restricting Level 4 sidewalk robots in commercial zones',
      'Fleet expansion stalls below 500 robots by end of 2026',
    ],
    valuationScenario: {
      bull: '$22–35 | 5,000 robots, 12 cities, Uber deepens partnership | 30% probability',
      base: '$12–18 | 3,000 robots, 8 cities, unit economics improving | 45% probability',
      bear: '$3–5 | Regulatory slowdown, competition intensifies, unit economics marginal | 25% probability',
    },
    isPlaceholder: true,
  },

  // ── 7. Kratos Defense (KTOS) ─────────────────────────────

  {
    companyId: 'ktos',
    generatedAt: '2026-05-10T09:02:47Z',
    summary:
      'Kratos is the defense portfolio\'s highest-conviction, lowest-volatility position. The company is a systematic beneficiary of NATO\'s once-in-a-generation rearmament, the Ukraine war\'s acceleration of drone procurement, and the US Air Force\'s pivot toward attritable autonomous combat systems. KTOS is not a speculative story — it has $1B+ in trailing revenue, growing DoD contracts, and a near-monopoly in hypersonic test vehicle propulsion. The XQ-58A Valkyrie CCA program is a potential franchise-defining contract that could double KTOS\'s addressable market, but the investment thesis is sound even without it. Our primary concern is valuation relative to the defense prime universe — at 3x revenue, KTOS screens cheaply, but defense multiples compress rapidly in sequestration risk scenarios.',
    bullCase:
      'USAF awards KTOS the CCA production contract in Q4 2026. Switchblade export licenses approved for 5+ NATO allies. Hypersonic engine revenue grows 40% YoY as DARPA and AFRL accelerate programs. Revenue reaches $1.5B by 2027 with 28% gross margins. Stock reaches $45–60 on CCA production news.',
    bearCase:
      'CCA contract awarded to General Atomics, removing the primary franchise-value catalyst. Defense budget pressure reduces unmanned systems procurement. KTOS revenue growth decelerates to 8%, margins stagnate. Stock de-rates to $18–22 on reduced growth premium.',
    keyCatalysts: [
      'USAF CCA production contract award — the most material single event for KTOS upside',
      'NATO ally Switchblade export license approval — opens $500M+ international market',
      'JUMP 20 Phase 2 Army contract award ($180–240M) — near-term organic growth driver',
      'Hypersonic engine contract expansion with DARPA — validates near-monopoly position',
      'Q3 2026 earnings unmanned systems segment margin expansion above 15%',
    ],
    mainRisks: [
      'CCA contract loss to General Atomics or a new entrant',
      'Defense budget sequestration or continuing resolution limiting new contract starts',
      'Program delays in XQ-58A due to avionics or autonomy software challenges',
      'Loss of classified satellite communications contracts (not publicly disclosed)',
      'CEO Eric DeMarco compensation structure misalignment concerns from proxy advisors',
    ],
    thesisBreakers: [
      'USAF cancels CCA program entirely (unlikely but possible under new administration)',
      'Two consecutive quarters of unmanned systems revenue decline',
      'Defense budget cut exceeding 15% in FY2028 appropriations',
      'Hypersonic propulsion program cancelled due to treaty constraints',
    ],
    valuationScenario: {
      bull: '$45–60 | CCA win, NATO exports, hypersonic expansion | 35% probability',
      base: '$32–40 | JUMP 20 expansion, steady DoD contracts, no CCA win | 45% probability',
      bear: '$18–22 | CCA loss, defense budget pressure, growth deceleration | 20% probability',
    },
    isPlaceholder: true,
  },

  // ── 8. Vicor (VICR) ──────────────────────────────────────

  {
    companyId: 'vicr',
    generatedAt: '2026-05-10T09:11:22Z',
    summary:
      'Vicor is the most under-appreciated company in the AI infrastructure stack. While Nvidia captures every headline, the physical limitation that makes AI datacenter scaling increasingly difficult is not compute — it is power delivery. Each new GPU generation demands 2x more power per chip, and traditional voltage regulator module (VRM) technology is approaching fundamental efficiency limits. Vicor\'s Factorized Power Architecture solves this problem with a 5–10 year technology lead that no competitor has matched. The founder owns 62% of the shares outstanding — meaning the market has effectively valued 38% of the company at $1.58B. We view this as one of the most obvious structural mispricings in small-cap tech.',
    bullCase:
      'Hyperscaler revenue ramp confirms in Q2 2026 as guided, with Vicor content growing from $800 to $2,000+ per AI rack as Nvidia Blackwell/Rubin adoption scales. Revenue reaches $750M in 2027, margins expand to 54%. The founder\'s 62% stake prevents dilution permanently. Stock reaches $75–100 as institutional models finally price the AI power delivery TAM correctly.',
    bearCase:
      'Hyperscaler in-house power delivery development (similar to Google\'s TPU strategy) reduces Vicor content per rack. EV automotive segment softens. Revenue growth decelerates to 12%, margins stall. Stock de-rates to $22–28 as the AI power delivery thesis fails to materialize at projected scale.',
    keyCatalysts: [
      'Q2 2026 hyperscaler revenue confirmation — the inflection point the market has been waiting for',
      'Investor Day — first comprehensive financial model presentation for AI datacenter power market',
      'New hyperscaler design win announcement (beyond Microsoft and Meta)',
      'Automotive power delivery design win with a major EV OEM',
      'EV power delivery revenue crossing $100M annually — validates second growth driver',
    ],
    mainRisks: [
      'Hyperscaler in-house power delivery R&D (Google Power Delivery, Meta custom silicon)',
      'Monolithic Power Systems or Infineon close the power density gap through aggressive R&D',
      'AI capex cycle turns down sharply due to macro deterioration',
      'Founder health or leadership succession — the company\'s identity is inseparably tied to Vinciarelli',
      'Any modification to the founder\'s 62% stake (secondary offering) would be significantly dilutive to non-founders\' control premium',
    ],
    thesisBreakers: [
      'Nvidia announces it will develop in-house power delivery for Blackwell or successor architectures',
      'Patrizio Vinciarelli health event or leadership change',
      'Two consecutive quarters of revenue below analyst consensus by >10%',
      'Loss of a hyperscaler design win to a competing power architecture',
    ],
    valuationScenario: {
      bull: '$75–100 | Full hyperscaler ramp, $750M revenue, 54% margins, AI power thesis validated | 30% probability',
      base: '$50–65 | Steady hyperscaler and EV growth, $600M revenue by 2027 | 50% probability',
      bear: '$22–28 | Hyperscaler in-house power development, AI capex slowdown | 20% probability',
    },
    isPlaceholder: true,
  },

  // ── 9. Lumentum (LITE) ───────────────────────────────────

  {
    companyId: 'lite',
    generatedAt: '2026-05-10T09:19:41Z',
    summary:
      'Lumentum is a recovery and re-rating story. The company\'s revenue trough (driven by Apple VCSEL inventory digestion and telecom capex collapse) appears to be behind it, and the secular growth driver of AI datacenter optical interconnects is now large enough to move the needle meaningfully. Trading at 1.3x forward revenue vs. peer Coherent at 2.1x, LITE offers the most attractively valued photonics exposure in the public markets. The primary risk is that the market discounts Lumentum\'s photonics capabilities as being less AI-infrastructure-native than competitors — an assessment we believe is increasingly incorrect as EML and coherent transceiver demand accelerates.',
    bullCase:
      'Apple retains Lumentum as sole VCSEL supplier for iPhone 18 Pro. AI datacenter 800G/1.6T transceiver demand accelerates, with LITE winning supply positions at two hyperscalers. Coherent telecom business stabilizes and returns to growth. Revenue reaches $1.9B by 2027, margins reach 43%. Stock reaches $42–55 as the valuation discount to peers closes.',
    bearCase:
      'Apple begins VCSEL supply diversification (or vertical integration). Telecom capex remains in multi-year depression. Coherent Corp captures dominant AI datacenter optical market share. Revenue stalls at $1.3B, stock de-rates to $16–20.',
    keyCatalysts: [
      'Apple iPhone 18 Pro VCSEL supply confirmation (Q3 2026 NPI season)',
      '800G/1.6T AI datacenter transceiver design wins at Microsoft or Amazon',
      'Telecom coherent revenue turning YoY positive for first time since 2023',
      'Gross margin expansion above 41% — signals mix shift toward higher-margin AI optical products',
      'Capital returns announcement (buyback program) — demonstrates cash flow confidence',
    ],
    mainRisks: [
      'Apple VCSEL supply diversification or vertical integration strategy',
      'Coherent Corp or II-VI Technology capturing AI datacenter optical market share',
      'Extended telecom capex depression beyond 2026',
      'Trade restrictions on photonics component exports to Chinese customers',
      'Low insider ownership (3.7%) means limited alignment between management and shareholders on long-term value creation',
    ],
    thesisBreakers: [
      'Apple announces internal VCSEL development program',
      'Two consecutive quarters of AI datacenter optical revenue below $100M',
      'Telecom coherent revenue declines more than 20% in FY2027',
      'Material impairment of acquired goodwill from the Coherent acquisition integration',
    ],
    valuationScenario: {
      bull: '$42–55 | Apple VCSEL retained, 800G datacenter wins, telecom recovery | 30% probability',
      base: '$32–38 | Steady AI datacenter growth, Apple relationship intact, telecom flat | 50% probability',
      bear: '$16–20 | Apple diversification, competition, telecom depression extends | 20% probability',
    },
    isPlaceholder: true,
  },

  // ── 10. Beam Global (BEEM) ───────────────────────────────

  {
    companyId: 'beem',
    generatedAt: '2026-05-10T09:28:04Z',
    summary:
      'Beam Global is the highest-risk position in the Energy Transition watchlist, but also the one with the most asymmetric upside relative to its market cap. At $52M market cap with $28M trailing revenue, BEEM is priced for moderate failure — not the DoD bulk contract scenario that would re-rate the stock 5–10x. The EV ARC product genuinely solves a problem that no competitor addresses: EV charging in locations where grid infrastructure upgrades are either cost-prohibitive or physically impossible. Military forward operating bases, remote parks, disaster zones, and developing-world commercial sites represent a market that grid-tied competitors literally cannot serve. The Serbian subsidiary Amiga has become the company\'s most important growth engine, and European military NATO deployment could be a significant inflection point.',
    bullCase:
      'DoD Army Installation Command places a $20M+ bulk EV ARC order for 15 bases. Amiga wins a NATO European Command contract for forward-deployed EV charging. Revenue reaches $70M in 2027 with 32% gross margins, approaching cash flow breakeven. Stock reaches $7–12.',
    bearCase:
      'DoD delays EV mandates citing budget constraints. A second equity raise at $1.50/share creates significant dilution. Grid-tied competitors win municipal contracts with government subsidies that Beam cannot match on price. Revenue stalls at $30M. Stock falls to $0.75–1.50.',
    keyCatalysts: [
      'DoD Army Installation bulk EV ARC contract ($15–25M) — transformative single event',
      'NATO European command deployment via Amiga — validates international military thesis',
      'Revenue beat above $32M in FY2026 — confirms growth trajectory without additional dilution',
      'Gross margin expansion above 28% — signals operational leverage emerging',
      'Cash position above $45M without new equity raise — reduces near-term dilution risk',
    ],
    mainRisks: [
      'Short interest of 28% — the highest in the portfolio — signals informed skepticism about near-term execution',
      'Cash runway of only 14 months creates ongoing equity dilution risk',
      'DoD EV mandate delays or defunding under changing political priorities',
      'Grid-tied competitors undercut on price with federal infrastructure subsidies',
      'Amiga revenue sustainability if European military spending priorities shift',
    ],
    thesisBreakers: [
      'Dilutive equity raise below $1.50/share',
      'DoD formally delays all base electrification timelines beyond 2028',
      'Amiga revenue declines for two consecutive quarters',
      'Cash position falls below $20M without new financing commitment',
    ],
    valuationScenario: {
      bull: '$7–12 | DoD bulk contract, NATO deployment, revenue at $70M | 25% probability',
      base: '$3.50–5.50 | Steady order flow, no dilution, revenue at $45M | 45% probability',
      bear: '$0.75–1.50 | Dilutive raise, DoD delays, revenue stalls | 30% probability',
    },
    isPlaceholder: true,
  },

  // ── 11. QuantumScape (QS) ────────────────────────────────

  {
    companyId: 'qs',
    generatedAt: '2026-05-10T09:35:17Z',
    summary:
      'QuantumScape represents the highest-technology, longest-duration, and most binary position in this portfolio. It is either a $30 stock or a $1 stock, and the outcome depends almost entirely on a manufacturing engineering problem: can QS achieve 80%+ yield on solid-state separator production at volumes that enable cost-competitive EV battery economics? The Volkswagen partnership is the most important credentialing factor — VW does not invest $300M in a technology it believes has no path to scale. However, the history of battery technology development is littered with promising laboratory results that never survived the transition to the factory floor. We size QS accordingly: meaningful upside exposure, but position-sized for total loss.',
    bullCase:
      'QS-0 pilot line achieves 85%+ yield on automotive-spec cells. Volkswagen passes B-sample qualification by Q4 2026 and announces full production intent for a 2029 vehicle program. Toyota and BMW announce licensing discussions. QS raises capital at $15+ per share for commercial manufacturing scale-up. Stock reaches $25–40.',
    bearCase:
      'Manufacturing yield remains below 60% due to fundamental separator deposition challenges. VW reduces partnership scope, signaling technology risk concerns. QS cash burn accelerates as manufacturing R&D intensifies. Dilutive financing at $2–3/share to fund 18+ additional months of pre-commercial operations. Stock falls to $1.50–2.50.',
    keyCatalysts: [
      'VW B-sample qualification passage — the most definitive commercial validation possible',
      'QS-0 yield update above 80% — proves manufacturing scalability thesis',
      'Second OEM licensing announcement (Toyota, BMW, or Stellantis)',
      'First revenue recognition from sample cell sales to VW — any revenue is positive signal',
      'Extension of VW joint venture with increased capacity commitment',
    ],
    mainRisks: [
      'Manufacturing yield ceiling — solid-state separator deposition may have fundamental yield limits',
      'Competing solid-state technologies (Toyota all-solid-state, Samsung SDI) reaching production first',
      'Cash burn of $68M/month creates 18-month runway pressure',
      'High short interest (25%) reflects deep skepticism from informed investors and analysts',
      'CATL\'s semi-solid-state battery may offer 80% of the performance benefit at 1/3 the technical risk',
    ],
    thesisBreakers: [
      'VW publicly reduces partnership or postpones production commitment beyond 2030',
      'QS-0 yield remains below 60% after 12 additional months of optimization',
      'Management guidance implies additional $500M+ capital need before commercial production',
      'Competing solid-state battery technology achieves automotive qualification first',
    ],
    valuationScenario: {
      bull: '$25–40 | B-sample qualified, production intent, second OEM licensing | 20% probability',
      base: '$7–12 | Yield improving, VW partnership intact, 2028 commercialization timeline | 45% probability',
      bear: '$1.50–2.50 | Yield stalls, dilutive financing, VW scope reduction | 35% probability',
    },
    isPlaceholder: true,
  },

  // ── 12. AeroVironment (AVAV) ─────────────────────────────

  {
    companyId: 'avav',
    generatedAt: '2026-05-10T09:43:28Z',
    summary:
      'AeroVironment is the defense portfolio\'s quality compounder. Unlike Kratos (higher upside, more dependent on a binary CCA outcome), AVAV has a diversified product base with multiple organic growth engines: Switchblade loitering munitions, Puma/Raven reconnaissance UAS, and the newer JUMP 20 VTOL platform. The company\'s 42%+ gross margins reflect what genuine IP differentiation looks like in defense electronics. Combat-proven products create a procurement path that is qualitatively different from competing on price. NATO allies who have seen Switchblade\'s Ukraine performance are now requesting their own procurement evaluations — this is the pipeline that management has been building for the past two years, and it is beginning to convert.',
    bullCase:
      'NATO Switchblade standardization approved, opening $1B+ allied procurement pipeline. JUMP 20 Phase 2 Army contract awarded at $220M+. Switchblade 600 anti-armor variant approved for sale to Ukraine and Israel. Revenue reaches $1.1B in FY2027 with 45% gross margins. Stock reaches $160–200.',
    bearCase:
      'CCA market redefined by lower-cost entrants, reducing demand for premium-priced systems. Defense budget sequestration limits FY2028 procurement. NATO standardization delayed by political process. Revenue growth decelerates to 10%. Stock de-rates to $75–90.',
    keyCatalysts: [
      'NATO Switchblade loitering munition standardization — the highest-impact international catalyst',
      'JUMP 20 Phase 2 Army contract award ($180–240M)',
      'Ukraine or allied nation emergency procurement of Switchblade 600 (anti-armor)',
      'FY2027 guidance increase at Q4 FY2026 earnings ($195M+ expected)',
      'Export license approval for 3+ NATO allies',
    ],
    mainRisks: [
      'Defense budget sequestration or continuing resolution',
      'NATO standardization process delayed by political dynamics',
      'Commodity drone vendors offering Switchblade-class capabilities at 50% cost',
      'Loss of JUMP 20 Phase 2 to a competitor',
      'Valuation (3.9x forward revenue) pricing in much of the near-term upside',
    ],
    thesisBreakers: [
      'USMC or Army cancels JUMP 20 program',
      'Congress restricts export of Switchblade munitions to allied nations',
      'Two consecutive quarters of revenue below consensus by >10%',
      'Defense sequestration targeting autonomous systems procurement specifically',
    ],
    valuationScenario: {
      bull: '$160–200 | NATO standardization, JUMP 20 Phase 2, allied exports | 30% probability',
      base: '$130–150 | Steady organic growth, JUMP 20 modest expansion, Switchblade intact | 50% probability',
      bear: '$75–90 | Defense budget pressure, competition, growth deceleration | 20% probability',
    },
    isPlaceholder: true,
  },

  // ── 13. Cerebras Systems (CBRS) ──────────────────────────

  {
    companyId: 'cbrs',
    generatedAt: '2026-05-10T09:51:34Z',
    summary:
      'Cerebras Systems is the most technically audacious company in this portfolio. Building a chip that spans an entire 300mm wafer — 57x larger than the largest Nvidia GPU die — requires solving manufacturing challenges that kept every major semiconductor company from even attempting it. The fact that TSMC produces the WSE-3 at acceptable yields is itself a technological achievement worthy of consideration. Revenue more than doubling annually confirms that hyperscalers and government labs are paying for this capability. The primary investment thesis is that Nvidia\'s GPU cluster architecture has a fundamental memory-bandwidth bottleneck for large language model inference, and Cerebras\'s wafer-scale memory integration removes that bottleneck entirely. At $1.84B market cap with $186M trailing revenue on a triple-digit growth trajectory, the entry point is compelling relative to the long-term opportunity.',
    bullCase:
      'Microsoft or Amazon announces a dedicated Cerebras SupraScale cluster deployment for frontier model training. CS-4 announcement doubles performance-per-watt vs. CS-3, opening the inference market at scale. G42 partnership generates $300M+ in revenue over 2026–2027. Revenue reaches $600M in 2027. Stock reaches $45–65 as institutional coverage expands.',
    bearCase:
      'Nvidia Rubin architecture with HBM4 eliminates the memory bandwidth gap, making the WSE\'s primary advantage obsolete. TSMC yield challenges limit WSE-3 production below demand. G42 partnership faces regulatory headwinds (export controls on UAE AI deployments). Revenue growth decelerates to 60%, stock falls to $8–12.',
    keyCatalysts: [
      'Hyperscaler partnership announcement — the most transformative possible catalyst',
      'CS-4 product announcement — extends technology lead for next 3 years',
      'US national lab deployment announcement (second flagship beyond current relationships)',
      'Q2 2026 revenue beat above $55M — demonstrates continued triple-digit growth',
      'G42 partnership expansion to include additional GCC sovereign wealth funds',
    ],
    mainRisks: [
      'Nvidia Rubin/Blackwell\'s memory bandwidth improvements narrow Cerebras\'s advantage',
      'CUDA ecosystem lock-in prevents hyperscaler adoption regardless of hardware superiority',
      'TSMC yield challenges limiting WSE-3 supply',
      'Export control risk for G42 partnership (UAE-based sovereign wealth)',
      'Customer concentration risk — a small number of large customers represent most revenue',
    ],
    thesisBreakers: [
      'Nvidia demonstrates on-chip HBM that matches WSE memory bandwidth for LLM inference',
      'TSMC declines to advance to N3 WSE process due to yield economics',
      'G42 partnership disrupted by US export controls or UAE political dynamics',
      'Revenue growth decelerates below 50% for two consecutive quarters without hyperscaler revenue',
    ],
    valuationScenario: {
      bull: '$45–65 | Hyperscaler adoption, CS-4 launch, G42 expansion | 30% probability',
      base: '$25–35 | G42 revenue, gov labs, CS-4 on track | 50% probability',
      bear: '$8–12 | Nvidia closes gap, TSMC yield issues, growth decelerates | 20% probability',
    },
    isPlaceholder: true,
  },

  // ── 14. NovaStar Photonics (NVPH) ────────────────────────

  {
    companyId: 'nvph',
    generatedAt: '2026-05-10T09:59:47Z',
    summary:
      'NovaStar Photonics is the portfolio\'s highest-quality early-stage growth company. Triple-digit revenue growth, 58%+ gross margins, TSMC manufacturing relationships, and two undisclosed hyperscaler design wins create a profile that would typically command a 15x+ revenue multiple. At 15.4x trailing revenue, NVPH is not cheap — but the quality of evidence for commercial traction is unusually strong for a company at this stage. The key transition in 2026 is converting undisclosed design wins into disclosed hyperscaler partnerships, which would unlock a meaningful institutional investor base and a significant re-rating.',
    bullCase:
      'Both hyperscaler design wins publicly disclosed, TSMC N28 production ramp achieves 88% yield, quantum communications revenue emerges as a $15M+ contributor. NovaStar becomes a named photonic integrated circuit supplier for Nvidia\'s co-packaged optics roadmap. Revenue reaches $120M in 2027. Stock reaches $28–42.',
    bearCase:
      'Intel\'s integrated silicon photonics program wins the co-packaged optics standard for hyperscalers. TSMC yield challenges delay the production ramp by 2 quarters. Undisclosed hyperscaler design wins do not convert to commercial volume orders. Revenue stalls at $25M, stock falls to $3–5.',
    keyCatalysts: [
      'Hyperscaler design win public disclosure — the single most impactful near-term catalyst',
      'TSMC N28 production ramp achieving 85%+ yield',
      'Inaugural Investor Day — first comprehensive public financial model presentation',
      'Quantum communications link contract with government customer',
      'Q3 2026 revenue above $8M quarterly — confirms continued triple-digit growth',
    ],
    mainRisks: [
      'Intel IFS silicon photonics program captures the hyperscaler co-packaged optics standard',
      'TSMC photonics capacity constraints limiting NovaStar production volumes',
      'Hyperscaler design wins not converting to commercial volume orders',
      'Broadcom or Marvell develop competing PIC solutions with better hyperscaler ecosystem integration',
      'Small float and low liquidity amplify downside moves if thesis does not materialize',
    ],
    thesisBreakers: [
      'Both hyperscaler design wins formally cancelled or lost to a competitor',
      'TSMC production yield below 70% after 3+ months on the N28 node',
      'Intel announces hyperscaler co-packaged optics standard win with integrated photonics',
      'Revenue growth below 100% for two consecutive quarters (implying deceleration to <$10M quarterly)',
    ],
    valuationScenario: {
      bull: '$28–42 | Both design wins disclosed, TSMC ramp successful, Nvidia co-packaged optics | 30% probability',
      base: '$14–20 | One design win disclosed, steady revenue growth, quantum comms emerging | 50% probability',
      bear: '$3–5 | Intel wins standard, design wins lost, TSMC yield issues | 20% probability',
    },
    isPlaceholder: true,
  },

  // ── 15. GridFlex Energy (GRFX) ───────────────────────────

  {
    companyId: 'grfx',
    generatedAt: '2026-05-10T10:08:12Z',
    summary:
      'GridFlex Energy sits at the intersection of two powerful tailwinds: the IRA-driven utility BESS deployment supercycle and the AI datacenter power reliability crisis. Utilities are increasingly required to deploy grid-scale storage to manage renewable intermittency, and GridFlex\'s FlexStore AI optimization platform creates a defensible competitive advantage in a hardware category that is otherwise rapidly commoditizing. The SaaS attach rate of 68% is the company\'s most important metric — each additional year of deployed FlexStore data makes the AI optimization engine more powerful, creating customer lock-in that compounds over time. At $178M market cap with $42M trailing revenue, GRFX offers reasonable risk-adjusted exposure to the BESS market without the binary technology risk of QuantumScape.',
    bullCase:
      'Regional utility framework contract (150 MWh) signed in Q3 2026. IRA 48C certification approved, improving deal economics by 30%. FlexStore 3.0 drives attach rate to 82%+, SaaS revenue reaches $18M annually by 2027. Revenue reaches $160M with 38% gross margins. Stock reaches $14–20.',
    bearCase:
      'CATL direct-to-utility pricing undercuts GRFX hardware margins below 20%. IRA energy storage tax credits partially reduced in 2027 budget reconciliation. FlexStore 3.0 launch delayed, attach rate stagnates. Revenue grows to $55M but margins compress to 22%. Stock falls to $2–3.',
    keyCatalysts: [
      'Regional utility framework contract (150 MWh) — largest single commitment in GRFX history',
      'IRA Section 48C credit certification — improves deal economics and customer ROI',
      'FlexStore 3.0 commercial launch — drives software attach rate and recurring revenue',
      'SaaS revenue crossing $10M annually — validates the software layer investment thesis',
      'Q3 2026 gross margin above 35% — confirms mix shift toward higher-margin software business',
    ],
    mainRisks: [
      'CATL or BYD direct-to-utility BESS pricing commoditizes the hardware layer',
      'IRA energy storage credits reduced or eliminated in future budget reconciliation',
      'FlexStore software loses differentiation as competitors (Stem, Fluence) improve AI optimization',
      'Cash runway of 18 months creates ongoing execution pressure',
      'Recent dilution (recentDilution: true) may have reduced insider alignment',
    ],
    thesisBreakers: [
      'IRA BESS investment tax credits eliminated or phased below 15%',
      'Utility framework contract falls through or is awarded to Fluence/Stem',
      'Revenue growth decelerates below 40% for two consecutive quarters',
      'CATL announces direct US BESS system integration business unit',
    ],
    valuationScenario: {
      bull: '$14–20 | Utility framework contract, IRA certification, FlexStore 3.0 success | 30% probability',
      base: '$8–12 | Steady pipeline conversion, SaaS growing, margins improving | 45% probability',
      bear: '$2–3 | Commoditization pressure, IRA risk, execution challenges | 25% probability',
    },
    isPlaceholder: true,
  },
]

// ── Utility Helpers ───────────────────────────────────────────

export function getAISummaryByCompanyId(companyId: string): AISummary | undefined {
  return aiSummaries.find((s) => s.companyId === companyId)
}

export function getAllAISummaries(): AISummary[] {
  return aiSummaries
}
