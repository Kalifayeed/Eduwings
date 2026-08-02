import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion vocabulary.
 *
 * Animation in EduWings exists to communicate hierarchy and direction of travel
 * — never to decorate. Keeping easing curves and durations in one module means
 * every surface moves with the same physical character, and a single edit
 * retunes the whole product.
 *
 * Note: variants below deliberately omit their own `transition`. Framer Motion
 * gives a variant-level transition precedence over the component's `transition`
 * prop, which would silently discard per-instance delays. Timing is therefore
 * always supplied by the component.
 */

/** Matches `--ease-out-expo` in globals.css so CSS and JS motion agree. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_SOFT = [0.65, 0, 0.35, 1] as const;

export const transitions = {
  fast: { duration: 0.28, ease: EASE_OUT_EXPO },
  base: { duration: 0.5, ease: EASE_OUT_EXPO },
  slow: { duration: 0.85, ease: EASE_OUT_EXPO },
} satisfies Record<string, Transition>;

/** Fade + rise. The default entrance for content blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

/** Parent container that releases its children in sequence. */
export function staggerContainer(stagger = 0.08, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Viewport configuration shared by every scroll-triggered reveal. */
export const viewportOnce = { once: true, amount: 0.2, margin: "0px 0px -80px 0px" } as const;
