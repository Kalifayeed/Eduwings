"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { routes } from "@/config/routes";
import type { EduEvent } from "@/lib/content/types";
import { formatDateTime } from "@/lib/utils";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { Button } from "@/components/ui/button";

interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function remainingUntil(target: number): Remaining | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * Countdown to the next event.
 *
 * Renders nothing on the server and during the first client paint: a countdown
 * computed from `Date.now()` would produce a server/client mismatch by
 * definition. The event's date and a working registration link are always
 * present in the surrounding page, so nothing is lost when this is absent.
 */
function EventCountdown({ event }: { event: EduEvent }) {
  const target = React.useMemo(() => new Date(event.startsAt).getTime(), [event.startsAt]);
  const [remaining, setRemaining] = React.useState<Remaining | null>(null);
  const mounted = useIsMounted();

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    // Self-scheduling rather than a fixed interval, and the first tick is
    // deferred to a timeout callback: setting state synchronously in the effect
    // body would force an immediate second render on every mount.
    const tick = () => {
      const next = remainingUntil(target);
      setRemaining(next);
      if (next) timer = setTimeout(tick, 1000);
    };

    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [target]);

  const units = remaining
    ? [
        { label: "Days", value: remaining.days },
        { label: "Hours", value: remaining.hours },
        { label: "Min", value: remaining.minutes },
        { label: "Sec", value: remaining.seconds },
      ]
    : [];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-700 to-navy-900 p-6 text-white shadow-[var(--shadow-lift)] dark:from-sky-900 dark:to-navy-950">
      <p className="font-mono text-xs tracking-[0.18em] text-gold-300 uppercase">Next event</p>

      <h2 className="mt-3 font-display text-lg leading-snug font-semibold">
        <Link href={routes.event(event.slug)} className="underline-offset-4 hover:underline">
          {event.title}
        </Link>
      </h2>

      <p className="mt-1.5 text-sm text-white/70">
        <time dateTime={event.startsAt}>{formatDateTime(event.startsAt)}</time>
        {" · "}
        {event.isOnline ? "Online" : event.locality}
      </p>

      {mounted && remaining ? (
        <dl className="mt-5 grid grid-cols-4 gap-2" aria-label="Time until this event starts">
          {units.map((unit) => (
            <div key={unit.label} className="rounded-xl bg-white/10 py-2.5 text-center">
              <dd className="font-display text-xl leading-none font-bold tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </dd>
              <dt className="mt-1 text-[0.6rem] tracking-widest text-white/60 uppercase">
                {unit.label}
              </dt>
            </div>
          ))}
        </dl>
      ) : null}

      <Button asChild variant="accent" className="mt-5 w-full">
        <Link href={routes.event(event.slug)}>
          {event.registrationOpen ? "Register" : "Details"}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}

export { EventCountdown };
