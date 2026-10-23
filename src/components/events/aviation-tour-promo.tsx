import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

import { routes } from "@/config/routes";
import { aviationTourEvent } from "@/lib/content/aviation-tour";
import { AppImage } from "@/components/media/app-image";

/** A whole-card link takes visitors to the tour poster and event details. */
export function AviationTourPromo() {
  return (
    <Link
      href={routes.event(aviationTourEvent.slug)}
      className="group grid overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-float)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:grid-cols-[minmax(0,16rem)_1fr]"
    >
      <div className="relative aspect-[2/3] max-h-96 bg-white sm:aspect-auto sm:max-h-none">
        <AppImage
          src={aviationTourEvent.coverImage}
          alt="EduWings Kenya Aviation Tour poster"
          seed={aviationTourEvent.slug}
          imageClassName="object-contain"
          sizes="(min-width: 640px) 16rem, 100vw"
          className="size-full"
        />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="font-mono text-xs tracking-[0.16em] text-primary uppercase">
          Featured upcoming event
        </p>
        <h2 className="mt-3 font-display text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
          EduWings Kenya Aviation Tour
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Explore Wilson Airport and the East African School of Aviation. Discover aviation careers,
          engineering labs and air traffic control simulators.
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden className="size-4 text-primary" />
            26 November · 9:00 am–2:00 pm
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden className="size-4 text-primary" />
            Wilson Airport, Nairobi
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">Ages 7–17 · KES 3,500 per learner</p>
        <span className="mt-7 inline-flex items-center gap-2 font-semibold text-primary group-hover:underline">
          View event details <ArrowRight aria-hidden className="size-4" />
        </span>
      </div>
    </Link>
  );
}
