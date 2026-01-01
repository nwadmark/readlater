"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const mockRecentLinks = [
  {
    id: "1",
    title: "How to Build Better Apps",
    url: "https://example.com/better-apps",
    siteName: "Tech Blog",
    synopsis: "A comprehensive guide on modern app development practices.",
    createdAt: "2024-01-15",
    status: "read" as const,
  },
  {
    id: "2",
    title: "The Future of Web Development",
    url: "https://example.com/web-future",
    siteName: "Dev Today",
    synopsis: "Exploring emerging trends in web technologies.",
    createdAt: "2024-01-14",
    status: "saved" as const,
  },
  {
    id: "3",
    title: "Understanding React Server Components",
    url: "https://example.com/rsc",
    siteName: "React News",
    synopsis: "Deep dive into React Server Components and their benefits.",
    createdAt: "2024-01-13",
    status: "listening" as const,
  },
]

const StatusIndicator = ({ status }: { status: "saved" | "read" | "listening" | "watching" }) => {
  const statusConfig = {
    saved: { label: "Saved", color: "text-[var(--status-saved)]" },
    read: { label: "Read", color: "text-[var(--status-read)]" },
    listening: { label: "Listening", color: "text-[var(--status-listening)]" },
    watching: { label: "Watching", color: "text-[var(--status-watching)]" },
  }

  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium tracking-wide ${config.color}`}>
      <span className={`size-1.5 rounded-full ${config.color.replace("text-", "bg-")}`} />
      {config.label}
    </span>
  )
}

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = async () => {
    if (!url.trim()) return

    setIsLoading(true)
    setShowSuccess(false)

    // Placeholder function - will save and summarize the link
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    setShowSuccess(true)
    setUrl("")

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-24 md:py-32">
        <header className="mb-32 text-center">
          <h1 className="mb-6 text-[3.5rem] md:text-[4rem] font-extralight tracking-tight text-foreground leading-[1.05] text-pretty">
            ReadLater
          </h1>
          <p className="text-[1.0625rem] text-foreground/55 leading-relaxed max-w-md mx-auto font-light">
            Your personal thinking space for articles, ideas, and insights worth revisiting
          </p>
          <nav className="mt-12 flex justify-center gap-12">
            <Link href="/" className="text-[0.9375rem] font-medium text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/library"
              className="text-[0.9375rem] font-medium text-foreground/40 hover:text-primary transition-colors"
            >
              Library
            </Link>
          </nav>
        </header>

        <div className="mb-32">
          <div className="space-y-4 mb-8">
            <h2 className="text-[1.75rem] md:text-[2rem] font-extralight tracking-tight text-foreground leading-tight">
              What would you like to save?
            </h2>
            <p className="text-[0.9375rem] text-foreground/50 leading-relaxed font-light">
              Paste a link and we'll create a synopsis for you
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                disabled={isLoading}
                className="flex-1 h-12 text-base border-border/40 bg-card/50 shadow-none"
              />
              <Button onClick={handleSave} disabled={isLoading || !url.trim()} className="h-12 px-8 font-medium">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
            {showSuccess && (
              <p className="text-[0.9375rem] text-[var(--status-saved)] font-medium">Link saved successfully</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-10 text-[1.75rem] md:text-[2rem] font-extralight tracking-tight text-foreground leading-tight">
            Recently Saved
          </h2>
          <div className="space-y-8">
            {mockRecentLinks.map((link, index) => (
              <Link key={link.id} href={`/link/${link.id}`} className="block group">
                <article className="space-y-3 pb-8 border-b border-border/30 last:border-0 transition-all">
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-[1.25rem] md:text-[1.375rem] font-light leading-snug text-balance text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <StatusIndicator status={link.status} />
                  </div>
                  <div className="flex items-center gap-3 text-[0.8125rem] text-foreground/40 font-light">
                    <span>{link.siteName}</span>
                    <span>·</span>
                    <span>{link.createdAt}</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/library">
              <Button
                variant="outline"
                className="h-12 px-8 font-medium border-border/40 bg-transparent hover:bg-muted/30 hover:border-primary/40"
              >
                View All in Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
