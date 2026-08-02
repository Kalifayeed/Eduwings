import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

/**
 * Default social sharing image, generated at build time.
 *
 * Rendering the card rather than shipping a static PNG means it stays in sync
 * with the brand automatically, and the same primitive can later generate
 * per-article cards. Only inline styles and a flex layout are available inside
 * `ImageResponse` — this is Satori, not a browser.
 */
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #071427 0%, #0d3a63 55%, #1173ad 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Departure path — the brand's visual signature. */}
      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M -40 540 C 240 500, 520 340, 780 220 C 940 148, 1080 108, 1240 70"
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="3"
          strokeDasharray="12 16"
          strokeLinecap="round"
        />
        <circle cx="1080" cy="112" r="9" fill="#f5b301" />
      </svg>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            width: 14,
            height: 44,
            borderRadius: 999,
            background: "#f5b301",
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {siteConfig.name}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          You cannot become what you have never seen.
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.78)",
            maxWidth: 800,
          }}
        >
          Aviation awareness for primary and secondary schools across Kenya.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 40,
          fontSize: 22,
          color: "rgba(255,255,255,0.62)",
        }}
      >
        <div style={{ display: "flex" }}>12,400+ students</div>
        <div style={{ display: "flex" }}>86 schools</div>
        <div style={{ display: "flex" }}>14 career pathways</div>
      </div>
    </div>,
    size,
  );
}
