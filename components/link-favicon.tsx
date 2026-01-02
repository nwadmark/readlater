"use client";

import { Globe } from "lucide-react";
import { useState } from "react";

interface LinkFaviconProps {
  url: string;
}

export function LinkFavicon({ url }: LinkFaviconProps) {
  const [hasError, setHasError] = useState(false);

  const getDomain = (urlString: string) => {
    try {
      return new URL(urlString).hostname;
    } catch {
      return "";
    }
  };

  const domain = getDomain(url);
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  if (hasError || !domain) {
    return (
      <div className="flex items-center justify-center size-5 rounded bg-muted/50">
        <Globe className="size-3 text-foreground/30" />
      </div>
    );
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      className="size-5 rounded"
      onError={() => setHasError(true)}
    />
  );
}
