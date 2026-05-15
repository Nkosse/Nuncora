"use client"

import { useEffect, useRef } from "react"

type Props = {
  ticker: string
  exchange?: string | null
}

function tvSymbol(ticker: string, exchange?: string | null) {
  const ex = (exchange ?? "").toUpperCase()
  if (["NASDAQ", "NMS", "NGM", "NCM"].includes(ex)) return `NASDAQ:${ticker}`
  if (["NYSE", "NYQ"].includes(ex))                  return `NYSE:${ticker}`
  if (["AMEX", "ASE"].includes(ex))                  return `AMEX:${ticker}`
  if (["OTC", "PINK", "OTC PINK"].includes(ex))      return `OTC:${ticker}`
  return ticker
}

export function PriceChart({ ticker, exchange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.innerHTML = ""

    const script = document.createElement("script")
    script.type = "text/javascript"
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol(ticker, exchange),
      interval: "W",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(9,9,11,0)",
      gridColor: "rgba(255,255,255,0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    })

    el.appendChild(script)
    return () => { if (containerRef.current) containerRef.current.innerHTML = "" }
  }, [ticker, exchange])

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden" style={{ height: 520 }}>
      <div ref={containerRef} className="tradingview-widget-container" style={{ height: "100%", width: "100%" }} />
    </div>
  )
}
