import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { initialsOf } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph, organizationSchema } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { ContactForm } from "@/components/forms/contact-form";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Contact", href: routes.contact },
];

export const metadata = buildMetadata({
  title: "Contact",
  description: `Talk to the EduWings team. Call ${siteConfig.contact.phone}, email ${siteConfig.contact.email}, or send a message — we reply within two working days.`,
  path: routes.contact,
});

export default function ContactPage() {
  const { contact, founder } = siteConfig;

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS), organizationSchema())} />

      <PageHero
        eyebrow="Contact"
        title="Talk to a person, not a form queue."
        description="Every message here is read by someone on the team. We reply within two working days, and if it is urgent, calling is faster."
        breadcrumbs={BREADCRUMBS}
      />

      <Section>
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* ── Contact details ───────────────────────────────────────── */}
          <div>
            <Reveal className="rounded-3xl border bg-card p-7 shadow-[var(--shadow-lift)]">
              <div className="flex items-center gap-4">
                <Avatar className="size-14">
                  <AvatarFallback className="bg-primary/10 font-display text-lg font-semibold text-primary">
                    {initialsOf(founder.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-display text-lg font-semibold">{founder.name}</p>
                  <p className="text-sm text-muted-foreground">{founder.role}</p>
                </div>
              </div>

              <a
                href={`tel:${founder.phoneE164}`}
                className="mt-6 flex items-center gap-3 rounded-xl bg-primary/5 p-4 transition-colors hover:bg-primary/10"
              >
                <Phone aria-hidden className="size-5 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs tracking-wide text-muted-foreground uppercase">
                    Direct line
                  </span>
                  <span className="font-display text-lg font-semibold">{founder.phone}</span>
                </span>
              </a>
            </Reveal>

            <Reveal delay={0.08} className="mt-6">
              <h2 className="font-display text-lg font-semibold">Other ways to reach us</h2>

              <dl className="mt-5 grid gap-5">
                <div className="flex gap-3.5">
                  <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-medium">General enquiries</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-medium">Schools</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${contact.schoolsEmail}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {contact.schoolsEmail}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <Mail aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-medium">Partnerships and sponsorship</dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${contact.partnershipsEmail}`}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {contact.partnershipsEmail}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-medium">Address</dt>
                    <dd className="mt-1 text-sm text-muted-foreground not-italic">
                      {contact.address.street}
                      <br />
                      {contact.address.locality} {contact.address.postalCode}
                      <br />
                      {contact.address.country}
                    </dd>
                  </div>
                </div>

                <div className="flex gap-3.5">
                  <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-sm font-medium">Office hours</dt>
                    <dd className="mt-1 text-sm text-muted-foreground">{contact.officeHours}</dd>
                  </div>
                </div>
              </dl>
            </Reveal>

            <Reveal delay={0.12} className="mt-8">
              <h2 className="font-display text-lg font-semibold">Follow the programme</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {siteConfig.social.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* ── Form ──────────────────────────────────────────────────── */}
          <Reveal delay={0.06}>
            <div className="rounded-3xl border bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10">
              <h2 className="font-display text-2xl font-bold tracking-tight">Send us a message</h2>
              <p className="mt-2.5 leading-relaxed text-muted-foreground">
                Tell us what you are trying to find out. The more specific you are, the more useful
                our reply will be.
              </p>
              <ContactForm className="mt-8" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ── Map ───────────────────────────────────────────────────────── */}
      <Section tone="surface" size="sm">
        <div className="container-page">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight">Where we are based</h2>
            <p className="mt-2.5 max-w-2xl leading-relaxed text-muted-foreground">
              Our base is in Nairobi, but almost all of our work happens in school halls across the
              country. You do not need to come to us.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border shadow-[var(--shadow-soft)]">
              <iframe
                src={contact.mapEmbedUrl}
                title={`Map showing the location of ${siteConfig.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="aspect-[16/9] w-full border-0 sm:aspect-[21/9]"
              />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              <a
                href={contact.mapLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 transition-colors hover:text-foreground"
              >
                Open in Google Maps
              </a>
            </p>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
