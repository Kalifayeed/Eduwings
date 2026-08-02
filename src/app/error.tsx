"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary.
 *
 * Next.js renders this in place of the failed segment while keeping the rest of
 * the layout mounted. The digest is surfaced deliberately: it is the only handle
 * a visitor can quote that lets us find their exact failure in the logs, and it
 * leaks nothing about the underlying error.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    logger.error("route.error", error, { digest: error.digest });
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] items-center py-20">
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" aria-hidden />
        </span>

        <h1 className="mt-7 font-display text-3xl leading-tight font-bold tracking-tight">
          Something went wrong on our side.
        </h1>

        <p className="mt-5 leading-relaxed text-muted-foreground">
          This is our fault, not yours. Trying again usually works — the problem is often momentary.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} size="lg">
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={routes.home}>
              <Home className="size-4" />
              Back to home
            </Link>
          </Button>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Still stuck? Call us on{" "}
          <a
            href={`tel:${siteConfig.contact.phoneE164}`}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {siteConfig.contact.phone}
          </a>
          .
        </p>

        {error.digest ? (
          <p className="mt-4 font-mono text-xs text-muted-foreground">Reference: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
