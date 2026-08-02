import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Partner } from "@/lib/content/types";

/**
 * Partner and sponsor wordmark strip.
 *
 * Logos are frequently unavailable early in a partnership, so the fallback is a
 * typeset wordmark rather than an empty box — which reads as intentional and
 * keeps the row visually even. Rendered as a definition list so the relationship
 * between organisation and category survives without the visual grid.
 */
function PartnerStrip({ partners, className }: { partners: Partner[]; className?: string }) {
  if (partners.length === 0) return null;

  return (
    <ul
      className={cn(
        "grid grid-cols-2 items-stretch gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {partners.map((partner) => (
        <li key={partner.id} className="flex items-center justify-center bg-card px-6 py-8">
          {partner.logoUrl ? (
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              width={160}
              height={48}
              className="h-10 w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100 dark:brightness-0 dark:contrast-200 dark:invert"
            />
          ) : (
            <span className="text-center font-display text-sm leading-snug font-semibold tracking-tight text-balance text-muted-foreground">
              {partner.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export { PartnerStrip };
