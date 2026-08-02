"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Animated hero backdrop.
 *
 * Three composited layers — an atmospheric gradient, drifting cloud banks, and a
 * departure path traced by an aircraft. Everything is vector and CSS: no image
 * request competes with the LCP text, which is what keeps the largest visual
 * element on the site from costing anything measurable.
 *
 * The cloud bands are rendered twice and translated by exactly -50%, so the
 * `drift` keyframe loops with no visible seam.
 *
 * Under `prefers-reduced-motion` the layers render in their final state and
 * nothing moves. The composition still reads; only the motion is removed.
 */

const FLIGHT_PATH = "M -40 520 C 220 500, 460 330, 700 210 C 900 108, 1120 70, 1320 44";

function CloudBank({ opacity, y, scale }: { opacity: number; y: number; scale: number }) {
  return (
    <g opacity={opacity} transform={`translate(0 ${y}) scale(${scale} ${scale})`}>
      {[0, 1440].map((offset) => (
        <g key={offset} transform={`translate(${offset} 0)`}>
          <ellipse cx="180" cy="60" rx="230" ry="42" />
          <ellipse cx="520" cy="34" rx="180" ry="32" />
          <ellipse cx="880" cy="66" rx="260" ry="46" />
          <ellipse cx="1240" cy="40" rx="200" ry="34" />
        </g>
      ))}
    </g>
  );
}

function HeroSky() {
  const prefersReduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Atmospheric gradient — horizon warmth at the base, altitude at the top. */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-sky-900 to-sky-700" />
      <div className="absolute inset-0 bg-[radial-gradient(70rem_45rem_at_78%_8%,oklch(0.855_0.158_87/0.22),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(55rem_38rem_at_12%_92%,oklch(0.685_0.169_237/0.28),transparent_65%)]" />

      {/* Cloud banks */}
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 size-full"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id="hero-cloud" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        <g fill="url(#hero-cloud)">
          <g
            className={prefersReduced ? undefined : "animate-drift"}
            style={{ animationDuration: "68s" }}
          >
            <CloudBank opacity={0.5} y={430} scale={1} />
          </g>
          <g
            className={prefersReduced ? undefined : "animate-drift"}
            style={{ animationDuration: "46s" }}
          >
            <CloudBank opacity={0.75} y={505} scale={1.15} />
          </g>
        </g>

        {/* Departure path */}
        <motion.path
          d={FLIGHT_PATH}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 12"
          initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
      </svg>

      {/* Aircraft tracing the departure path. */}
      <motion.div
        className="absolute inset-0"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <svg
          viewBox="0 0 1440 600"
          preserveAspectRatio="xMidYMax slice"
          className="absolute inset-0 size-full"
          role="presentation"
          focusable="false"
        >
          <motion.g
            initial={prefersReduced ? { offsetDistance: "100%" } : { offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            style={{ offsetPath: `path("${FLIGHT_PATH}")`, offsetRotate: "auto" }}
          >
            {/* A compact airliner silhouette, drawn nose-right. */}
            <path
              d="M 16 0 L -2 -4 L -6 -4 L -3 -1 L -12 -1 L -16 -7 L -19 -7 L -17 -1 L -20 0 L -17 1 L -19 7 L -16 7 L -12 1 L -3 1 L -6 4 L -2 4 Z"
              fill="#ffffff"
              opacity="0.95"
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Base fade so headline text always has contrast to sit on. */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/70 to-transparent" />
    </div>
  );
}

export { HeroSky };
