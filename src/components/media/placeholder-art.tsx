import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Cog,
  Gauge,
  Globe2,
  GraduationCap,
  Plane,
  RadioTower,
  Radar,
  Users,
  Wind,
} from "lucide-react";

import { cn, hashToIndex } from "@/lib/utils";

/**
 * Designed placeholder artwork.
 *
 * Real photography is not yet available, and stock URLs would introduce an
 * external dependency in the critical rendering path. Instead every image slot
 * falls back to a deterministic, on-brand SVG scene: a sky gradient, cloud
 * banding, a flight-path arc and a subject glyph. It is rendered inline, costs
 * no network request, scales losslessly and themes correctly.
 *
 * Deterministic means the same content item always draws the same scene, so
 * pages do not shuffle between renders or between server and client.
 */

export type ArtTone = "dawn" | "day" | "dusk" | "night" | "gold";
export type ArtMotif =
  | "aircraft"
  | "navigation"
  | "engineering"
  | "tower"
  | "weather"
  | "students"
  | "world"
  | "instruments"
  | "learning"
  | "radar";

const MOTIF_ICONS: Record<ArtMotif, LucideIcon> = {
  aircraft: Plane,
  navigation: Compass,
  engineering: Cog,
  tower: RadioTower,
  weather: Wind,
  students: Users,
  world: Globe2,
  instruments: Gauge,
  learning: GraduationCap,
  radar: Radar,
};

/** Two-stop sky gradients, authored per time-of-day. */
const TONE_STOPS: Record<ArtTone, { from: string; via: string; to: string; glow: string }> = {
  dawn: { from: "#0b2d52", via: "#3f6f9e", to: "#f2b47a", glow: "#ffd9a0" },
  day: { from: "#0a4c85", via: "#2d8ac4", to: "#a8d8f0", glow: "#ffffff" },
  dusk: { from: "#111a3d", via: "#4a3a76", to: "#d97b6c", glow: "#ffc09a" },
  night: { from: "#050d1c", via: "#0d2140", to: "#1d3f6b", glow: "#7fb6e8" },
  gold: { from: "#123a5e", via: "#5b7fa3", to: "#f0c04a", glow: "#fff0c2" },
};

const TONES = Object.keys(TONE_STOPS) as ArtTone[];

export interface PlaceholderArtProps {
  /** Stable string (usually a slug) that selects the tone and layout variant. */
  seed: string;
  motif?: ArtMotif;
  /** Force a tone instead of deriving one from the seed. */
  tone?: ArtTone;
  /** Optional short label burned into the artwork, e.g. a category. */
  label?: string;
  className?: string;
}

function PlaceholderArt({ seed, motif = "aircraft", tone, label, className }: PlaceholderArtProps) {
  const resolvedTone = tone ?? TONES[hashToIndex(seed, TONES.length)] ?? "day";
  const stops = TONE_STOPS[resolvedTone];
  const variant = hashToIndex(`${seed}-layout`, 3);
  const Icon = MOTIF_ICONS[motif];

  // Unique gradient ids — two instances on one page must not share defs.
  const uid = `art-${hashToIndex(seed, 100000).toString(36)}-${motif}`;

  return (
    <div
      className={cn("relative isolate size-full overflow-hidden bg-navy-900", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0.35" y2="1">
            <stop offset="0%" stopColor={stops.from} />
            <stop offset="55%" stopColor={stops.via} />
            <stop offset="100%" stopColor={stops.to} />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx="0.78" cy="0.18" r="0.55">
            <stop offset="0%" stopColor={stops.glow} stopOpacity="0.55" />
            <stop offset="100%" stopColor={stops.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${uid}-cloud`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <rect width="800" height="600" fill={`url(#${uid}-sky)`} />
        <rect width="800" height="600" fill={`url(#${uid}-glow)`} />

        {/* Cloud banding — three layered ellipse clusters, offset per variant. */}
        <g fill={`url(#${uid}-cloud)`}>
          <ellipse cx={120 + variant * 90} cy={430} rx={260} ry={54} />
          <ellipse cx={470 - variant * 60} cy={492} rx={310} ry={62} />
          <ellipse cx={660} cy={548} rx={280} ry={58} />
          <ellipse cx={240 + variant * 40} cy={150} rx={170} ry={30} opacity="0.6" />
        </g>

        {/* Flight-path arc: the visual signature of the brand. */}
        <path
          d={
            variant === 0
              ? "M -20 470 C 180 430, 360 250, 620 130"
              : variant === 1
                ? "M -20 520 C 220 500, 420 300, 700 190"
                : "M -20 400 C 200 380, 380 200, 660 100"
          }
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.42"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="10 14"
        />

        {/* Horizon haze */}
        <rect y="560" width="800" height="40" fill="#ffffff" opacity="0.07" />
      </svg>

      <Icon
        className="absolute top-1/2 left-1/2 size-[42%] max-w-[220px] -translate-x-1/2 -translate-y-1/2 text-white/85 drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
        strokeWidth={1.1}
        aria-hidden
      />

      {label ? (
        <span className="absolute bottom-4 left-4 rounded-full bg-black/35 px-3 py-1 font-mono text-[0.65rem] tracking-widest text-white/90 uppercase backdrop-blur-sm">
          {label}
        </span>
      ) : null}
    </div>
  );
}

export { PlaceholderArt };
