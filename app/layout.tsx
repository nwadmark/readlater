import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReadLater — Curate Your Curiosity",
  description: "A calm place to save and organize links you want to read later.",
  generator: "v0.app",
  openGraph: {
    title: "ReadLater — Curate Your Curiosity",
    description: "A calm place to save and organize links you want to read later.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ReadLater — Curate Your Curiosity",
    description: "A calm place to save and organize links you want to read later.",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
          <footer className="py-8 text-center">
            <p className="text-sm text-[#6b7280]">ReadLater — a calm place to think.</p>
          </footer>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
