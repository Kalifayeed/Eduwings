import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import { Icon } from "@/components/icon";
import type { Institution } from "@/lib/content/institutions";
import { Badge } from "@/components/ui/badge";
import { AppImage } from "@/components/media/app-image";

/**
 * Institution summary card. Mirrors `CareerCard`'s shape so the two read as
 * one family of content, but leads with location and KCAA-approval status
 * rather than a hook — the thing a school actually needs to check first.
 */
function InstitutionCard({
  institution,
  className,
}: {
  institution: Institution;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card",
        "shadow-[var(--shadow-soft)] transition-all duration-300 ease-[var(--ease-out-expo)]",
        "focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <AppImage
          src={null}
          alt=""
          seed={institution.slug}
          motif={institution.motif}
          className="size-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 border-white/20 bg-black/40 text-white backdrop-blur-sm"
        >
          {institution.type}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon name={institution.icon} className="size-5" aria-hidden />
          </span>
          <h3 className="pt-1.5 font-display text-lg leading-tight font-semibold tracking-tight">
            <Link href={routes.course(institution.slug)} className="before:absolute before:inset-0">
              {institution.name}
            </Link>
          </h3>
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
          {institution.location.town}
        </p>

        <div className="mt-6 flex items-end justify-between gap-4 border-t pt-4">
          {institution.kcaaApproved ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
              <ShieldCheck className="size-3.5" aria-hidden />
              KCAA-approved
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
            View courses
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}

export { InstitutionCard };
