"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createLink } from "@/app/actions";
import { Check } from "lucide-react";

export default function AddLinkForm() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();
  const [urlError, setUrlError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (urlError) setUrlError(null); // Clear error on typing
  };

  const handleSave = () => {
    if (!url.trim()) return;

    // Auto-add https:// if missing
    let processedUrl = url.trim();
    if (!processedUrl.match(/^https?:\/\//i)) {
      processedUrl = `https://${processedUrl}`;
    }

    // Validate URL
    if (!isValidUrl(processedUrl)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    setUrlError(null);
    setShowSuccess(false);

    startTransition(async () => {
      const result = await createLink(processedUrl, title || undefined);

      if (result.ok) {
        setUrl("");
        setTitle("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
        // Return focus to URL input for quick consecutive saves
        setTimeout(() => urlInputRef.current?.focus(), 100);
      } else {
        setUrlError(result.error ?? "Failed to save");
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isPending && url.trim()) {
      handleSave();
    }
  };

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-[1.5rem] md:text-[1.75rem] font-extralight tracking-tight text-foreground leading-tight">
            What would you like to save?
          </h2>
          <p className="text-[0.875rem] text-[#6b7280]">
            Add a link and optionally give it a descriptive title
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <input
              ref={urlInputRef}
              type="url"
              placeholder="Paste a URL..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              className={`w-full h-12 px-4 text-[0.9375rem] bg-[#FAFAFA] border rounded-lg transition-all duration-150 outline-none ${
                urlError
                  ? "border-red-500"
                  : "border-[#E0E0E0] focus:border-[#3B82F6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]"
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            />
            {urlError && (
              <p className="mt-1.5 text-[0.8125rem] text-[#DC2626]">{urlError}</p>
            )}
          </div>

          <input
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            className={`w-full h-12 px-4 text-[0.9375rem] bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg transition-all duration-150 outline-none focus:border-[#3B82F6] focus:bg-white focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />

          <button
            onClick={handleSave}
            disabled={isPending || !url.trim()}
            className={`w-full h-12 rounded-lg text-[0.9375rem] font-medium transition-all duration-150 ${
              showSuccess
                ? "bg-[#16A34A] text-white"
                : isPending || !url.trim()
                ? "bg-[#E5E5E5] text-[#999999] cursor-not-allowed"
                : "bg-[#2563EB] text-white hover:bg-[#1D4ED8] active:scale-[0.98]"
            }`}
          >
            {showSuccess ? (
              <span className="inline-flex items-center gap-2">
                <Check className="size-4" />
                Saved!
              </span>
            ) : isPending ? (
              "Saving..."
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
