import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { getCareerPhoto } from "@/lib/content/career-photos";
import { routes } from "@/config/routes";
import { Icon } from "@/components/icon";
import { disciplineLabel, type Career } from "@/lib/content/careers";
import { Badge } from "@/components/ui/badge";
import { AppImage } from "@/components/media/app-image";

/**
 * Career summary card.
 *
 * Leads with the hook rather than the job title, because the title is the part
 * students already dismiss ("engineer" sounds unreachable; "your signature is
 * what legally allows an aircraft to fly" does not).
 */
function CareerCard({ career, className }: { career: Career; className?: string }) {
  const photo = getCareerPhoto(career.slug);
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
          src={photo.src}
          alt={photo.alt}
          seed={career.slug}
          motif={career.motif}
          className="size-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 border-white/20 bg-black/40 text-white backdrop-blur-sm"
        >
          {disciplineLabel(career.discipline)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon name={career.icon} className="size-5" aria-hidden />
          </span>
          <h3 className="pt-1.5 font-display text-lg leading-tight font-semibold tracking-tight">
            {career.title}
          </h3>
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{career.hook}</p>

        <div className="mt-6 flex items-center justify-between gap-4 border-t pt-4">
          <span className="text-xs text-muted-foreground">
            Courses, requirements &amp; opportunities
          </span>
          <Link
            href={routes.career(career.slug)}
            aria-label={"Explore more: " + career.title}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary before:absolute before:inset-0"
          >
            Explore more <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

export { CareerCard };
