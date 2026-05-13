export interface NewsArticle {
  title: string
  summary: string
  url: string
  source: string
  publishedAt: string
}

// Google News RSS — gratis, geen API key nodig
export async function fetchNewsForTicker(ticker: string, companyName: string): Promise<NewsArticle[]> {
  const query = encodeURIComponent(`${ticker} ${companyName} stock`)
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return []

    const xml = await res.text()
    return parseRssItems(xml).slice(0, 8)
  } catch {
    return []
  }
}

function parseRssItems(xml: string): NewsArticle[] {
  const items: NewsArticle[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]

    const title   = stripCdata(extractTag(block, "title") ?? "").trim()
    const link    = (extractTag(block, "link") ?? "").trim()
    const pubDate = (extractTag(block, "pubDate") ?? "").trim()
    const source  = stripCdata(extractTag(block, "source") ?? "").trim()
    const desc    = stripCdata(extractTag(block, "description") ?? "").replace(/<[^>]+>/g, "").trim()

    if (title && link) {
      items.push({
        title,
        summary: desc.slice(0, 300),
        url: link,
        source,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
      })
    }
  }

  return items
}

function extractTag(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`)
  return regex.exec(xml)?.[1] ?? null
}

function stripCdata(s: string): string {
  const m = /^<!\[CDATA\[([\s\S]*)\]\]>$/.exec(s.trim())
  return m ? m[1] : s
}
