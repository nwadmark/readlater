"use client";

import { useState } from "react";
import { DeleteLinkButton } from "@/components/delete-link-button";
import { LinkOpener } from "@/components/link-opener";
import { StatusSelector } from "@/components/status-selector";
import { ShareButton } from "@/components/share-button";
import { LinkFavicon } from "@/components/link-favicon";
import { EditableTitle } from "@/components/editable-title";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import type { LinkStatus } from "@prisma/client";

type Link = {
  id: string;
  url: string;
  title: string | null;
  status: LinkStatus;
  synopsis: string | null;
  createdAt: Date;
};

type LibraryContentProps = {
  links: Link[];
};

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

export default function LibraryContent({ links }: LibraryContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    SAVED: true,
    IN_PROGRESS: true,
    FINISHED: true,
  });
  const [showMoreSections, setShowMoreSections] = useState<Record<string, boolean>>({
    SAVED: false,
    IN_PROGRESS: false,
    FINISHED: false,
  });

  const toggleSection = (status: string) => {
    setExpandedSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const toggleShowMore = (status: string) => {
    setShowMoreSections((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  // Filter links by search query
  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.title?.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query) ||
      link.synopsis?.toLowerCase().includes(query)
    );
  });

  // Group links by status
  const savedLinks = filteredLinks.filter((link) => link.status === "SAVED").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const inProgressLinks = filteredLinks.filter((link) => link.status === "IN_PROGRESS").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const finishedLinks = filteredLinks.filter((link) => link.status === "FINISHED").sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const renderLinkCard = (link: Link, index: number) => (
    <article
      key={link.id}
      className="bg-[#FAFAFA] border border-[#EBEBEB] rounded-lg p-4 transition-all duration-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] group"
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
  );

  const renderSection = (title: string, status: string, sectionLinks: Link[]) => {
    if (sectionLinks.length === 0) return null;

    const isExpanded = expandedSections[status];
    const showMore = showMoreSections[status];
    const displayLinks = showMore ? sectionLinks : sectionLinks.slice(0, 5);
    const hasMore = sectionLinks.length > 5;

    return (
      <div key={status} className="mb-6">
        <button
          onClick={() => toggleSection(status)}
          className="flex items-center gap-2 mb-3 text-[1.25rem] font-medium text-foreground hover:text-primary transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="size-5" />
          ) : (
            <ChevronRight className="size-5" />
          )}
          <span>
            {title} ({sectionLinks.length})
          </span>
        </button>

        {isExpanded && (
          <div className="space-y-3">
            {displayLinks.map((link, index) => renderLinkCard(link, index))}

            {hasMore && (
              <button
                onClick={() => toggleShowMore(status)}
                className="w-full py-2 text-sm text-[#6b7280] hover:text-primary transition-colors"
              >
                {showMore ? "Show less" : `Show ${sectionLinks.length - 5} more`}
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#6b7280]" />
          <input
            type="text"
            placeholder="Search by title or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 text-[0.9375rem] bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg transition-all duration-150 outline-none focus:border-[#3B82F6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
          />
        </div>
      </div>

      {/* Sections */}
      {filteredLinks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#6b7280]">
            {searchQuery ? "No links found matching your search" : "No links yet"}
          </p>
        </div>
      ) : (
        <div>
          {renderSection("To Read", "SAVED", savedLinks)}
          {renderSection("In Progress", "IN_PROGRESS", inProgressLinks)}
          {renderSection("Finished", "FINISHED", finishedLinks)}
        </div>
      )}
    </>
  );
}
