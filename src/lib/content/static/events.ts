import type { EduEvent } from "@/lib/content/types";
import { published } from "@/lib/content/static/seed-utils";

/**
 * Seed events.
 *
 * Dates are anchored forward of the seed epoch so the "upcoming" and "past"
 * groupings are both populated in a fresh install. Once Supabase is configured
 * these are replaced by live records.
 */
const seed = [
  {
    id: "evt-nairobi-open-day",
    slug: "eduwings-open-day-nairobi",
    title: "EduWings Open Day — Nairobi",
    summary:
      "A full day inside the industry: simulators, a hangar walkthrough, and forty minutes with working pilots, engineers and controllers taking unfiltered questions.",
    type: "Open Day",
    startsAt: "2026-09-19T06:00:00.000Z",
    endsAt: "2026-09-19T13:00:00.000Z",
    venue: "Aviation House, Airport North Road",
    locality: "Nairobi",
    isOnline: false,
    capacity: 240,
    seatsTaken: 173,
    registrationOpen: true,
    priceKes: null,
    featured: true,
    body: `Our largest event of the year, and the only one where students meet every discipline in a single day.

## What happens

**Morning — the aircraft.** Rotating stations covering how aircraft fly, a hangar walkthrough with a licensed engineer, and desktop simulator sessions flown with a working pilot beside you.

**Midday — the system.** A live turnaround exercise, a navigation challenge, and a weather briefing where students make the go/no-go call themselves.

**Afternoon — the people.** Forty minutes of open questions with pilots, engineers, controllers, dispatchers and remote pilots. No slides. Students ask what things cost, whether it is hard, and whether someone like them can really do it. The answers are honest.

## Who should come

Students in Grade 6 to Form 4, with a teacher or guardian. Places are allocated per school so that no single school takes the whole room.

## What to bring

Nothing but questions. Lunch and materials are provided.`,
  },
  {
    id: "evt-jkia-tour",
    slug: "airport-operations-tour-jkia",
    title: "Airport Operations Tour — JKIA",
    summary:
      "Behind the terminal doors: the ramp, the operations centre and the roles that keep an international gateway moving.",
    type: "Airport Tour",
    startsAt: "2026-10-08T05:30:00.000Z",
    endsAt: "2026-10-08T10:00:00.000Z",
    venue: "Jomo Kenyatta International Airport",
    locality: "Nairobi",
    isOnline: false,
    capacity: 45,
    seatsTaken: 45,
    registrationOpen: false,
    priceKes: null,
    featured: true,
    body: `A restricted-access tour arranged with our airport partners. Numbers are strictly limited by airside security requirements.

## What students see

The ramp during a live turnaround. The operations control centre where the day's disruptions are managed. Cargo and load control. A conversation with the duty airport manager about what actually goes wrong and how it gets fixed.

## Requirements

Airside access requires identification documents submitted **at least fourteen days in advance** for every attendee, including accompanying teachers. Closed shoes and high-visibility vests are mandatory; we provide the vests.

## Registration

This tour is fully subscribed. Add your school to the waiting list through the contact form and we will offer places first to schools that have not previously attended.`,
  },
  {
    id: "evt-mombasa-career-fair",
    slug: "coast-aviation-career-fair",
    title: "Coast Aviation Career Fair",
    summary:
      "Fourteen career pathways, thirty aviation professionals, and every training institution in the region under one roof.",
    type: "Career Fair",
    startsAt: "2026-11-14T06:00:00.000Z",
    endsAt: "2026-11-14T12:00:00.000Z",
    venue: "Moi International Airport Conference Centre",
    locality: "Mombasa",
    isOnline: false,
    capacity: 600,
    seatsTaken: 288,
    registrationOpen: true,
    priceKes: null,
    featured: true,
    body: `Built for students in Form 2 to Form 4 who are making subject and institution decisions now.

## The format

**Pathway stands.** One stand per career, staffed by someone who does that job. Students go to the careers they are curious about rather than sitting through all fourteen.

**Institution desks.** Training organisations with actual entry requirements, actual fees and actual intake dates — not brochures.

**Career mapping clinic.** Bring your current subject grades and leave with a written pathway and a next step.

## For teachers

Career guidance staff are welcome and we run a dedicated thirty-minute briefing on aviation entry requirements at 10:00, so that advice given after we leave is accurate.`,
  },
  {
    id: "evt-webinar-parents",
    slug: "aviation-careers-briefing-for-parents",
    title: "Aviation Careers: A Briefing for Parents",
    summary:
      "A frank online session on what aviation training costs, what it pays, and which pathways are genuinely worth the investment.",
    type: "Webinar",
    startsAt: "2026-08-27T16:00:00.000Z",
    endsAt: "2026-08-27T17:15:00.000Z",
    venue: "Online",
    locality: "Online",
    isOnline: true,
    capacity: null,
    seatsTaken: 412,
    registrationOpen: true,
    priceKes: null,
    featured: false,
    body: `Students come home from an EduWings visit excited. Parents, reasonably, want to know whether the excitement is affordable and whether the career is stable.

This session answers both directly.

## What we cover

Real cost ranges for each training pathway, from a remote pilot licence through to a commercial pilot licence. Realistic entry salaries and where they go after five years. Which qualifications are internationally portable. Which pathways are genuinely competitive and which are more open than their reputation suggests.

## What we will not do

We will not tell you aviation is a guaranteed career. It is cyclical, and the pandemic was brutal. We will give you the information to judge a specific pathway rather than an industry.

## Format

Forty-five minutes of briefing, thirty minutes of questions. Recorded and shared with everyone registered.`,
  },
  {
    id: "evt-kisumu-workshop",
    slug: "flight-lab-workshop-kisumu",
    title: "Flight Lab Workshop — Kisumu",
    summary:
      "A hands-on wing-building and testing workshop for schools across Kisumu and Siaya counties.",
    type: "Workshop",
    startsAt: "2026-07-11T06:30:00.000Z",
    endsAt: "2026-07-11T11:00:00.000Z",
    venue: "Kisumu Social Centre",
    locality: "Kisumu",
    isOnline: false,
    capacity: 120,
    seatsTaken: 120,
    registrationOpen: false,
    priceKes: null,
    featured: false,
    body: `A regional workshop for schools that cannot easily travel to Nairobi.

Students build and test wing profiles, measure lift, and work through the navigation challenge using real aeronautical charts. The session closes with the career mapping clinic.

This event has taken place. Photographs are in the [gallery](/gallery), and schools interested in a visit should use the [schools form](/schools).`,
  },
  {
    id: "evt-machakos-visit",
    slug: "school-visit-machakos-county",
    title: "School Visit — Machakos County",
    summary:
      "Three schools, 340 students, and the first aviation professional most of them had ever met.",
    type: "School Visit",
    startsAt: "2026-05-08T05:00:00.000Z",
    endsAt: "2026-05-08T12:00:00.000Z",
    venue: "Machakos County",
    locality: "Machakos",
    isOnline: false,
    capacity: 340,
    seatsTaken: 340,
    registrationOpen: false,
    priceKes: null,
    featured: false,
    body: `A three-school day delivered with a licensed avionics engineer and a first officer.

Pre-visit surveys averaged 1.8 aviation careers named. Post-visit surveys averaged 10.1 — our highest recorded shift, in the schools with the least prior exposure.

This event has taken place. To request a visit for your school, use the [schools form](/schools).`,
  },
] as const;

export const events: EduEvent[] = seed.map((item) => ({
  ...item,
  coverImage: null,
  ...published(),
}));
