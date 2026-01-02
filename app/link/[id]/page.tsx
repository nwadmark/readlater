import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getLink } from "@/app/actions";
import { notFound } from "next/navigation";
import { DeleteLinkButton } from "@/components/delete-link-button";
import { StatusSelector } from "@/components/status-selector";
import { ShareButton } from "@/components/share-button";

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

export default async function LinkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const link = await getLink(id);

  if (!link) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <div className="mb-10 flex items-center justify-between">
          <Link href="/library">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 -ml-2 text-sm font-medium text-foreground/40 hover:text-primary hover:bg-transparent"
            >
              <ArrowLeft className="mr-2 size-3.5" />
              Back to Library
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton url={link.url} title={link.title} variant="button" />
            <DeleteLinkButton linkId={link.id} variant="button" redirectAfterDelete="/library" />
          </div>
        </div>

        <article className="space-y-10">
          <header className="space-y-5">
            <h1 className="text-[2rem] md:text-[2.5rem] font-extralight text-balance leading-[1.15] text-foreground">
              {link.title ?? link.url}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-[0.75rem] text-foreground/40 font-light">
              <span>{hostname(link.url)}</span>
              <span>·</span>
              <span>{formatDate(link.createdAt)}</span>
              <span>·</span>
              <StatusSelector linkId={link.id} currentStatus={link.status} />
            </div>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[0.8125rem] text-foreground/35 hover:text-primary transition-colors font-light"
            >
              <span className="truncate max-w-md">{link.url}</span>
              <ExternalLink className="size-3.5 flex-shrink-0" />
            </a>
          </header>

          <section className="space-y-4 py-6 border-t border-b border-border/30">
            <h2 className="text-[0.6875rem] font-semibold uppercase tracking-widest text-foreground/35">Synopsis</h2>
            {link.synopsis ? (
              <p className="text-[1rem] md:text-[1.0625rem] leading-relaxed text-foreground/70 text-pretty font-light">
                {link.synopsis}
              </p>
            ) : (
              <p className="text-[0.9375rem] leading-relaxed text-foreground/40 italic font-light">
                Synopsis generating...
              </p>
            )}
          </section>
        </article>
      </div>
    </div>
  );
}
