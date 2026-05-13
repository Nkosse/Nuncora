import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Nuncora — Investment Intelligence",
    template: "%s | Nuncora",
  },
  description: "Investment intelligence platform voor asymmetrische kansen in future-tech smallcaps.",
  keywords: ["investment", "smallcap", "stocks", "portfolio", "future-tech", "research"],
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
