"use client"

import { useState } from "react"
import { Brain, Sparkles, ChevronDown, AlertTriangle, Zap } from "lucide-react"
import { companies } from "@/data/mock/companies"
import { aiSummaries } from "@/data/mock/ai-summaries"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Disclaimer } from "@/components/shared/disclaimer"
import { SectorBadge } from "@/components/shared/sector-badge"
import { cn } from "@/lib/utils"

// TODO: Replace mock response with real OpenAI API call
// See /lib/openai/client.ts for the prepared client

export default function AIResearchPage() {
  const [selectedCompanyId, setSelectedCompanyId] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId)
  const aiSummary = aiSummaries.find((s) => s.companyId === selectedCompanyId)

  function handleGenerate() {
    if (!selectedCompanyId) return
    setIsGenerating(true)
    setShowResult(false)
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setShowResult(true)
    }, 2200)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Brain className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-bold text-zinc-100">AI Investment Thesis Generator</h2>
            <p className="text-xs text-zinc-500">Powered by GPT-4o · Structured analysis in seconds</p>
          </div>
          <Badge className="ml-auto" variant="secondary">Mock Mode</Badge>
        </div>
        <p className="text-sm text-zinc-500">
          Select a company to generate a structured investment thesis including bull/bear cases,
          key catalysts, main risks, thesis breakers, and valuation scenarios.
        </p>
        <p className="text-xs text-amber-400/70 mt-2 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Using mock AI responses. Connect your OpenAI API key in <code className="text-xs font-mono bg-zinc-800 px-1 rounded">.env.local</code> to enable live generation.
        </p>
      </div>

      {/* Generator */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h3 className="font-semibold text-zinc-100 mb-4">Generate Analysis</h3>
        <div className="flex gap-3">
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a company…" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="font-mono text-zinc-400 mr-2">{c.ticker}</span>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleGenerate} disabled={!selectedCompanyId || isGenerating} className="gap-2 shrink-0">
            {isGenerating ? (
              <>
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>

        {selectedCompany && (
          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
            <SectorBadge sector={selectedCompany.sector} />
            <span>{selectedCompany.exchange} · {selectedCompany.marketCapCategory} Cap · ${selectedCompany.stockPrice.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Result */}
      {showResult && aiSummary && selectedCompany && (
        <div className="space-y-5 animate-fade-in">
          {/* Summary */}
          <div className="rounded-xl border border-indigo-500/20 bg-zinc-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-indigo-400" />
              <span className="font-semibold text-zinc-100">AI Analysis: {selectedCompany.name}</span>
              <Badge variant="secondary" className="ml-auto text-[10px]">Mock · GPT-4o simulation</Badge>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">{aiSummary.summary}</p>
          </div>

          {/* Bull/Bear */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">🐂 Bull Case</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{aiSummary.bullCase}</p>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">🐻 Bear Case</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{aiSummary.bearCase}</p>
            </div>
          </div>

          {/* Valuation scenarios */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h4 className="font-semibold text-zinc-100 mb-4">Valuation Scenarios</h4>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Bear Target",  value: aiSummary.valuationScenario.bear, color: "text-red-400",    border: "border-red-500/20" },
                { label: "Base Target",  value: aiSummary.valuationScenario.base, color: "text-blue-400",   border: "border-blue-500/20" },
                { label: "Bull Target",  value: aiSummary.valuationScenario.bull, color: "text-emerald-400",border: "border-emerald-500/20" },
              ].map((s) => (
                <div key={s.label} className={cn("rounded-lg border p-4 text-center", s.border)}>
                  <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
                  <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                  <p className="text-xs text-zinc-600 mt-1">vs ${selectedCompany.stockPrice.toFixed(2)} today</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key catalysts + Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h4 className="text-sm font-semibold text-zinc-300 mb-3">Key Catalysts</h4>
              <ul className="space-y-2">
                {aiSummary.keyCatalysts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="text-indigo-400 font-bold shrink-0">{i + 1}.</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h4 className="text-sm font-semibold text-zinc-300 mb-3">Main Risks</h4>
              <ul className="space-y-2">
                {aiSummary.mainRisks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                    <span className="text-red-400 font-bold shrink-0">{i + 1}.</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Thesis breakers */}
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
            <h4 className="text-sm font-semibold text-red-400 mb-3">⚠️ Thesis Breakers</h4>
            <ul className="space-y-2">
              {aiSummary.thesisBreakers.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                  <span className="text-red-400 font-bold shrink-0">✗</span>{b}
                </li>
              ))}
            </ul>
          </div>

          <Disclaimer />
        </div>
      )}

      {/* Feature explanation (when nothing selected) */}
      {!showResult && !isGenerating && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "🎯", title: "Structured Output",   desc: "Bull case, bear case, valuation, catalysts, risks — all in one place" },
            { icon: "⚡", title: "Instant Generation",  desc: "Full thesis generated in seconds using GPT-4o deep research" },
            { icon: "🔒", title: "Not Financial Advice", desc: "AI analysis is for research only. Always do your own due diligence" },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-sm font-semibold text-zinc-300 mb-1">{f.title}</p>
              <p className="text-xs text-zinc-600">{f.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
