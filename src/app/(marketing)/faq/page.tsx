import Link from "next/link";
import { Phone } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { faqs, type FaqItem } from "@/lib/content/editorial";
import { groupBy } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, graph } from "@/lib/seo/structured-data";
import { JsonLd } from "@/components/seo/json-ld";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";

const BREADCRUMBS = [
  { label: "Home", href: routes.home },
  { label: "FAQ", href: routes.faq },
];

export const metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Straight answers for schools, students, parents and partners — what a visit costs, what aviation training really costs, and whether these careers are open to your child.",
  path: routes.faq,
});

/** Audience order controls the page order: schools first, then students. */
const AUDIENCE_ORDER: FaqItem["audience"][] = [
  "Schools",
  "Students",
  "Parents",
  "Partners",
  "General",
];

export default function FaqPage() {
  const grouped = groupBy(faqs, (faq) => faq.audience);

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(BREADCRUMBS),
          faqSchema(faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))),
        )}
      />

      <PageHero
        eyebrow="Questions"
        title="Straight answers, including the uncomfortable ones."
        description="What a visit costs, what training really costs, which careers are genuinely competitive and which are more open than their reputation suggests. Where the honest answer is discouraging, we give it anyway."
        breadcrumbs={BREADCRUMBS}
      />

      <Section>
        <div className="container-page">
          {/* Jump links — this page is long and scanned rather than read. */}
          <Reveal>
            <nav aria-label="Jump to a section" className="flex flex-wrap gap-2">
              {AUDIENCE_ORDER.filter((audience) => grouped.has(audience)).map((audience) => (
                <a
                  key={audience}
                  href={`#for-${audience.toLowerCase()}`}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {audience}
                </a>
              ))}
            </nav>
          </Reveal>

          <div className="mt-14 grid gap-14">
            {AUDIENCE_ORDER.map((audience) => {
              const items = grouped.get(audience);
              if (!items?.length) return null;

              return (
                <Reveal
                  as="section"
                  key={audience}
                  id={`for-${audience.toLowerCase()}`}
                  className="scroll-mt-32"
                >
                  <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                    {audience === "General" ? "Everything else" : `For ${audience.toLowerCase()}`}
                  </h2>

                  <Accordion
                    type="single"
                    collapsible
                    className="mt-6 rounded-2xl border bg-card px-6"
                  >
                    {items.map((faq) => {
                      const index = faqs.indexOf(faq);
                      return (
                        <AccordionItem
                          key={faq.question}
                          value={faq.question}
                          id={`question-${index}`}
                          className="scroll-mt-32"
                        >
                          <AccordionTrigger>{faq.question}</AccordionTrigger>
                          <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      <Section tone="surface" size="sm">
        <div className="container-page">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Not answered here?
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Ask us directly. We read every message ourselves and reply within two working days —
              or call, which is usually faster.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href={routes.contact}>Send us a question</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:${siteConfig.contact.phoneE164}`}>
                  <Phone className="size-4" />
                  {siteConfig.contact.phone}
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
