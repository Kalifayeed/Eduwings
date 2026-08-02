import { ExternalLink } from "lucide-react";

import { PARTNER_TIERS, type Partner } from "@/lib/content/types";
import { groupBy } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * Grouped partner listing, ordered by tier.
 *
 * Each entry leads with what the organisation actually contributes rather than a
 * logo and a boilerplate description — that is the information a prospective
 * partner is looking for when deciding whether to get involved.
 */
function PartnerDirectory({
  partners,
  emptyAction,
}: {
  partners: Partner[];
  emptyAction: { label: string; href: string };
}) {
  if (partners.length === 0) {
    return (
      <EmptyState
        title="No organisations listed yet"
        description="We publish partners here once an agreement is signed. We never list an organisation we are merely talking to."
        action={emptyAction}
      />
    );
  }

  const grouped = groupBy(partners, (partner) => partner.tier);

  return (
    <div className="grid gap-14">
      {PARTNER_TIERS.map((tier) => {
        const items = grouped.get(tier);
        if (!items?.length) return null;

        return (
          <section key={tier}>
            <h2 className="flex items-center gap-3 font-display text-xl font-bold tracking-tight">
              {tier}
              <span className="h-px flex-1 bg-border" aria-hidden />
              <span className="font-mono text-xs font-normal text-muted-foreground">
                {items.length}
              </span>
            </h2>

            <RevealGroup as="ul" className="mt-7 grid gap-5 md:grid-cols-2">
              {items.map((partner) => (
                <RevealItem
                  as="li"
                  key={partner.id}
                  className="flex flex-col rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="font-display text-lg leading-snug font-semibold">
                      {partner.websiteUrl ? (
                        <a
                          href={partner.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                        >
                          {partner.name}
                          <ExternalLink aria-hidden className="size-3.5" />
                        </a>
                      ) : (
                        partner.name
                      )}
                    </h3>
                    <Badge variant="secondary" className="shrink-0">
                      {partner.category}
                    </Badge>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {partner.summary}
                  </p>

                  <div className="mt-5 flex-1 rounded-xl bg-primary/5 p-4">
                    <p className="font-mono text-[0.65rem] tracking-[0.16em] text-primary uppercase">
                      What they contribute
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{partner.contribution}</p>
                  </div>

                  {partner.sinceYear ? (
                    <p className="mt-5 border-t pt-4 text-xs text-muted-foreground">
                      Working with us since {partner.sinceYear}
                    </p>
                  ) : null}
                </RevealItem>
              ))}
            </RevealGroup>
          </section>
        );
      })}
    </div>
  );
}

export { PartnerDirectory };
