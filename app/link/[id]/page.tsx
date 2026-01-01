import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"

const mockLinkData: Record<
  string,
  {
    id: string
    title: string
    url: string
    siteName: string
    tldr: string
    bulletPoints: string[]
    createdAt: string
    status: "saved" | "read" | "listening" | "watching"
  }
> = {
  "1": {
    id: "1",
    title: "How to Build Better Apps",
    url: "https://example.com/better-apps",
    siteName: "Tech Blog",
    tldr: "A comprehensive guide covering modern app development practices with focus on architecture, testing, and deployment.",
    bulletPoints: [
      "Start with a solid architecture using modular design patterns",
      "Implement comprehensive testing strategies including unit, integration, and e2e tests",
      "Use continuous integration and deployment pipelines for reliable releases",
      "Focus on performance optimization and monitoring from day one",
      "Prioritize user experience with accessibility and responsive design",
      "Document your code and maintain clear communication with your team",
    ],
    createdAt: "2024-01-15",
    status: "read",
  },
  "2": {
    id: "2",
    title: "The Future of Web Development",
    url: "https://example.com/web-future",
    siteName: "Dev Today",
    tldr: "Exploring emerging trends in web technologies including AI integration, edge computing, and the evolution of frameworks.",
    bulletPoints: [
      "AI-powered development tools are transforming how we write code",
      "Edge computing brings computation closer to users for better performance",
      "Progressive enhancement ensures apps work across all devices",
      "Web components are becoming standard for reusable UI elements",
    ],
    createdAt: "2024-01-14",
    status: "saved",
  },
  "3": {
    id: "3",
    title: "Understanding React Server Components",
    url: "https://example.com/rsc",
    siteName: "React News",
    tldr: "Deep dive into React Server Components explaining how they improve performance and simplify data fetching patterns.",
    bulletPoints: [
      "Server Components render on the server reducing client-side JavaScript",
      "Automatic code splitting improves initial page load times",
      "Direct access to backend resources without additional API layers",
      "Better separation between server and client code improves maintainability",
      "Streaming support enables faster time-to-first-byte",
    ],
    createdAt: "2024-01-13",
    status: "listening",
  },
}

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

export default async function LinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const link = mockLinkData[id] || mockLinkData["1"]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-24 md:py-32">
        <div className="mb-16">
          <Link href="/library">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 -ml-2 font-medium text-foreground/40 hover:text-primary hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Library
            </Button>
          </Link>
        </div>

        <article className="space-y-16">
          <header className="space-y-8">
            <h1 className="text-[2.5rem] md:text-[3rem] font-extralight text-balance leading-[1.15] text-foreground">
              {link.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[0.8125rem] text-foreground/40 font-light">
              <span>{link.siteName}</span>
              <span>·</span>
              <span>{link.createdAt}</span>
              <span>·</span>
              <StatusIndicator status={link.status} />
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[0.875rem] text-foreground/35 hover:text-primary transition-colors font-light"
            >
              <span className="truncate max-w-md">{link.url}</span>
              <ExternalLink className="size-3.5 flex-shrink-0" />
            </a>
          </header>

          <section className="space-y-6 py-8 border-t border-b border-border/30">
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-foreground/35">TL;DR</h2>
            <p className="text-[1.125rem] md:text-[1.1875rem] leading-relaxed text-foreground/70 text-pretty font-light">
              {link.tldr}
            </p>
          </section>

          <section className="space-y-8">
            <h2 className="text-[0.75rem] font-semibold uppercase tracking-widest text-foreground/35">Synopsis</h2>
            <ul className="space-y-6">
              {link.bulletPoints.map((point, index) => (
                <li key={index} className="flex gap-6 leading-relaxed">
                  <span className="text-foreground/25 mt-2 text-[0.625rem]">•</span>
                  <span className="text-[1rem] md:text-[1.0625rem] text-foreground/65 flex-1 leading-relaxed text-pretty font-light">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </div>
  )
}
