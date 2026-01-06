import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddLinkForm from "@/components/add-link-form";
import { listLinks } from "@/app/actions";
import { DeleteLinkButton } from "@/components/delete-link-button";
import { LinkOpener } from "@/components/link-opener";
import { StatusSelector } from "@/components/status-selector";
import { ShareButton } from "@/components/share-button";
import { LinkFavicon } from "@/components/link-favicon";
import { Bookmark } from "lucide-react";
import SignInButton from "@/components/auth/sign-in-button";
import { EditableTitle } from "@/components/editable-title";

// Force dynamic rendering - do not cache across users
export const dynamic = "force-dynamic";

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

export default async function HomePage() {
  const links = await listLinks(); // real data from DB

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-[2.5rem] md:text-[3.5rem] font-extralight tracking-tight text-foreground leading-none">
            ReadLater
          </h1>
          <p className="mb-6 text-[0.875rem] md:text-[0.9375rem] text-[#6b7280] font-light whitespace-nowrap">
            Curate Your Curiosity
          </p>
          <nav className="flex justify-center items-center gap-8">
            <Link href="/" className="text-[0.875rem] font-medium text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/library"
              className="text-[0.875rem] font-medium text-foreground/40 hover:text-primary transition-colors"
            >
              Library
            </Link>
            <SignInButton />
          </nav>
        </header>

        <div className="mb-16">
          <AddLinkForm />
        </div>

        <div>
          <h2 className="mb-6 text-[1.5rem] md:text-[1.75rem] font-extralight tracking-tight text-foreground leading-tight">
            Recently Saved
          </h2>

          {links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 border border-dashed border-[#E0E0E0] rounded-xl bg-[#FAFAFA] transition-opacity duration-200">
              <Bookmark className="size-8 text-[#CCCCCC] stroke-[1.5]" />
              <p className="mt-3 text-[1rem] font-medium text-[#666666]">
                No saved links yet
              </p>
              <p className="mt-1.5 text-[0.875rem] text-[#6b7280]">
                Paste a URL above to save your first link
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {links.slice(0, 10).map((link, index) => (
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
                        <EditableTitle
                          linkId={link.id}
                          title={link.title}
                          url={link.url}
                          className="text-[1.0625rem] font-semibold leading-snug text-balance text-foreground group-hover:text-primary transition-colors"
                        />
                      </LinkOpener>

                      <div className="flex items-center gap-2 text-[0.75rem] text-[#6b7280] font-normal">
                        <span>{hostname(link.url)}</span>
                        <span>·</span>
                        <span>{formatDate(link.createdAt)}</span>
                      </div>

                      {link.synopsis && (
                        <p className="text-[0.875rem] leading-relaxed text-[#666666] font-normal line-clamp-2">
                          {link.synopsis.length > 120 ? `${link.synopsis.slice(0, 120)}...` : link.synopsis}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusSelector linkId={link.id} currentStatus={link.status} />
                      <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
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

          <div className="mt-10 text-center">
            <Link href="/library">
              <Button
                variant="outline"
                className="h-10 px-6 text-sm font-medium border-border/40 bg-transparent hover:bg-muted/30 hover:border-primary/40"
              >
                View All in Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

