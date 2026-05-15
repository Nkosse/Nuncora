import Anthropic from "@anthropic-ai/sdk"
import type { NewsArticle } from "@/lib/news/client"
import { type FinancialSnapshot, formatFinancialsForPrompt } from "@/lib/sec/client"

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface CompanyAnalysis {
  summary: string
  asymmetricScore: {
    total: number
    revenueGrowth: number
    cashRunway: number
    tamSize: number
    competitiveAdvantage: number
    managementQuality: number
    catalystDensity: number
    shortInterest: number
    dilutionRisk: number
    sectorTailwind: number
    valuationDiscount: number
  }
  riskLevel: "low" | "medium" | "high" | "very-high"
  bullCase: string
  bearCase: string
  thesis: string
  keyRisks: string[]
  catalysts: Array<{
    title: string
    type: string
    impact: "Low" | "Medium" | "High" | "Critical"
    period: string
    confidence: number
  }>
  priceTargets: {
    base: number
    bull: number
    bear: number
  }
  newsSignal: "positive" | "neutral" | "negative"
  newsHighlight: string
}

export async function analyzeCompany(
  ticker: string,
  profile: {
    name: string
    price: number
    marketCap: number
    sector: string
    industry: string
    description: string
    ceo: string
    employees: string
    exchange: string
    ipoDate: string
    beta: number
  },
  news: NewsArticle[] = [],
  financials: FinancialSnapshot | null = null
): Promise<CompanyAnalysis> {
  const today = new Date().toISOString().split("T")[0]

  const newsSection =
    news.length > 0
      ? `\nRecent nieuws:\n${news.map((n, i) => `${i + 1}. [${n.source}] ${n.title}\n   ${n.summary}`).join("\n")}`
      : "\nGeen recent nieuws beschikbaar."

  const financialsSection = financials
    ? `\n${formatFinancialsForPrompt(financials)}\n`
    : "\n(Geen SEC-financiële data beschikbaar — gebruik trainingskennis voor financiële inschatting.)\n"

  // Bereken P/S ratio als we revenue hebben
  const psRatio = financials?.revenueAnnual && financials.revenueAnnual > 0
    ? (profile.marketCap / financials.revenueAnnual).toFixed(1)
    : null

  const prompt = `Je bent een expert investment analyst gespecialiseerd in asymmetrische kansen in future-tech smallcap aandelen. Vandaag is het ${today}.

Analyseer ${ticker} (${profile.name}) grondig op asymmetrisch opwaarts potentieel.

=== LIVE MARKTDATA ===
- Prijs: $${profile.price}
- Market Cap: $${(profile.marketCap / 1e9).toFixed(2)}B
- P/S ratio: ${psRatio ?? "n/b"}x
- Beta: ${profile.beta}
- Sector: ${profile.sector} / ${profile.industry}
- CEO: ${profile.ceo}
- Medewerkers: ${profile.employees}
- Beurs: ${profile.exchange}
- IPO: ${profile.ipoDate}

=== BEDRIJFSBESCHRIJVING ===
${profile.description}
${financialsSection}
${newsSection}

=== INSTRUCTIES ===
Gebruik de bovenstaande OFFICIËLE SEC-KERNCIJFERS als primaire bron voor financiële scores (revenueGrowth, cashRunway, dilutionRisk). Combineer dit met je trainingskennis over dit bedrijf voor kwalitatieve factoren (technologie, concurrenten, management, catalysts).

Let speciaal op:
- cashRunway: gebruik de berekende maanden cash runway als die beschikbaar is; < 12 maanden = score ≤ 3, 12-24 mnd = 4-6, > 24 mnd of FCF positief = 7-10
- revenueGrowth: baseer op de werkelijke YoY groeicijfers uit SEC data
- dilutionRisk: verhoog dit risico als de schuld hoog is of cash runway kort
- valuationDiscount: gebruik de P/S ratio t.o.v. sectorgenoten

Geef een grondige, genuanceerde analyse. Wees specifiek — noem producten, contracten, klanten, concurrenten bij naam. Vermijd generieke uitspraken.

Retourneer UITSLUITEND een geldig JSON object (geen markdown, geen uitleg):
{
  "summary": "2-3 zinnen executive summary met de kern van de investment case",
  "asymmetricScore": {
    "total": <0-100 gewogen totaalscore>,
    "revenueGrowth": <0-10>,
    "cashRunway": <0-10>,
    "tamSize": <0-10>,
    "competitiveAdvantage": <0-10>,
    "managementQuality": <0-10>,
    "catalystDensity": <0-10>,
    "shortInterest": <0-10, hoog short interest = squeeze potentieel = hogere score>,
    "dilutionRisk": <0-10, laag dilutierisico = hogere score>,
    "sectorTailwind": <0-10>,
    "valuationDiscount": <0-10>
  },
  "riskLevel": "<low|medium|high|very-high>",
  "bullCase": "2-3 zinnen bull scenario met specifieke drivers",
  "bearCase": "2-3 zinnen bear scenario met specifieke risico's",
  "thesis": "4-5 zinnen investment thesis — waarom bestaat de asymmetrie precies?",
  "keyRisks": ["specifiek risico 1", "specifiek risico 2", "specifiek risico 3", "specifiek risico 4"],
  "catalysts": [
    {
      "title": "naam van de catalyst",
      "type": "<Earnings|Product Launch|Regulatory|Investor Day|Contract|Partnership|Launch|FDA Milestone|Financing|Conference>",
      "impact": "<Low|Medium|High|Critical>",
      "period": "bijv. Q3 2026 of H1 2026",
      "confidence": <0-100>
    }
  ],
  "priceTargets": {
    "base": <12-maands basisscenario prijs>,
    "bull": <12-maands bull scenario prijs>,
    "bear": <12-maands bear scenario prijs>
  },
  "newsSignal": "<positive|neutral|negative>",
  "newsHighlight": "1 zin over het belangrijkste nieuws-item of 'Geen significant nieuws' als er niets is"
}`

  const message = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2500,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  })

  const textBlock = message.content.find((b) => b.type === "text")
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Geen tekst-response van Claude")
  }

  const raw = textBlock.text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()
  return JSON.parse(raw) as CompanyAnalysis
}
