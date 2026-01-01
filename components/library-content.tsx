"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Search } from "lucide-react"

const mockAllLinks = [
  {
    id: "1",
    title: "How to Build Better Apps",
    url: "https://example.com/better-apps",
    siteName: "Tech Blog",
    synopsis:
      "A comprehensive guide on modern app development practices including architecture, testing, and deployment strategies.",
    createdAt: "2024-01-15",
    status: "read" as const,
  },
  {
    id: "2",
    title: "The Future of Web Development",
    url: "https://example.com/web-future",
    siteName: "Dev Today",
    synopsis:
      "Exploring emerging trends in web technologies such as AI integration, edge computing, and progressive enhancement.",
    createdAt: "2024-01-14",
    status: "saved" as const,
  },
  {
    id: "3",
    title: "Understanding React Server Components",
    url: "https://example.com/rsc",
    siteName: "React News",
    synopsis:
      "Deep dive into React Server Components and their benefits for performance and user experience in modern applications.",
    createdAt: "2024-01-13",
    status: "listening" as const,
  },
  {
    id: "4",
    title: "CSS Grid Mastery",
    url: "https://example.com/css-grid",
    siteName: "Frontend Weekly",
    synopsis:
      "Complete tutorial on CSS Grid including practical examples and common layout patterns for responsive design.",
    createdAt: "2024-01-12",
    status: "watching" as const,
  },
  {
    id: "5",
    title: "TypeScript Best Practices",
    url: "https://example.com/typescript",
    siteName: "Code Quality",
    synopsis:
      "Learn essential TypeScript patterns and practices to write safer, more maintainable code in large projects.",
    createdAt: "2024-01-11",
    status: "read" as const,
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

export function LibraryContent() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter links based on search query
  const filteredLinks = mockAllLinks.filter(
    (link) =>
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="mb-16">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/30" />
          <Input
            type="search"
            placeholder="Search your saved items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 text-base border-border/40 bg-card/50 shadow-none"
          />
        </div>
      </div>

      <div>
        <h2 className="mb-10 text-[1.75rem] md:text-[2rem] font-extralight tracking-tight text-foreground leading-tight">
          All Saved Items <span className="text-foreground/35 font-light">({filteredLinks.length})</span>
        </h2>
        <div className="space-y-8">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((link) => (
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
                  <p className="text-[0.9375rem] leading-relaxed text-foreground/55 text-pretty font-light">
                    {link.synopsis}
                  </p>
                </article>
              </Link>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-base text-foreground/40 font-light">No items found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
