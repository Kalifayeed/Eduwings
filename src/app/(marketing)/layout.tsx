import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

/**
 * Public site shell.
 *
 * A route group so that `/admin` and `/login` can use a completely different
 * chrome without the marketing header and footer being conditionally hidden —
 * the pattern that turns into unmaintainable layout branching on every project
 * that skips it.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* First tab stop on every page — WCAG 2.4.1 bypass blocks. */}
      <a
        href="#main"
        className="sr-only bg-primary text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
