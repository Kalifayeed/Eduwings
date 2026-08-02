"use client";

import { createElement, type ComponentProps } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { fadeIn, fadeUp, scaleIn, staggerContainer, transitions, viewportOnce } from "@/lib/motion";

type RevealPreset = "fade-up" | "fade" | "scale";
type RevealTag = "div" | "section" | "article" | "li" | "ul" | "ol" | "span";

const PRESETS: Record<RevealPreset, Variants> = {
  "fade-up": fadeUp,
  fade: fadeIn,
  scale: scaleIn,
};

/**
 * Motion components are resolved once at module scope.
 *
 * `motion[tag]` reads through a proxy that materialises a component on access,
 * so touching it during render would hand React a component with a fresh
 * identity every time — remounting the subtree and discarding animation state.
 * Building the table up front makes every tag a stable reference.
 */
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  span: motion.span,
} as const satisfies Record<RevealTag, unknown>;

/**
 * These components are polymorphic over their element, which TypeScript cannot
 * narrow from a runtime string. Every member of `MOTION_TAGS` accepts the DOM
 * props used here, so we normalise on `motion.div`'s signature.
 */
type MotionProps = ComponentProps<typeof motion.div>;

/**
 * Renders one of the motion tags.
 *
 * `createElement` rather than `const Component = …; <Component />`: the latter
 * reads as declaring a component inside render, which React's compiler rules
 * reject. This says what is actually happening — creating an element from a
 * component that already exists and never changes identity.
 */
function renderMotion(tag: RevealTag, props: MotionProps) {
  // `children` travels inside `props` rather than as the third argument:
  // `createElement`'s variadic children are typed as `ReactNode`, while a motion
  // component's own `children` also admits a `MotionValue`.
  return createElement(MOTION_TAGS[tag] as typeof motion.div, props);
}

interface RevealProps extends MotionProps {
  preset?: RevealPreset;
  /** Seconds to wait before the entrance begins. */
  delay?: number;
  as?: RevealTag;
}

/**
 * Scroll-triggered entrance. Collapses to an opacity-only fade when the user has
 * asked for reduced motion, and never gates content: the element is present and
 * readable whether or not the animation runs.
 */
function Reveal({ preset = "fade-up", delay = 0, as = "div", children, ...props }: RevealProps) {
  const prefersReduced = useReducedMotion();

  return renderMotion(as, {
    initial: "hidden",
    whileInView: "visible",
    viewport: viewportOnce,
    variants: prefersReduced ? fadeIn : PRESETS[preset],
    transition: { ...transitions.base, delay },
    ...props,
    children,
  });
}

interface RevealGroupProps extends MotionProps {
  stagger?: number;
  delay?: number;
  as?: RevealTag;
}

/**
 * Parent for sequenced reveals. Children should be `RevealItem` — the container
 * owns their timing so individual cards never need to know their own index.
 */
function RevealGroup({
  stagger = 0.08,
  delay = 0,
  as = "div",
  children,
  ...props
}: RevealGroupProps) {
  const prefersReduced = useReducedMotion();

  return renderMotion(as, {
    initial: "hidden",
    whileInView: "visible",
    viewport: viewportOnce,
    variants: staggerContainer(prefersReduced ? 0 : stagger, delay),
    ...props,
    children,
  });
}

interface RevealItemProps extends MotionProps {
  preset?: RevealPreset;
  as?: RevealTag;
}

function RevealItem({ preset = "fade-up", as = "div", children, ...props }: RevealItemProps) {
  const prefersReduced = useReducedMotion();

  return renderMotion(as, {
    variants: prefersReduced ? fadeIn : PRESETS[preset],
    transition: transitions.base,
    ...props,
    children,
  });
}

export { Reveal, RevealGroup, RevealItem };
