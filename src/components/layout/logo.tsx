import Link from "next/link";

import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

/**
 * The EduWings mark: three swept chevrons climbing to the right — a wing in
 * profile and a departure path at once — with a single gold point at the apex
 * standing for the student. Drawn as inline SVG so it inherits currentColor,
 * stays crisp at any size and costs no network request.
 */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      fill="none"
      className={cn("size-8", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="eduwings-mark"
          x1="0"
          y1="32"
          x2="40"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--color-sky-600)" />
          <stop offset="100%" stopColor="var(--color-sky-400)" />
        </linearGradient>
      </defs>
      <path
        d="M1.5 26.5 L18 26.5 L26 15.5"
        stroke="url(#eduwings-mark)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 19 L20 19 L31 8"
        stroke="url(#eduwings-mark)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.72"
      />
      <path
        d="M14 11.5 L23 11.5 L33 3"
        stroke="url(#eduwings-mark)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.44"
      />
      <circle cx="35.5" cy="4" r="3" fill="var(--color-gold-400)" />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  /** Hide the wordmark and render the mark alone (used in tight spaces). */
  markOnly?: boolean;
  /** Renders a plain element instead of a link — for the footer's own heading. */
  asLink?: boolean;
}

function Logo({ className, markOnly = false, asLink = true }: LogoProps) {
  const content = (
    <>
      <LogoMark />
      {markOnly ? null : (
        <span className="font-display text-lg leading-none font-extrabold tracking-tight text-foreground">
          Edu<span className="text-primary">Wings</span>
        </span>
      )}
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5", className);

  if (!asLink) {
    return (
      <span className={classes}>
        <span className="sr-only">{siteConfig.name}</span>
        {content}
      </span>
    );
  }

  return (
    <Link
      href={routes.home}
      className={cn(classes, "rounded-lg")}
      aria-label={`${siteConfig.name} — home`}
    >
      {content}
    </Link>
  );
}

export { Logo, LogoMark };
