import type { Catalyst } from '@/types'

// ============================================================
// CONVEX — Mock Catalyst Events (25+ events, May 2026 – May 2027)
// ============================================================

export const catalysts: Catalyst[] = [

  // ── ROCKET LAB (RKLB) ──────────────────────────────────────

  {
    id: 'rklb-q1-earnings-2026',
    companyId: 'rklb',
    companyName: 'Rocket Lab USA',
    companyTicker: 'RKLB',
    title: 'Q1 2026 Earnings Release',
    description:
      'Quarterly earnings expected to show continued Space Systems revenue growth and Electron launch cadence improvement. Consensus expects $115M revenue (+65% YoY). Any Neutron development update will be closely watched.',
    date: '2026-05-14',
    estimatedPeriod: null,
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 95,
    isUpcoming: true,
  },
  {
    id: 'rklb-neutron-engine-test',
    companyId: 'rklb',
    companyName: 'Rocket Lab USA',
    companyTicker: 'RKLB',
    title: 'Neutron Archimedes Engine Full-Duration Hotfire',
    description:
      'Planned full-duration static fire test of the Archimedes engine cluster for the Neutron medium-lift rocket. This is the key technical milestone before first stage integration can begin. A successful test would significantly accelerate the stock re-rating timeline.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Product Launch',
    impactLevel: 'Critical',
    confidenceLevel: 65,
    isUpcoming: true,
  },
  {
    id: 'rklb-nasa-escapade-launch',
    companyId: 'rklb',
    companyName: 'Rocket Lab USA',
    companyTicker: 'RKLB',
    title: 'NASA ESCAPADE Mars Mission Launch (Electron)',
    description:
      'Rocket Lab is under contract to launch NASA\'s ESCAPADE twin-spacecraft Mars mission on Electron. The launch window opens in August 2026. This is a marquee NASA science mission demonstrating Electron\'s ability to support interplanetary payloads.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Launch',
    impactLevel: 'High',
    confidenceLevel: 72,
    isUpcoming: true,
  },
  {
    id: 'rklb-q2-earnings-2026',
    companyId: 'rklb',
    companyName: 'Rocket Lab USA',
    companyTicker: 'RKLB',
    title: 'Q2 2026 Earnings Release',
    description:
      'Second quarter results expected to show continued revenue growth. Key focus: gross margin trajectory toward 35%+, Electron launch count, Space Systems backlog update, and Neutron development milestones and expenditure rate.',
    date: null,
    estimatedPeriod: 'Q2 2026',
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 95,
    isUpcoming: true,
  },

  // ── IONQ (IONQ) ────────────────────────────────────────────

  {
    id: 'ionq-forte-enterprise-launch',
    companyId: 'ionq',
    companyName: 'IonQ',
    companyTicker: 'IONQ',
    title: 'IonQ Forte Enterprise — Commercial Datacenter Availability',
    description:
      'IonQ Forte Enterprise system — designed for on-premises deployment in enterprise and government facilities — targeting general commercial availability. First quantum system designed for datacenter rack integration. Key for capturing classified government contracts that cannot use public cloud.',
    date: null,
    estimatedPeriod: 'Q2 2026',
    type: 'Product Launch',
    impactLevel: 'Critical',
    confidenceLevel: 70,
    isUpcoming: true,
  },
  {
    id: 'ionq-q1-earnings-2026',
    companyId: 'ionq',
    companyName: 'IonQ',
    companyTicker: 'IONQ',
    title: 'Q1 2026 Earnings Release',
    description:
      'Quarterly earnings with consensus expecting $16.8M revenue (+92% YoY). Focus will be on #AQ metric progress, new enterprise customer count, and government contract pipeline. Any update on 2026 revenue guidance will drive significant price action.',
    date: '2026-05-08',
    estimatedPeriod: null,
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 95,
    isUpcoming: true,
  },
  {
    id: 'ionq-aria-aq-milestone',
    companyId: 'ionq',
    companyName: 'IonQ',
    companyTicker: 'IONQ',
    title: '#AQ 100 Milestone Announcement',
    description:
      'IonQ has guided toward reaching 100 #AQ (Algorithmic Qubit) capability in 2026 on its next-generation barium-based trapped-ion system. This milestone would represent a commercially meaningful quantum advantage threshold for specific optimization problems. A major re-rating catalyst.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Product Launch',
    impactLevel: 'Critical',
    confidenceLevel: 55,
    isUpcoming: true,
  },
  {
    id: 'ionq-dod-contract',
    companyId: 'ionq',
    companyName: 'IonQ',
    companyTicker: 'IONQ',
    title: 'US Air Force Research Lab Quantum Contract Award',
    description:
      'IonQ has been in advanced discussions with AFRL for a multi-year quantum computing services contract worth an estimated $40–60M. Award announcement expected before end of Q3 2026. Would be IonQ\'s largest single government contract.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Contract',
    impactLevel: 'High',
    confidenceLevel: 60,
    isUpcoming: true,
  },

  // ── INTUITIVE MACHINES (LUNR) ───────────────────────────────

  {
    id: 'lunr-im3-launch',
    companyId: 'lunr',
    companyName: 'Intuitive Machines',
    companyTicker: 'LUNR',
    title: 'IM-3 Lunar Mission Launch (SpaceX Falcon 9)',
    description:
      'IM-3 will deliver the Lunar Trailblazer spacecraft and a commercial payload to the lunar south pole region — the highest-value landing zone in the emerging lunar economy. This mission includes PRIME-1 drill for water ice detection. Mission success is the single most important catalyst for LUNR.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Launch',
    impactLevel: 'Critical',
    confidenceLevel: 75,
    isUpcoming: true,
  },
  {
    id: 'lunr-near-space-network',
    companyId: 'lunr',
    companyName: 'Intuitive Machines',
    companyTicker: 'LUNR',
    title: 'Near Space Network — First Revenue Recognition',
    description:
      'Intuitive Machines\'s $4.82B Near Space Network contract with NASA began service delivery in 2025. First material revenue recognition from NSN communications relay services expected in 2026 as lunar operations intensify. This transforms LUNR from a launch company to an infrastructure company.',
    date: null,
    estimatedPeriod: 'Q2 2026',
    type: 'Contract',
    impactLevel: 'High',
    confidenceLevel: 80,
    isUpcoming: true,
  },
  {
    id: 'lunr-q1-earnings-2026',
    companyId: 'lunr',
    companyName: 'Intuitive Machines',
    companyTicker: 'LUNR',
    title: 'Q1 2026 Earnings Release',
    description:
      'First quarter results with consensus expecting $38M revenue. Key focus: NSN revenue ramp, IM-3 mission update, cash position, and any new CLPS task order announcements. A revenue beat would be critical given high short interest.',
    date: '2026-05-12',
    estimatedPeriod: null,
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 95,
    isUpcoming: true,
  },

  // ── JOBY AVIATION (JOBY) ───────────────────────────────────

  {
    id: 'joby-faa-type-cert',
    companyId: 'joby',
    companyName: 'Joby Aviation',
    companyTicker: 'JOBY',
    title: 'FAA Type Certificate — Stage 3 Completion',
    description:
      'Joby is in Stage 4 of FAA Type Certification (the final stage). Completion of remaining certification tests and FAA review is expected late 2026. This is the defining binary event for JOBY — certification unlocks commercial revenue in the US market and validates the aircraft design globally.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Regulatory',
    impactLevel: 'Critical',
    confidenceLevel: 62,
    isUpcoming: true,
  },
  {
    id: 'joby-dubai-commercial-ops',
    companyId: 'joby',
    companyName: 'Joby Aviation',
    companyTicker: 'JOBY',
    title: 'Dubai Commercial Operations Launch',
    description:
      'Joby\'s Emirates flight operations under GCAA (UAE) certification — the first commercial revenue-generating air taxi service. The Dubai Vertiport network includes routes from Downtown Dubai, DIFC, and Dubai International Airport. First revenue recognition event for Joby.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Product Launch',
    impactLevel: 'Critical',
    confidenceLevel: 68,
    isUpcoming: true,
  },
  {
    id: 'joby-toyota-manufacturing',
    companyId: 'joby',
    companyName: 'Joby Aviation',
    companyTicker: 'JOBY',
    title: 'Toyota Manufacturing Facility Groundbreaking',
    description:
      'Toyota and Joby are expected to announce groundbreaking of a dedicated Joby aircraft manufacturing facility in Q3 2026, using Toyota\'s TNGA-derived production system adapted for aircraft. This de-risks Joby\'s path to 1,000+ aircraft/year production capacity.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Partnership',
    impactLevel: 'High',
    confidenceLevel: 58,
    isUpcoming: true,
  },
  {
    id: 'joby-q1-earnings-2026',
    companyId: 'joby',
    companyName: 'Joby Aviation',
    companyTicker: 'JOBY',
    title: 'Q1 2026 Earnings Release & Cash Runway Update',
    description:
      'Pre-revenue, so focus entirely on burn rate ($58M/quarter), cash runway update, certification timeline updates, flight test hours logged, and any partnership/customer announcements. Toyota investment tranches are key items.',
    date: '2026-05-06',
    estimatedPeriod: null,
    type: 'Earnings',
    impactLevel: 'Medium',
    confidenceLevel: 95,
    isUpcoming: true,
  },

  // ── SERVE ROBOTICS (SERV) ───────────────────────────────────

  {
    id: 'serv-fleet-expansion-2000',
    companyId: 'serv',
    companyName: 'Serve Robotics',
    companyTicker: 'SERV',
    title: 'Fleet Expansion to 2,000 Robots — Milestone Update',
    description:
      'Serve Robotics and Nvidia committed to deploying 2,000 robots across US markets in 2026. Q3 2026 is the target for reaching this milestone. Each 500-robot increment triggers additional Nvidia hardware support and unlocks performance bonus thresholds in the Uber partnership agreement.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Product Launch',
    impactLevel: 'High',
    confidenceLevel: 68,
    isUpcoming: true,
  },
  {
    id: 'serv-new-city-expansion',
    companyId: 'serv',
    companyName: 'Serve Robotics',
    companyTicker: 'SERV',
    title: 'New City Market Expansion (Chicago / Austin)',
    description:
      'Serve Robotics is in permitting discussions in Chicago and Austin for sidewalk robot operation. Approval in either market would be a significant catalyst — Chicago in particular would represent the first major cold-weather market deployment, validating year-round operational capability.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Regulatory',
    impactLevel: 'High',
    confidenceLevel: 55,
    isUpcoming: true,
  },
  {
    id: 'serv-q1-earnings-2026',
    companyId: 'serv',
    companyName: 'Serve Robotics',
    companyTicker: 'SERV',
    title: 'Q1 2026 Earnings — Unit Economics Update',
    description:
      'Key metrics: deliveries per robot per day (targeting 4+), revenue per delivery (targeting $1.80+), fleet count, and gross margin trajectory. Any Nvidia fleet investment update will drive significant investor interest.',
    date: '2026-05-09',
    estimatedPeriod: null,
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 95,
    isUpcoming: true,
  },

  // ── KRATOS DEFENSE (KTOS) ───────────────────────────────────

  {
    id: 'ktos-valkyrie-contract',
    companyId: 'ktos',
    companyName: 'Kratos Defense',
    companyTicker: 'KTOS',
    title: 'USAF Collaborative Combat Aircraft (CCA) Contract Award',
    description:
      'The USAF CCA program — autonomous wingman aircraft flying alongside F-35s and F-22s — is expected to award a production contract in late 2026. Kratos\'s XQ-58A Valkyrie is one of two finalists alongside a General Atomics offering. A win would be worth $2B+ over 5 years.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Contract',
    impactLevel: 'Critical',
    confidenceLevel: 58,
    isUpcoming: true,
  },
  {
    id: 'ktos-q2-earnings-2026',
    companyId: 'ktos',
    companyName: 'Kratos Defense',
    companyTicker: 'KTOS',
    title: 'Q2 2026 Earnings Release',
    description:
      'Quarterly earnings expected to show continued unmanned systems revenue growth. Consensus expects $272M revenue. Key focus: unmanned systems segment growth, hypersonic engine contract updates, and any guidance revision for the second half.',
    date: null,
    estimatedPeriod: 'Q2 2026',
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 95,
    isUpcoming: true,
  },
  {
    id: 'ktos-nato-export-license',
    companyId: 'ktos',
    companyName: 'Kratos Defense',
    companyTicker: 'KTOS',
    title: 'NATO Allied Export License — Valkyrie / UTAP',
    description:
      'DOS export license applications for XQ-58A and UTAP-22 Mako to key NATO allies (UK, Australia, Germany) pending. Approval would open a $500M+ international market for Kratos attritable drone systems. Timing subject to ITAR review process.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Regulatory',
    impactLevel: 'High',
    confidenceLevel: 52,
    isUpcoming: true,
  },

  // ── QUANTUMSCAPE (QS) ──────────────────────────────────────

  {
    id: 'qs-vw-qualification-sample',
    companyId: 'qs',
    companyName: 'QuantumScape',
    companyTicker: 'QS',
    title: 'Volkswagen B-Sample Qualification — Automotive Grade Cells',
    description:
      'QuantumScape is targeting delivery of B-sample cells to Volkswagen for automotive-grade qualification testing. B-sample represents cells that meet volume production intent specifications. Passage of Volkswagen\'s internal qualification would be the strongest possible commercial validation signal.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Product Launch',
    impactLevel: 'Critical',
    confidenceLevel: 50,
    isUpcoming: true,
  },
  {
    id: 'qs-powden-line-ramp',
    companyId: 'qs',
    companyName: 'QuantumScape',
    companyTicker: 'QS',
    title: 'QS-0 Pre-Pilot Line Yield Update',
    description:
      'QuantumScape\'s QS-0 pre-pilot manufacturing line in San Jose is targeting 80%+ yield on automotive-spec cells. Quarterly operational updates on yield progress are the primary value-creation signals for QS before VW qualification.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Product Launch',
    impactLevel: 'High',
    confidenceLevel: 72,
    isUpcoming: true,
  },
  {
    id: 'qs-q2-earnings-2026',
    companyId: 'qs',
    companyName: 'QuantumScape',
    companyTicker: 'QS',
    title: 'Q2 2026 Earnings & Operational Update',
    description:
      'Pre-revenue, so key metrics: cash burn rate, yield data, cell deliveries to VW, and any timeline updates for B-sample qualification. VW\'s continued investment and commitment to the JV is the primary item investors will scrutinize.',
    date: null,
    estimatedPeriod: 'Q2 2026',
    type: 'Earnings',
    impactLevel: 'Medium',
    confidenceLevel: 95,
    isUpcoming: true,
  },

  // ── AEROVIRONMENT (AVAV) ───────────────────────────────────

  {
    id: 'avav-switchblade-nato',
    companyId: 'avav',
    companyName: 'AeroVironment',
    companyTicker: 'AVAV',
    title: 'NATO Switchblade Loitering Munition Standardization',
    description:
      'NATO Working Group on Loitering Munitions is evaluating Switchblade 300 and 600 for NATO STANAG standardization, which would enable allied procurement without individual export licenses. Standardization decision expected by Q4 2026. Positive outcome could unlock $1B+ in 5-year allied procurement.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Regulatory',
    impactLevel: 'Critical',
    confidenceLevel: 55,
    isUpcoming: true,
  },
  {
    id: 'avav-jump20-contract',
    companyId: 'avav',
    companyName: 'AeroVironment',
    companyTicker: 'AVAV',
    title: 'US Army JUMP 20 IDIQ Contract — Phase 2 Award',
    description:
      'AeroVironment is expected to receive Phase 2 of the JUMP 20 VTOL UAS contract from the US Army. Phase 2 covers 500+ units for Army Multi-Domain Task Force integration. Estimated value $180–240M. This is the key organic growth driver for AVAV in 2026.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Contract',
    impactLevel: 'High',
    confidenceLevel: 72,
    isUpcoming: true,
  },
  {
    id: 'avav-q4-fy2026-earnings',
    companyId: 'avav',
    companyName: 'AeroVironment',
    companyTicker: 'AVAV',
    title: 'Q4 FY2026 Earnings Release (April FYE)',
    description:
      'AVAV reports on a May fiscal year end. Q4 FY2026 (Feb-Apr 2026) earnings include full accounting of Ukraine-related Switchblade deliveries and DoD contract wins. Consensus: $195M revenue, $2.18 EPS. Full-year FY2027 guidance will be the primary market catalyst.',
    date: '2026-06-18',
    estimatedPeriod: null,
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 90,
    isUpcoming: true,
  },

  // ── CEREBRAS SYSTEMS (CBRS) ────────────────────────────────

  {
    id: 'cbrs-cs4-announcement',
    companyId: 'cbrs',
    companyName: 'Cerebras Systems',
    companyTicker: 'CBRS',
    title: 'CS-4 Wafer-Scale Engine — Product Announcement',
    description:
      'Cerebras is expected to announce the CS-4 (WSE-4), featuring TSMC N3 process technology with improved memory bandwidth and energy efficiency. Expected to be 2.5x more efficient than CS-3 for inference workloads. This would significantly expand Cerebras\'s serviceable market beyond training.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Product Launch',
    impactLevel: 'Critical',
    confidenceLevel: 60,
    isUpcoming: true,
  },
  {
    id: 'cbrs-hyperscaler-partnership',
    companyId: 'cbrs',
    companyName: 'Cerebras Systems',
    companyTicker: 'CBRS',
    title: 'Hyperscaler AI Training Partnership Announcement',
    description:
      'Cerebras is in advanced partnership discussions with two hyperscalers for dedicated Cerebras SupraScale clusters. A hyperscaler-level partnership announcement would represent the most significant commercial validation in Cerebras\'s history and directly challenges Nvidia\'s enterprise AI hegemony.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Partnership',
    impactLevel: 'Critical',
    confidenceLevel: 42,
    isUpcoming: true,
  },
  {
    id: 'cbrs-q2-earnings-2026',
    companyId: 'cbrs',
    companyName: 'Cerebras Systems',
    companyTicker: 'CBRS',
    title: 'Q2 2026 Earnings Release',
    description:
      'Second quarter results expected to show continued triple-digit revenue growth. Key focus: G42 revenue contribution, new enterprise wins, gross margin trajectory, and any hyperscaler collaboration announcements. Cash runway and burn rate also closely monitored.',
    date: null,
    estimatedPeriod: 'Q2 2026',
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 95,
    isUpcoming: true,
  },

  // ── NOVASTAR PHOTONICS (NVPH) ──────────────────────────────

  {
    id: 'nvph-design-win-announcement',
    companyId: 'nvph',
    companyName: 'NovaStar Photonics',
    companyTicker: 'NVPH',
    title: 'Hyperscaler Co-Packaged Optics Design Win — Public Disclosure',
    description:
      'NovaStar is expected to announce public disclosure of at least one of its two non-disclosed hyperscaler design wins in H2 2026. A named hyperscaler customer announcement would significantly re-rate NVPH from a development-stage story to a commercially validated PIC supplier.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Partnership',
    impactLevel: 'Critical',
    confidenceLevel: 55,
    isUpcoming: true,
  },
  {
    id: 'nvph-tsmc-production-ramp',
    companyId: 'nvph',
    companyName: 'NovaStar Photonics',
    companyTicker: 'NVPH',
    title: 'TSMC Silicon Photonics N28 — Volume Production Ramp',
    description:
      'NovaStar\'s first high-volume PIC production run on TSMC\'s silicon photonics-enhanced N28 process node begins. Achieving target yield of 85%+ in the first production run would validate the manufacturing roadmap and enable the company to commit to hyperscaler volume delivery schedules.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Product Launch',
    impactLevel: 'High',
    confidenceLevel: 62,
    isUpcoming: true,
  },
  {
    id: 'nvph-investor-day',
    companyId: 'nvph',
    companyName: 'NovaStar Photonics',
    companyTicker: 'NVPH',
    title: 'NovaStar Photonics First Investor Day',
    description:
      'NovaStar\'s inaugural Investor Day planned for late Q3 2026. Management will present full financial model, silicon photonics TAM analysis, competitive positioning, and 3-year revenue trajectory. Could include a customer keynote and live product demonstration of PIC optical performance.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Investor Day',
    impactLevel: 'High',
    confidenceLevel: 75,
    isUpcoming: true,
  },

  // ── GRIDFLEX ENERGY (GRFX) ─────────────────────────────────

  {
    id: 'grfx-utility-framework',
    companyId: 'grfx',
    companyName: 'GridFlex Energy',
    companyTicker: 'GRFX',
    title: 'Regional Utility Framework Contract Award (150 MWh)',
    description:
      'GridFlex is in final negotiation for a 150 MWh framework agreement with a major Southwestern US utility (undisclosed). This contract would represent the largest single commitment in GRFX\'s history and validates FlexStore for utility-scale BESS deployment. Announcement expected Q3 2026.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Contract',
    impactLevel: 'Critical',
    confidenceLevel: 62,
    isUpcoming: true,
  },
  {
    id: 'grfx-ira-tax-credit',
    companyId: 'grfx',
    companyName: 'GridFlex Energy',
    companyTicker: 'GRFX',
    title: 'IRA Section 48C Advanced Energy Credit — Project Certification',
    description:
      'GridFlex applied for IRS Section 48C advanced energy manufacturing credit for its Denver assembly facility. If approved, GRFX receives 30% ITC on facility investment and becomes eligible to pass BESS investment tax credits directly to customers — significantly improving deal economics versus competitors.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Regulatory',
    impactLevel: 'High',
    confidenceLevel: 65,
    isUpcoming: true,
  },
  {
    id: 'grfx-flexstore-v3-launch',
    companyId: 'grfx',
    companyName: 'GridFlex Energy',
    companyTicker: 'GRFX',
    title: 'FlexStore 3.0 AI Platform — Commercial Release',
    description:
      'FlexStore 3.0 adds machine learning-based grid frequency prediction, multi-market simultaneous bid optimization, and a customer-facing ROI dashboard. The 3.0 release is expected to increase the software attach rate from 68% to 80%+ and expand annual SaaS revenue per MWh deployed.',
    date: null,
    estimatedPeriod: 'Q2 2026',
    type: 'Product Launch',
    impactLevel: 'High',
    confidenceLevel: 80,
    isUpcoming: true,
  },

  // ── BEAM GLOBAL (BEEM) ─────────────────────────────────────

  {
    id: 'beem-dod-bulk-contract',
    companyId: 'beem',
    companyName: 'Beam Global',
    companyTicker: 'BEEM',
    title: 'DoD Bulk EV ARC Purchase — Army Installation Rollout',
    description:
      'Beam Global has been in discussions with Army Installation Management Command for a bulk EV ARC order to electrify 15 bases simultaneously. This "no electrical infrastructure required" value proposition is uniquely suited to military base deployments where grid upgrades take 3–5 years. A contract of $15–25M would be transformative.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Contract',
    impactLevel: 'Critical',
    confidenceLevel: 48,
    isUpcoming: true,
  },
  {
    id: 'beem-european-nato-base',
    companyId: 'beem',
    companyName: 'Beam Global',
    companyTicker: 'BEEM',
    title: 'NATO European Base Deployment — Amiga Partnership',
    description:
      'Beam Global\'s Serbian subsidiary Amiga is pitching EV ARC systems to NATO European Command for forward operating base EV charging. Contract with any European NATO command would validate the European military revenue stream and support Amiga\'s growth.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Contract',
    impactLevel: 'High',
    confidenceLevel: 42,
    isUpcoming: true,
  },

  // ── VICOR (VICR) ───────────────────────────────────────────

  {
    id: 'vicr-hyperscaler-ramp',
    companyId: 'vicr',
    companyName: 'Vicor Corporation',
    companyTicker: 'VICR',
    title: 'Hyperscaler AI Rack Revenue Ramp Update — Q2 2026',
    description:
      'Vicor management has guided toward hyperscaler AI rack design wins entering revenue production in H1 2026. The Q2 2026 earnings call will be the first where hyperscaler-related revenue is expected to be material ($30M+). This is the inflection point the market has been waiting for.',
    date: null,
    estimatedPeriod: 'Q2 2026',
    type: 'Earnings',
    impactLevel: 'Critical',
    confidenceLevel: 78,
    isUpcoming: true,
  },
  {
    id: 'vicr-investor-day-2026',
    companyId: 'vicr',
    companyName: 'Vicor Corporation',
    companyTicker: 'VICR',
    title: 'Vicor Analyst / Investor Day — AI Revenue Model Presentation',
    description:
      'Vicor is planning a formal analyst day in Q3 2026 to present the full AI datacenter revenue model, including content-per-rack economics, hyperscaler customer pipeline, and 3-year financial targets. This will be Vicor\'s first major investor event in 4 years and could significantly re-rate the stock.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Investor Day',
    impactLevel: 'High',
    confidenceLevel: 65,
    isUpcoming: true,
  },

  // ── LUMENTUM (LITE) ────────────────────────────────────────

  {
    id: 'lite-apple-vcsel-next-gen',
    companyId: 'lite',
    companyName: 'Lumentum Holdings',
    companyTicker: 'LITE',
    title: 'Apple iPhone 18 Pro VCSEL Supply Win Confirmation',
    description:
      'Lumentum supply chain checks indicate it is the primary VCSEL supplier for iPhone 18 Pro\'s enhanced 3D facial recognition system with improved depth mapping. Supply win confirmation typically leaks in Q3 via NPI builds. Retention of Apple VCSEL position worth ~$300M in revenue.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Contract',
    impactLevel: 'High',
    confidenceLevel: 72,
    isUpcoming: true,
  },

  // ── ARQIT QUANTUM (ARQQ) ───────────────────────────────────

  {
    id: 'arqq-uk-ncsc-certification',
    companyId: 'arqq',
    companyName: 'Arqit Quantum',
    companyTicker: 'ARQQ',
    title: 'UK NCSC Quantum-Safe Encryption Certification',
    description:
      'Arqit is pursuing NCSC (National Cyber Security Centre) certification for QuantumCloud as an approved quantum-safe encryption solution for UK government systems. Certification would unlock procurement across all UK government departments and serve as the gold-standard reference for EU and Commonwealth government sales.',
    date: null,
    estimatedPeriod: 'Q4 2026',
    type: 'Regulatory',
    impactLevel: 'Critical',
    confidenceLevel: 58,
    isUpcoming: true,
  },
  {
    id: 'arqq-q3-revenue-update',
    companyId: 'arqq',
    companyName: 'Arqit Quantum',
    companyTicker: 'ARQQ',
    title: 'Q3 2026 Earnings — Revenue Milestone & Customer Count',
    description:
      'Q3 2026 will be the first quarter where Arqit guidance implies $4M+ revenue. Management credibility depends on delivery. New customer count and ARR growth will be the primary valuation determinants for ARQQ.',
    date: null,
    estimatedPeriod: 'Q3 2026',
    type: 'Earnings',
    impactLevel: 'High',
    confidenceLevel: 90,
    isUpcoming: true,
  },
]

// ── Utility Helpers ───────────────────────────────────────────

export function getCatalystsByCompany(companyId: string): Catalyst[] {
  return catalysts.filter((c) => c.companyId === companyId)
}

export function getUpcomingCatalysts(days = 90): Catalyst[] {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() + days)
  return catalysts.filter((c) => {
    if (!c.date) return true // estimated catalysts always shown
    return new Date(c.date) <= cutoff
  })
}

export function getCatalystsByType(type: Catalyst['type']): Catalyst[] {
  return catalysts.filter((c) => c.type === type)
}

export function getCriticalCatalysts(): Catalyst[] {
  return catalysts.filter((c) => c.impactLevel === 'Critical')
}
