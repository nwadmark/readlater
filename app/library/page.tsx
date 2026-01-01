import Link from "next/link"
import { LibraryContent } from "@/components/library-content"

export default function LibraryPage() {
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
            <Link
              href="/"
              className="text-[0.9375rem] font-medium text-foreground/40 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link href="/library" className="text-[0.9375rem] font-medium text-primary transition-colors">
              Library
            </Link>
          </nav>
        </header>

        <LibraryContent />
      </div>
    </div>
  )
}
