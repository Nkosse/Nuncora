import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Convex — AI-Powered Investment Intelligence",
    template: "%s | Convex",
  },
  description: "AI-powered intelligence platform for asymmetric investment opportunities in future-tech smallcaps.",
  keywords: ["investment", "smallcap", "AI analysis", "stocks", "portfolio", "future-tech"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 antialiased h-full">
        {children}
      </body>
    </html>
  )
}
