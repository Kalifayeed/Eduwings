import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Home } from "lucide-react";

import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const SUGGESTIONS = [
  { label: "Aviation careers", href: routes.careers, hint: "Fourteen pathways, fully mapped" },
  { label: "Our programme", href: routes.program, hint: "The eight-module curriculum" },
  { label: "For schools", href: routes.schools, hint: "Request a free visit" },
  { label: "News & articles", href: routes.news, hint: "Field notes from the classroom" },
];

/**
 * Root 404.
 *
 * Lives outside the marketing route group so that a bad URL under `/admin`
 * cannot render the public header. It therefore carries its own minimal chrome.
 */
export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-aurora">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <header className="relative container-page flex h-[var(--spacing-header)] items-center">
        <Logo />
      </header>

      <main className="relative container-page flex flex-1 items-center py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-7xl font-bold tracking-tight text-primary sm:text-8xl">
            404
          </p>

          <h1 className="mt-6 font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            This route is not on any chart.
          </h1>

          <p className="mt-5 leading-relaxed text-muted-foreground">
            The page you were looking for has moved, been renamed, or never existed. Nothing is
            broken — you have simply arrived somewhere with no runway.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={routes.home}>
                <Home className="size-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={routes.search}>
                <Compass className="size-4" />
                Search the site
              </Link>
            </Button>
          </div>

          <ul className="mt-14 grid gap-3 text-left sm:grid-cols-2">
            {SUGGESTIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <span>
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{item.hint}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
