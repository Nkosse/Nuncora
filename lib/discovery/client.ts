import { anthropic } from "@/lib/anthropic/client"
import { getCompanyProfile } from "@/lib/fmp/client"

export interface DiscoveredTicker {
  ticker: string
  rationale: string
}

const DISCOVERY_CRITERIA = `
Je bent een expert in future-tech smallcap investing. Genereer een lijst van US-genoteerde bedrijven die voldoen aan ALLE volgende criteria:

MARKT:
- Beursgenoteerd in de VS (NASDAQ, NYSE, NYSE American)
- Market cap tussen $50M en $5B (smallcap tot small-midcap)
- Actief verhandeld (geen zombie stocks)

SECTOR (minimaal één van):
- Space economy: raketten, satellieten, space infrastructure, satellite IoT
- Quantum computing & quantum sensing
- AI-hardware & AI-infrastructure (chips, data centers, edge computing)
- Autonome systemen: drones, robotics, zelfrijdende voertuigen
- Geavanceerde energieopslag: solid-state batteries, next-gen EV tech
- Defense tech & cybersecurity: hypersonics, directed energy, zero-trust
- Photonics & optical computing
- eVTOL & advanced air mobility
- Biotech met platform-technologie (geen pure drug plays)
- Quantum-safe cryptography & post-quantum security

ASYMMETRISCH POTENTIEEL:
- Technologie die potentieel een bestaande markt kan ontwrichten
- Niet al volledig gewaardeerd door de markt (geen $50B+ largecaps)
- Heeft identificeerbare catalysts in de komende 12-18 maanden
- Managementteam met execution track record

UITSLUITINGEN:
- Pure SaaS/software zonder hardware-moat
- Retail, vastgoed, financiële diensten
- Bedrijven zonder duidelijke technologische differentiatie
- Bedrijven met minder dan 12 maanden cash runway
`

export async function discoverCandidates(): Promise<DiscoveredTicker[]> {
  const today = new Date().toISOString().split("T")[0]

  const message = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2000,
    thinking: { type: "adaptive" },
    messages: [
      {
        role: "user",
        content: `Vandaag is het ${today}.

${DISCOVERY_CRITERIA}

Genereer een lijst van 40-60 bedrijven die aan deze criteria voldoen. Denk breed — neem ook minder bekende namen mee die institutionele beleggers nog niet volledig ontdekt hebben. Dat is precies waar de asymmetrie zit.

Retourneer UITSLUITEND een JSON array (geen markdown, geen uitleg):
[
  { "ticker": "RKLB", "rationale": "1 zin waarom dit bedrijf past" },
  { "ticker": "IONQ", "rationale": "..." },
  ...
]`,
      },
    ],
  })

  const textBlock = message.content.find((b) => b.type === "text")
  if (!textBlock || textBlock.type !== "text") return []

  const raw = textBlock.text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim()

  try {
    return JSON.parse(raw) as DiscoveredTicker[]
  } catch {
    return []
  }
}

export async function validateAndFilterTickers(
  candidates: DiscoveredTicker[],
  existingTickers: string[]
): Promise<{ ticker: string; rationale: string; marketCap: number; name: string }[]> {
  const validated: { ticker: string; rationale: string; marketCap: number; name: string }[] = []
  const existingSet = new Set(existingTickers.map((t) => t.toUpperCase()))

  // Valideer in batches van 5 om FMP rate limits te respecteren
  const batchSize = 5
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize)

    const results = await Promise.allSettled(
      batch.map(async (candidate) => {
        if (existingSet.has(candidate.ticker.toUpperCase())) return null

        const profile = await getCompanyProfile(candidate.ticker)
        if (!profile) return null

        // Filter op market cap $50M - $5B
        if (profile.marketCap < 50_000_000 || profile.marketCap > 5_000_000_000) return null

        // Moet actief verhandeld worden
        if (!profile.isActivelyTrading) return null

        return {
          ticker: candidate.ticker.toUpperCase(),
          rationale: candidate.rationale,
          marketCap: profile.marketCap,
          name: profile.companyName,
        }
      })
    )

    for (const result of results) {
      if (result.status === "fulfilled" && result.value !== null) {
        validated.push(result.value)
      }
    }

    // Kleine pauze tussen batches
    if (i + batchSize < candidates.length) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  return validated
}
