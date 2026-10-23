import type { EduEvent } from "@/lib/content/types";
import { published } from "@/lib/content/static/seed-utils";
import { requestTime } from "@/lib/time";

export const aviationTourSlug = "eduwings-kenya-aviation-tour-2026";

/** Campaign details supplied in the EduWings / EASA event poster. */
export const aviationTourEvent: EduEvent = {
  id: "evt-eduwings-aviation-tour-2026",
  slug: aviationTourSlug,
  title: "EduWings Kenya Aviation Tour",
  summary:
    "An aviation discovery day at Wilson Airport and the East African School of Aviation for learners aged 7–17.",
  type: "Airport Tour",
  startsAt: "2026-11-26T06:00:00.000Z",
  endsAt: "2026-11-26T11:00:00.000Z",
  venue: "Wilson Airport and East African School of Aviation",
  locality: "Nairobi",
  isOnline: false,
  coverImage: "/events/eduwings-aviation-tour-2026.jpg",
  capacity: null,
  seatsTaken: 0,
  registrationOpen: true,
  priceKes: 3500,
  featured: true,
  body: `Explore Wilson Airport and visit the East African School of Aviation (EASA) for one exciting day of aviation discovery.

## What learners will explore

- Aviation careers
- Engineering labs
- Air traffic control simulators

## Event details

- **Date:** Thursday, 26 November 2026
- **Time:** 9:00 am–2:00 pm (East Africa Time)
- **Age range:** 7–17 years
- **Price:** KES 3,500 per learner
- **Drop-off and pick-up:** Wilson Airport

Send an inquiry using the form on this page. The EduWings team will follow up with booking and payment details. Sending an inquiry does not reserve a place or collect payment.`,
  ...published("2026-10-14T00:00:00.000Z"),
};

export function aviationTourIsUpcoming(): boolean {
  return (
    new Date(aviationTourEvent.endsAt ?? aviationTourEvent.startsAt).getTime() >= requestTime()
  );
}

/** Keep the campaign visible when production content comes from Supabase. */
export function withAviationTour(items: EduEvent[], when: "upcoming" | "past"): EduEvent[] {
  const include = when === "upcoming" ? aviationTourIsUpcoming() : !aviationTourIsUpcoming();
  const combined = items.filter((item) => item.slug !== aviationTourSlug);
  if (include) combined.push(aviationTourEvent);
  return combined.sort((a, b) =>
    when === "past" ? b.startsAt.localeCompare(a.startsAt) : a.startsAt.localeCompare(b.startsAt),
  );
}
