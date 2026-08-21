import Link from "next/link";
import { ArrowRight, Compass, Newspaper, Play, Plane } from "lucide-react";

import { routes } from "@/config/routes";
import { impactStatistics } from "@/lib/content/editorial";
import { formatCompactNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HeroSky } from "@/components/marketing/home/hero-sky";

/**
 * Home hero.
 *
 * The headline is server-rendered plain text sitting above an inert decorative
 * backdrop, so the Largest Contentful Paint element is a font-swapped string
 * rather than an image — the single most effective thing we can do for the
 * performance target on this page.
 */
function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100dvh-var(--spacing-header))] items-center overflow-hidden text-navy-50">
      <HeroSky />

      <div className="relative container-page py-20 sm:py-28">
        <div className="max-w-4xl">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-mono text-xs tracking-[0.16em] text-white/85 uppercase backdrop-blur-sm">
              <Compass className="size-3.5" aria-hidden />
              Aviation awareness for Kenyan schools
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.02] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              You cannot become
              <br />
              what you have
              <span className="text-gradient-gold"> never seen.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              EduWings brings aviation into primary and secondary classrooms — the science that
              holds an aircraft up, the fourteen careers behind every departure, and the exact route
              from a school desk in Kenya to a job in the industry.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl" variant="accent">
                <Link href={routes.schools}>
                  Bring EduWings to your school
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="glass" className="border-white/25 text-white">
                <Link href={routes.careers}>
                  <Play className="size-4" />
                  Explore 14 aviation careers
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href={routes.visit}
                className="inline-flex items-center gap-1.5 text-sm text-white/75 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
              >
                <Plane className="size-3.5" aria-hidden />
                Plan an aviation visit
              </Link>
              <Link
                href={routes.news}
                className="inline-flex items-center gap-1.5 text-sm text-white/75 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white"
              >
                <Newspaper className="size-3.5" aria-hidden />
                Read our field notes
              </Link>
            </div>
          </Reveal>

          <RevealGroup
            as="ul"
            delay={0.35}
            stagger={0.06}
            className="mt-16 grid grid-cols-2 gap-x-8 gap-y-6 sm:flex sm:flex-wrap sm:gap-x-12"
          >
            {impactStatistics.map((stat) => (
              <RevealItem as="li" key={stat.label}>
                <p className="font-display text-3xl leading-none font-bold text-white sm:text-4xl">
                  {formatCompactNumber(stat.value)}
                  {stat.suffix ?? ""}
                </p>
                <p className="mt-2 text-xs tracking-wide text-white/60 uppercase">{stat.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

export { Hero };
