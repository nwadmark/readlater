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
      // Fallback for browsers that don't support clipboard API or when permission is denied
      try {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (fallbackErr) {
        // Silent fail - could show a toast notification here in the future
        console.error("Failed to copy to clipboard:", fallbackErr);
      }
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="h-10 w-10 p-2 hover:bg-muted/50"
        title="Share link"
      >
        {copied ? <Check className="size-5 text-green-500" /> : <Share2 className="size-5" />}
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
