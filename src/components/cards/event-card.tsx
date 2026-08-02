import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { requestTime } from "@/lib/time";
import { routes } from "@/config/routes";
import type { EduEvent } from "@/lib/content/types";
import { Badge } from "@/components/ui/badge";
import { AppImage } from "@/components/media/app-image";

/** Seat availability, expressed the way a visitor actually reads it. */
function availabilityOf(event: EduEvent) {
  if (!event.registrationOpen) return { label: "Registration closed", variant: "muted" as const };
  if (event.capacity === null) return { label: "Open — no limit", variant: "success" as const };

  const remaining = event.capacity - event.seatsTaken;
  if (remaining <= 0) return { label: "Fully subscribed", variant: "destructive" as const };
  if (remaining <= event.capacity * 0.15)
    return { label: `Only ${remaining} places left`, variant: "accent" as const };
  return { label: `${remaining} places available`, variant: "success" as const };
}

interface EventCardProps {
  event: EduEvent;
  className?: string;
}

function EventCard({ event, className }: EventCardProps) {
  const availability = availabilityOf(event);
  const start = new Date(event.startsAt);
  const isPast = start.getTime() < requestTime();

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card sm:flex-row",
        "shadow-[var(--shadow-soft)] transition-all duration-300 ease-[var(--ease-out-expo)]",
        "focus-within:-translate-y-1 hover:-translate-y-1 hover:shadow-[var(--shadow-float)]",
        isPast && "opacity-90",
        className,
      )}
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden sm:aspect-auto sm:w-52">
        <AppImage
          src={event.coverImage}
          alt=""
          seed={event.slug}
          motif={event.isOnline ? "world" : "tower"}
          sizes="(min-width: 640px) 13rem, 100vw"
          className="size-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        {/* Date chip — the first thing a visitor scanning an events list looks for. */}
        <div className="absolute top-3 left-3 rounded-xl bg-card/95 px-3 py-1.5 text-center backdrop-blur-sm">
          <p className="font-display text-lg leading-none font-bold">
            {formatDate(start, { day: "numeric" })}
          </p>
          <p className="mt-0.5 font-mono text-[0.65rem] tracking-widest text-muted-foreground uppercase">
            {formatDate(start, { month: "short" })}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{event.type}</Badge>
          {!isPast ? <Badge variant={availability.variant}>{availability.label}</Badge> : null}
        </div>

        <h3 className="mt-3.5 font-display text-lg leading-tight font-semibold tracking-tight transition-colors group-hover:text-primary">
          <Link href={routes.event(event.slug)} className="before:absolute before:inset-0">
            {event.title}
          </Link>
        </h3>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {event.summary}
        </p>

        <dl className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5">
            <dt className="sr-only">Date</dt>
            <CalendarDays aria-hidden className="size-3.5" />
            <dd>
              <time dateTime={event.startsAt}>{formatDate(start)}</time>
            </dd>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <dt className="sr-only">Location</dt>
            <MapPin aria-hidden className="size-3.5" />
            <dd>{event.isOnline ? "Online" : event.locality}</dd>
          </div>
          {event.capacity ? (
            <div className="inline-flex items-center gap-1.5">
              <dt className="sr-only">Capacity</dt>
              <Users aria-hidden className="size-3.5" />
              <dd>{event.capacity} places</dd>
            </div>
          ) : null}
          <span className="ml-auto inline-flex items-center gap-1 font-medium text-primary">
            Details
            <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </dl>
      </div>
    </article>
  );
}

export { EventCard, availabilityOf };
