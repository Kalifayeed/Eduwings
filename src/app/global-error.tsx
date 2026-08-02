"use client";

import * as React from "react";

import { logger } from "@/lib/logger";

/**
 * Last-resort boundary for failures in the root layout itself.
 *
 * This replaces the entire document, so it must render its own `<html>` and
 * `<body>` and cannot rely on the design system — the stylesheet is part of what
 * may have failed. Styles are therefore inline and deliberately minimal.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    logger.error("global.error", error, { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
          background: "#0a1424",
          color: "#f1f5f9",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#7dd3fc",
            }}
          >
            EduWings
          </p>

          <h1 style={{ margin: "1.25rem 0 0", fontSize: "1.75rem", lineHeight: 1.2 }}>
            The application failed to load.
          </h1>

          <p style={{ margin: "1rem 0 0", lineHeight: 1.7, color: "rgba(241,245,249,0.72)" }}>
            Something went wrong before the page could render. Reloading usually resolves it.
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "#38bdf8",
              color: "#0a1424",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload the page
          </button>

          {error.digest ? (
            <p
              style={{
                margin: "1.5rem 0 0",
                fontSize: "0.75rem",
                fontFamily: "ui-monospace, monospace",
                color: "rgba(241,245,249,0.5)",
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
