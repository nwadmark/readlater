import Link from "next/link";
import { listLinks } from "@/app/actions";
import { DeleteLinkButton } from "@/components/delete-link-button";
import { LinkOpener } from "@/components/link-opener";
import { StatusSelector } from "@/components/status-selector";
import { ShareButton } from "@/components/share-button";
import { LinkFavicon } from "@/components/link-favicon";
import { BookOpen } from "lucide-react";

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default async function LibraryPage() {
  const links = await listLinks();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <header className="mb-10">
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="text-[2rem] md:text-[2.5rem] font-extralight tracking-tight text-foreground">
              Library
            </h1>
            <nav className="flex gap-8">
              <Link href="/" className="text-[0.875rem] font-medium text-foreground/40 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/library" className="text-[0.875rem] font-medium text-primary transition-colors">
                Library
              </Link>
            </nav>
          </div>
          <p className="text-[0.875rem] text-foreground/45 font-light">
            Everything you've saved.
          </p>
        </header>

        {links.length === 0 ? (
          <div className="max-w-[400px] mx-auto mt-20 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-[#D4D4D4] stroke-[1.5]" />
            <h3 className="mt-5 text-[1.125rem] font-medium text-[#444444]">
              Your library is empty
            </h3>
            <p className="mt-2 max-w-[320px] mx-auto text-[0.9375rem] leading-relaxed text-[#888888]">
              Links you save will appear here. You can organize them by status and revisit them anytime.
            </p>
            <Link href="/">
              <button className="mt-6 px-6 py-3 bg-white border border-[#E0E0E0] rounded-lg text-[0.875rem] font-medium text-[#333333] transition-all duration-150 hover:bg-[#FAFAFA] hover:border-[#CCCCCC]">
                Save your first link
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link, index) => (
              <article
                key={link.id}
                className="bg-[#FAFAFA] border border-[#EBEBEB] rounded-lg p-4 transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] group animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms`, animationDuration: "300ms", animationFillMode: "both" }}
              >
                <div className="flex items-start gap-3">
                  <LinkFavicon url={link.url} />

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <LinkOpener
                      linkId={link.id}
                      url={link.url}
                      currentStatus={link.status}
                      className="block"
                    >
                      <h3 className="text-[1.0625rem] font-semibold leading-snug text-balance text-foreground group-hover:text-primary transition-colors">
                        {link.title ?? link.url}
                      </h3>
                    </LinkOpener>

                    <div className="flex items-center gap-2 text-[0.75rem] text-foreground/40 font-normal">
                      <span>{hostname(link.url)}</span>
                      <span>·</span>
                      <span>{formatDate(link.createdAt)}</span>
                    </div>

                    {link.synopsis && (
                      <p className="text-[0.875rem] leading-relaxed text-[#666666] font-normal line-clamp-2">
                        {link.synopsis.length > 120 ? `${link.synopsis.slice(0, 120)}...` : link.synopsis}
                      </p>
                    )}

                    {!link.synopsis && (
                      <p className="text-[0.875rem] leading-relaxed text-foreground/35 italic font-light animate-pulse">
                        Synopsis generating...
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusSelector linkId={link.id} currentStatus={link.status} />
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="text-[#999999] hover:text-[#333333] transition-colors">
                        <ShareButton url={link.url} title={link.title} variant="icon" />
                      </div>
                      <div className="text-[#999999] hover:text-[#333333] transition-colors">
                        <DeleteLinkButton linkId={link.id} variant="icon" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

