import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { getContentSource } from "@/lib/content";
import { acknowledge, notifyTeam } from "@/lib/email";
import { formatDateTime } from "@/lib/utils";
import { eventRegistrationSchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: eventRegistrationSchema,
  scope: "event-registration",
  successMessage: "Registration received — we will confirm by email.",
  handle: async (data) => {
    // Resolve the event so the notification and acknowledgement carry real
    // details rather than a slug, and so a registration for a non-existent or
    // closed event is recorded as such.
    const event = await getContentSource().events.bySlug(data.eventSlug);

    await storeSubmission({
      kind: "event-registration",
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `Registration — ${event?.title ?? data.eventSlug}`,
      message: data.notes ?? null,
      payload: {
        eventSlug: data.eventSlug,
        eventTitle: event?.title ?? null,
        organisation: data.organisation,
        attendees: data.attendees,
        registrationOpen: event?.registrationOpen ?? null,
      },
    });

    const when = event ? formatDateTime(event.startsAt) : "the scheduled date";
    const where = event ? (event.isOnline ? "Online" : `${event.venue}, ${event.locality}`) : "";

    await Promise.all([
      notifyTeam({
        subject: `Registration — ${event?.title ?? data.eventSlug} (${data.attendees})`,
        heading: `${data.organisation} registered for ${event?.title ?? data.eventSlug}`,
        replyTo: data.email,
        fields: {
          Event: event?.title ?? data.eventSlug,
          Attendees: data.attendees,
          Organisation: data.organisation,
          Contact: data.name,
          Email: data.email,
          Phone: data.phone,
          Notes: data.notes,
        },
      }),
      acknowledge({
        to: data.email,
        subject: `Registration received — ${event?.title ?? "EduWings event"}`,
        heading: `Thank you, ${data.name.split(" ")[0]}`,
        paragraphs: [
          `We have your registration for ${event?.title ?? "the event"}${where ? `, ${where}` : ""}, on ${when}.`,
          `You registered ${data.attendees} ${data.attendees === 1 ? "place" : "places"}. We will confirm within one working day.`,
          "Airside events require identification documents for every attendee at least fourteen days in advance. If this applies, we will write to you separately.",
          "— The EduWings team",
        ],
      }),
    ]);
  },
});
