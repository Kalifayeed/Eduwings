"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { formatCompactNumber } from "@/lib/utils";

interface CountUpProps {
  value: number;
  suffix?: string;
  durationSeconds?: number;
}

/**
 * Counts a figure up when it scrolls into view.
 *
 * The final value is rendered on the server and in the initial client paint, so
 * the number is correct and readable before any JavaScript runs — the animation
 * only replaces an already-correct value. Under reduced motion it never starts.
 */
function CountUp({ value, suffix = "", durationSeconds = 1.6 }: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = React.useState(value);
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    if (!inView || prefersReduced || hasRun.current) return;
    hasRun.current = true;

    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return () => controls.stop();
  }, [inView, prefersReduced, value, durationSeconds]);

  return (
    <span ref={ref}>
      {formatCompactNumber(display)}
      {suffix}
    </span>
  );
}

export { CountUp };
