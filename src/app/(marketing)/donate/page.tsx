import { Banknote, HeartHandshake, Receipt, ShieldCheck } from "lucide-react";

import { routes } from "@/config/routes";
import { formatCurrency } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section, SectionHeader } from "@/components/marketing/section";
import { DonationForm } from "@/components/forms/donation-form";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "Donate", href: routes.donate },
];

export const metadata = buildMetadata({
  title: "Donate",
  description:
    "KES 45,000 funds a full EduWings day for up to 300 students, materials included. See exactly what your gift buys.",
  path: routes.donate,
});

/** What money buys, stated in units a donor can picture. */
const IMPACT_TIERS = [
  {
    amount: 2500,
    title: "Materials for one classroom",
    body: "Wing-building kits, charts and career maps for a class of sixty. Consumed in a single session and left behind with the school.",
  },
  {
    amount: 12000,
    title: "A simulator session",
    body: "Transport, setup and running of the flight simulators for one school day — the activity students talk about for weeks afterwards.",
  },
  {
    amount: 45000,
    title: "A full school day",
    body: "One complete EduWings visit for up to 300 students. Travel, materials, simulators and a working aviation professional, all included.",
  },
  {
    amount: 180000,
    title: "A whole term upcountry",
    body: "Four visits in counties where no student has previously met an aviation professional. This is the work that matters most and is hardest to fund.",
  },
] as const;

const ASSURANCES = [
  {
    icon: Banknote,
    title: "No overheads taken first",
    body: "Programme costs come out of core funding. Donations go to visits, materials and travel.",
  },
  {
    icon: Receipt,
    title: "A receipt for everything",
    body: "Issued as soon as the gift clears, whether it arrives by M-Pesa or bank transfer.",
  },
  {
    icon: ShieldCheck,
    title: "No card details on this site",
    body: "We collect your intention here and send payment instructions separately. Nothing sensitive passes through this form.",
  },
  {
    icon: HeartHandshake,
    title: "We tell you what happened",
    body: "After the visit your gift funds, we write to you with the school, the numbers and what students said.",
  },
];

export default function DonatePage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(BREADCRUMBS))} />

      <PageHero
        eyebrow="Donate"
        title="KES 45,000 puts three hundred students in front of an aircraft."
        description="Every EduWings visit is free to the school. That only works because someone else pays for it. Here is exactly what your gift buys — no vague impact language, just the arithmetic."
        breadcrumbs={BREADCRUMBS}
      />

      {/* ── What it buys ────────────────────────────────────────────────── */}
      <Section>
        <div className="container-page">
          <SectionHeader
            eyebrow="What your gift funds"
            title="Four amounts, four concrete outcomes."
          />

          <RevealGroup as="ul" className="mt-14 grid gap-6 sm:grid-cols-2">
            {IMPACT_TIERS.map((tier) => (
              <RevealItem
                as="li"
                key={tier.amount}
                className="flex flex-col rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
              >
                <p className="font-display text-3xl font-bold tracking-tight text-primary">
                  {formatCurrency(tier.amount)}
                </p>
                <h3 className="mt-3 font-display text-lg leading-snug font-semibold">
                  {tier.title}
                </h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {tier.body}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </Section>

      {/* ── Form ────────────────────────────────────────────────────────── */}
      <Section tone="surface">
        <div className="container-page grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
          <Reveal className="rounded-3xl border bg-card p-7 shadow-[var(--shadow-lift)] sm:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight">Make a gift</h2>
            <p className="mt-2.5 leading-relaxed text-muted-foreground">
              Choose an amount, tell us where to send instructions, and we will handle the rest.
            </p>
            <DonationForm className="mt-8" />
          </Reveal>

          <div>
            <SectionHeader eyebrow="How we handle it" title="Four things we commit to." />

            <RevealGroup as="ul" className="mt-10 grid gap-6">
              {ASSURANCES.map((item) => (
                <RevealItem as="li" key={item.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </Section>

      {/* ── Alternatives ────────────────────────────────────────────────── */}
      <Section size="sm">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Money is not the only thing we need.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If you work in aviation, a few days of your time is worth more to a classroom than
              most cheques. And if your organisation can open a hangar, a tower or an operations
              centre to students, that is worth more still.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={routes.volunteer}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40"
              >
                Volunteer instead
              </a>
              <a
                href={routes.partners}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-primary/40"
              >
                Partner with us
              </a>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
