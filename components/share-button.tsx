"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  url: string;
  title?: string | null;
  variant?: "icon" | "button";
}

export function ShareButton({ url, title, variant = "icon" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: title || "Check out this link",
      url: url,
    };

    // Try native share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or API not available, fall back to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="h-auto w-auto p-0 hover:bg-transparent"
        title="Share link"
      >
        {copied ? <Check className="size-[18px] text-green-500" /> : <Share2 className="size-[18px]" />}
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare} className="h-9">
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4 text-green-500" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </>
      )}
    </Button>
  );
}
