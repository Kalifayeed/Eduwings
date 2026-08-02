import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { footerNavigation, legalNavigation } from "@/config/navigation";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

/**
 * Site footer. Server-rendered — only the newsletter form inside it is
 * interactive, so the rest costs nothing on the client.
 */
function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t bg-surface">
      {/* Newsletter band — the last conversion opportunity on every page. */}
      <div className="container-page">
        <div className="relative -mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 via-sky-800 to-navy-900 p-8 shadow-[var(--shadow-float)] sm:p-12">
          <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 size-64 rounded-full bg-sky-400/20 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <h2 className="font-display text-2xl leading-tight font-bold text-white sm:text-3xl">
                One email a term. Nothing else.
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75">
                Where we have been, what students asked us, and which schools we are visiting next.
                No fundraising drives, no newsletters about newsletters.
              </p>
            </div>
            <NewsletterForm source="footer" />
          </div>
        </div>
      </div>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_2.6fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {siteConfig.shortDescription}
          </p>

          <address className="mt-6 grid gap-3 text-sm not-italic">
            <a
              href={`tel:${siteConfig.contact.phoneE164}`}
              className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone aria-hidden className="size-4 shrink-0 text-primary" />
              {siteConfig.contact.phone}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail aria-hidden className="size-4 shrink-0 text-primary" />
              {siteConfig.contact.email}
            </a>
            <span className="inline-flex items-start gap-2.5 text-muted-foreground">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                {siteConfig.contact.address.street}
                <br />
                {siteConfig.contact.address.locality}, {siteConfig.contact.address.country}
              </span>
            </span>
          </address>

          <ul className="mt-6 flex flex-wrap gap-2">
            {siteConfig.social.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerNavigation.map((column) => (
            <div key={column.label}>
              <h3 className="font-display text-sm font-semibold text-foreground">{column.label}</h3>
              <ul className="mt-4 grid gap-2.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.legalName}. Founded by{" "}
            <Link href={routes.about} className="underline-offset-4 hover:text-foreground">
              {siteConfig.founder.name}
            </Link>
            .
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export { SiteFooter };
