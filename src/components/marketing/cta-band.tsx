import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

interface CtaBandProps {
  eyebrow?: string;
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  className?: string;
}

/**
 * Closing call to action. Every page ends with exactly one, so a visitor never
 * reaches the footer without having been offered the next step.
 */
function CtaBand({ eyebrow, title, description, primary, secondary, className }: CtaBandProps) {
  return (
    <section className={cn("container-page", className)}>
      <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-sky-900 to-sky-700 px-8 py-16 text-center sm:px-16 sm:py-20 dark:from-navy-950 dark:via-navy-900 dark:to-sky-900">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-gold-400/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(40rem_20rem_at_50%_120%,oklch(0.685_0.169_237/0.35),transparent_70%)]"
        />

        <div className="relative mx-auto max-w-3xl">
          {eyebrow ? (
            <p className="mb-5 font-mono text-xs tracking-[0.18em] text-gold-300 uppercase">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="font-display text-3xl leading-[1.1] font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75">
            {description}
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="xl" variant="accent">
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            {secondary ? (
              <Button asChild size="xl" variant="glass" className="border-white/25 text-white">
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export { CtaBand };
