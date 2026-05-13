// ============================================================
// CONVEX — OpenAI Client & AI Thesis Generation
// TODO: Activate when OpenAI API key is configured
// ============================================================

// import OpenAI from 'openai'
// import type { AISummary } from '@/types'

/**
 * Activation steps:
 * 1. npm install openai
 * 2. Set OPENAI_API_KEY in .env.local
 * 3. Uncomment the OpenAI initialization below
 * 4. Implement generateInvestmentThesis with actual API call
 */

// export const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// ── System Prompt ─────────────────────────────────────────────

const INVESTMENT_ANALYST_SYSTEM_PROMPT = `
You are a senior investment analyst specializing in asymmetric opportunities in smallcap and microcap
future-technology stocks. You have deep expertise in:

- Space economy (launch vehicles, satellite infrastructure, lunar economy)
- Quantum computing (trapped-ion, superconducting, photonic qubits)
- AI infrastructure (specialized silicon, power delivery, interconnects)
- Defense technology (autonomous systems, loitering munitions, directed energy)
- Energy transition (solid-state batteries, grid-scale storage, off-grid charging)
- Photonics (PICs, VCSELs, coherent optics, quantum communications)
- Autonomous robotics (sidewalk delivery, warehouse, aerial)

Your investment thesis framework:
1. Identify the asymmetric upside: what does the bull case look like in 3 years?
2. Assess the technology moat: what makes this company defensible?
3. Evaluate management alignment: do insiders own meaningful equity?
4. Stress-test the bear case: what would make the thesis wrong?
5. Identify thesis breakers: specific events that would invalidate the investment

Always be specific, data-driven, and intellectually honest. Acknowledge genuine risks alongside opportunities.
Format your analysis in structured JSON matching the AISummary TypeScript interface.
`.trim()

// ── Core Generation Function ──────────────────────────────────

export async function generateInvestmentThesis(
  companyName: string,
  companyData: Record<string, unknown>
): Promise<string> {
  // TODO: Replace with actual OpenAI API call
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4o',
  //   messages: [
  //     {
  //       role: 'system',
  //       content: INVESTMENT_ANALYST_SYSTEM_PROMPT,
  //     },
  //     {
  //       role: 'user',
  //       content: `Generate a comprehensive investment thesis for ${companyName}.
  //                 Company data: ${JSON.stringify(companyData, null, 2)}
  //
  //                 Return a JSON object matching the AISummary interface:
  //                 {
  //                   summary: string (2-3 paragraphs),
  //                   bullCase: string,
  //                   bearCase: string,
  //                   keyCatalysts: string[] (5 items),
  //                   mainRisks: string[] (5 items),
  //                   thesisBreakers: string[] (4 items),
  //                   valuationScenario: { bull: string, base: string, bear: string }
  //                 }`,
  //     },
  //   ],
  //   response_format: { type: 'json_object' },
  //   temperature: 0.7,
  //   max_tokens: 2000,
  // })
  //
  // return response.choices[0].message.content || ''

  console.warn(
    `[OpenAI] API not configured — returning placeholder for ${companyName}`
  )
  return JSON.stringify({
    summary: `Mock AI analysis for ${companyName}. Connect OpenAI API key to activate.`,
    bullCase: 'Bull case placeholder — activate OpenAI integration.',
    bearCase: 'Bear case placeholder — activate OpenAI integration.',
    keyCatalysts: ['Catalyst 1', 'Catalyst 2', 'Catalyst 3'],
    mainRisks: ['Risk 1', 'Risk 2', 'Risk 3'],
    thesisBreakers: ['Thesis breaker 1', 'Thesis breaker 2'],
    valuationScenario: {
      bull: 'Bull scenario placeholder',
      base: 'Base scenario placeholder',
      bear: 'Bear scenario placeholder',
    },
  })
}

// ── Streaming Thesis Generation ───────────────────────────────

export async function generateInvestmentThesisStream(
  companyName: string,
  companyData: Record<string, unknown>,
  onChunk: (chunk: string) => void
): Promise<void> {
  // TODO: Replace with actual streaming OpenAI call
  // const stream = await openai.chat.completions.create({
  //   model: 'gpt-4o',
  //   messages: [
  //     { role: 'system', content: INVESTMENT_ANALYST_SYSTEM_PROMPT },
  //     { role: 'user', content: `Generate investment thesis for ${companyName}: ${JSON.stringify(companyData)}` },
  //   ],
  //   stream: true,
  // })
  //
  // for await (const chunk of stream) {
  //   const content = chunk.choices[0]?.delta?.content || ''
  //   if (content) onChunk(content)
  // }

  console.warn(`[OpenAI] Streaming not configured for ${companyName}`)
  onChunk(`Mock streaming response for ${companyName}. Connect OpenAI API key.`)
}

// ── Catalyst Summary Generation ───────────────────────────────

export async function summarizeCatalyst(
  catalystTitle: string,
  catalystDescription: string,
  companyContext: string
): Promise<string> {
  // TODO: Replace with actual OpenAI API call for concise catalyst summaries
  // const response = await openai.chat.completions.create({
  //   model: 'gpt-4o-mini',
  //   messages: [
  //     {
  //       role: 'user',
  //       content: `Summarize this catalyst in 2 sentences for an investor dashboard:
  //                 Company: ${companyContext}
  //                 Catalyst: ${catalystTitle}
  //                 Details: ${catalystDescription}`,
  //     },
  //   ],
  //   max_tokens: 150,
  // })
  // return response.choices[0].message.content || catalystDescription

  return catalystDescription
}

export { INVESTMENT_ANALYST_SYSTEM_PROMPT }
