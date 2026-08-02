import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Vertical rhythm primitives.
 *
 * Every marketing section on the site is composed from these, which is what
 * keeps spacing, heading scale and eyebrow treatment identical across fifteen
 * pages without any page needing to know the values.
 */

interface SectionProps extends React.ComponentProps<"section"> {
  /** `surface` tints the band; `contrast` inverts it for emphasis. */
  tone?: "default" | "surface" | "contrast";
  /** Vertical padding scale. */
  size?: "sm" | "default" | "lg";
}

const TONES = {
  default: "",
  surface: "bg-surface",
  contrast: "bg-navy-900 text-navy-50 dark:bg-navy-950",
} as const;

const SIZES = {
  sm: "py-14 sm:py-16",
  default: "py-20 sm:py-24",
  lg: "py-24 sm:py-32",
} as const;

function Section({ tone = "default", size = "default", className, ...props }: SectionProps) {
  return <section className={cn(TONES[tone], SIZES[size], className)} {...props} />;
}

interface SectionHeaderProps {
  /** Small label above the heading. Establishes context in one or two words. */
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  /** Heading level. Defaults to `h2`; set to `h1` when this is the page title. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Rendered under the description — usually a call to action. */
  children?: React.ReactNode;
}

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
  children,
}: SectionHeaderProps) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-4 font-mono text-xs font-medium tracking-[0.18em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}

      <Heading
        className={cn(
          "font-display font-bold tracking-tight",
          Heading === "h1"
            ? "text-4xl leading-[1.08] sm:text-5xl lg:text-6xl"
            : "text-3xl leading-[1.12] sm:text-4xl lg:text-[2.75rem]",
        )}
      >
        {title}
      </Heading>

      {description ? (
        <div className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </div>
      ) : null}

      {children ? <div className="mt-8">{children}</div> : null}
    </Reveal>
  );
}

/** Small capitalised label used inside cards and stat tiles. */
function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-mono text-xs font-medium tracking-[0.18em] text-primary uppercase",
        className,
      )}
      {...props}
    />
  );
}

export { Section, SectionHeader, Eyebrow };
