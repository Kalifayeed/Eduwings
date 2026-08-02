"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import { mainNavigation, type NavSection } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchDialog } from "@/components/search/search-dialog";

/**
 * Primary site header.
 *
 * Desktop navigation is a hover/focus-driven mega menu; below `lg` it collapses
 * into a drawer. Accessibility decisions worth noting:
 *
 *  • Each top-level trigger is a real `<button>` with `aria-expanded`, so the
 *    menu is operable by keyboard and announced correctly. Hover opens it for
 *    pointer users; focus opens it for keyboard users; Escape closes it.
 *  • The panel closes on route change, which `usePathname` gives us for free.
 *  • A close delay prevents the panel vanishing while the pointer crosses the
 *    gap between the trigger and the panel.
 */

const CLOSE_DELAY_MS = 120;

function SiteHeader() {
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();
  const [scrolled, setScrolled] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // The open panel is stored with the URL it was opened at. Treating a changed
  // pathname as "closed" collapses the mega menu on navigation as a derivation,
  // instead of an effect that corrects state after the new page has painted.
  const [openAt, setOpenAt] = React.useState<{ label: string; path: string } | null>(null);
  const openSection = openAt?.path === pathname ? openAt.label : null;

  const setOpenSection = React.useCallback(
    (label: string | null) => setOpenAt(label ? { label, path: pathname } : null),
    [pathname],
  );

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    // The initial read is deferred to an animation frame: calling it inline
    // would set state synchronously during the effect and force a second render
    // pass on every mount, and reading `scrollY` post-layout is more accurate.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenSection(null);
      // Cmd/Ctrl+K is the near-universal shortcut for site search.
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpenSection]);

  React.useEffect(() => () => clearTimeout(closeTimer.current ?? undefined), []);

  const open = (label: string) => {
    clearTimeout(closeTimer.current ?? undefined);
    setOpenSection(label);
  };

  const scheduleClose = () => {
    clearTimeout(closeTimer.current ?? undefined);
    closeTimer.current = setTimeout(() => setOpenSection(null), CLOSE_DELAY_MS);
  };

  const isActive = (section: NavSection) =>
    section.items.some((item) => pathname.startsWith(item.href.split("?")[0] ?? item.href)) ||
    (section.href ? pathname === section.href : false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300",
        scrolled || openSection
          ? "border-b glass shadow-[var(--shadow-soft)]"
          : "border-b border-transparent bg-transparent",
      )}
      onMouseLeave={scheduleClose}
    >
      <div className="container-page flex h-[var(--spacing-header)] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-0.5">
            {mainNavigation.map((section) => {
              const expanded = openSection === section.label;
              return (
                <li key={section.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-haspopup="true"
                    onMouseEnter={() => open(section.label)}
                    onFocus={() => open(section.label)}
                    onClick={() => setOpenSection(expanded ? null : section.label)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                      "hover:bg-secondary hover:text-foreground",
                      expanded || isActive(section) ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {section.label}
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)]",
                        expanded && "rotate-180",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSearchOpen(true)}
            aria-label="Search the site"
            className="text-muted-foreground hover:text-foreground"
          >
            <Search className="size-4.5" />
          </Button>
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 hidden sm:inline-flex">
            <Link href={routes.schools}>
              Bring us to your school
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <MobileNav>
            <Button variant="ghost" size="icon-sm" aria-label="Open menu" className="lg:hidden">
              <Menu className="size-5" />
            </Button>
          </MobileNav>
        </div>
      </div>

      <AnimatePresence>
        {openSection ? (
          <motion.div
            key={openSection}
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full hidden border-b lg:block"
            onMouseEnter={() => open(openSection)}
            onMouseLeave={scheduleClose}
          >
            <div className="border-t-0 glass">
              <MegaPanel
                section={mainNavigation.find((item) => item.label === openSection)!}
                onNavigate={() => setOpenSection(null)}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}

function MegaPanel({ section, onNavigate }: { section: NavSection; onNavigate: () => void }) {
  return (
    <div className="container-page grid gap-8 py-8 lg:grid-cols-[1.6fr_1fr]">
      <ul className="grid gap-2 sm:grid-cols-2">
        {section.items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className="group flex gap-3.5 rounded-xl p-3.5 transition-colors hover:bg-secondary/70"
              >
                {Icon ? (
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                  {item.description ? (
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {section.feature ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 p-6 text-white dark:from-sky-800 dark:to-navy-900">
          <div className="absolute -top-8 -right-8 size-32 rounded-full bg-gold-400/20 blur-2xl" />
          <p className="relative font-display text-base leading-snug font-semibold">
            {section.feature.title}
          </p>
          <p className="relative mt-2 text-sm leading-relaxed text-white/80">
            {section.feature.body}
          </p>
          <Link
            href={section.feature.href}
            onClick={onNavigate}
            className="relative mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200"
          >
            {section.feature.cta}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export { SiteHeader };
