"use client";

import { updateLinkStatus } from "@/app/actions";
import { useTransition } from "react";

interface LinkOpenerProps {
  linkId: string;
  url: string;
  currentStatus: "SAVED" | "IN_PROGRESS" | "FINISHED";
  children: React.ReactNode;
  className?: string;
}

export function LinkOpener({ linkId, url, currentStatus, children, className }: LinkOpenerProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Update status to IN_PROGRESS if currently SAVED
    if (currentStatus === "SAVED") {
      startTransition(async () => {
        await updateLinkStatus(linkId, "IN_PROGRESS");
      });
    }

    // Open link in new tab
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <a href={url} onClick={handleClick} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
