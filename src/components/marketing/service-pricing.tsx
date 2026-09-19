import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/config/routes";
import { serviceFees } from "@/lib/content/service-fees";
import { Section, SectionHeader } from "@/components/marketing/section";
import { Button } from "@/components/ui/button";

export function ServicePricing({ tripOnly = false }: { tripOnly?: boolean }) {
  const fees = tripOnly ? serviceFees.filter((fee) => fee.id === "trip") : serviceFees;
  return (
    <Section id="fees" tone="surface" className="scroll-mt-28">
      <div className="container-page">
        <SectionHeader
          eyebrow="EduWings service fees"
          title={
            tripOnly ? "Field-trip coordination fees." : "Plan your school’s aviation programme."
          }
          description="These fees cover EduWings’ aviation awareness training, school guidance and coordination services. Professional aviation courses are offered by independent training institutions."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fees.map((fee) => (
            <article key={fee.id} className="flex flex-col rounded-2xl border bg-card p-6">
              <h3 className="font-display text-lg font-semibold">{fee.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{fee.duration}</p>
              <p className="mt-5 text-xl font-bold text-primary">{fee.rate}</p>
              <p className="mt-2 text-sm font-medium">
                {fee.id === "talk" ? "One group session" : `Minimum: ${fee.minimum}`}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {fee.scope}
              </p>
              <Button asChild variant="outline" className="mt-6 self-start">
                <Link href={fee.id === "trip" ? routes.visitQuotation : routes.quotation}>
                  Get Quotation <ArrowRight className="size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
        <div className="mt-8 max-w-4xl space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            For per-learner services, the charge is the greater of the learner total and the stated
            minimum.{" "}
            {tripOnly
              ? "For example, coordination for 10 learners at KES 500 each is billed at the KES 10,000 minimum."
              : "For example, 10 Primary & Junior learners at KES 2,000 each are billed at the KES 30,000 minimum."}
          </p>
          <p>
            Teaching rates assume Nairobi-area delivery, advance scheduling and practical cohorts of
            up to 40 learners. Larger groups, additional visits and travel outside the agreed area
            are quoted separately. Your quotation confirms the rate within the published range,
            preparation, facilitator time, materials and schedule.
          </p>
          <p>
            Transport, host-facility entry, simulator access, meals, accommodation and any
            applicable taxes are itemised separately. The field trip follows the modules; simulator
            activities take place at the host facility and depend on its availability, age
            requirements and capacity. Submitting a quotation request does not confirm a booking.
          </p>
          {tripOnly ? (
            <p>
              <Link className="font-medium text-primary underline" href={routes.fees}>
                View all school programme fees
              </Link>
            </p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
