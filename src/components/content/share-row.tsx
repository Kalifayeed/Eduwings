"use client";

import * as React from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

import { siteUrl } from "@/lib/env";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { Button } from "@/components/ui/button";

/**
 * Share controls.
 *
 * Uses the Web Share API where the browser offers it — which on mobile gives the
 * visitor their own apps rather than our guess at which ones they use — and
 * falls back to explicit links plus copy-to-clipboard elsewhere.
 */
function ShareRow({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = React.useState(false);
  const mounted = useIsMounted();
  const url = `${siteUrl}${path}`;

  // Feature detection has to wait for the client: the server has no `navigator`,
  // and rendering the native-share button on both sides would mismatch.
  const canNativeShare = mounted && typeof navigator !== "undefined" && Boolean(navigator.share);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link", { description: url });
    }
  };

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // The visitor dismissed the share sheet. Nothing to report.
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="mr-1 text-xs text-muted-foreground">Share</span>

      {canNativeShare ? (
        <Button variant="ghost" size="icon-sm" onClick={nativeShare} aria-label="Share this page">
          <Share2 className="size-4" />
        </Button>
      ) : (
        <>
          <Button variant="ghost" size="icon-sm" asChild aria-label="Share on X">
            <a
              href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <XIcon />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild aria-label="Share on LinkedIn">
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkedInIcon />
            </a>
          </Button>
        </>
      )}

      <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy link to this page">
        {copied ? <Check className="size-4" /> : <Link2 className="size-4" />}
      </Button>
    </div>
  );
}

/**
 * Lucide removed brand marks from its icon set, so the two we need are inlined.
 * Both are the official simple-icons paths, which are CC0.
 */
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden focusable="false">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden focusable="false">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export { ShareRow };
