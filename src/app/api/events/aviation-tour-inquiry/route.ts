import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { aviationTourEvent } from "@/lib/content/aviation-tour";
import { acknowledge, notifyTeam } from "@/lib/email";
import { aviationTourInquirySchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: aviationTourInquirySchema,
  scope: "aviation-tour-inquiry",
  successMessage: "Inquiry received — the EduWings team will follow up.",
  handle: async (data) => {
    const stored = await storeSubmission({
      kind: "contact",
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `${aviationTourEvent.title} inquiry`,
      message: data.message ?? null,
      payload: {
        eventSlug: aviationTourEvent.slug,
        eventTitle: aviationTourEvent.title,
        startsAt: aviationTourEvent.startsAt,
        organisation: data.organisation,
        learners: data.learners,
        learnerAges: data.learnerAges,
      },
    });

    const notified = await notifyTeam({
      subject: `Inquiry — ${aviationTourEvent.title} (${data.learners} learners)`,
      heading: `${data.name} asked about the aviation tour`,
      replyTo: data.email,
      fields: {
        Event: aviationTourEvent.title,
        Date: "26 November 2026",
        Name: data.name,
        Email: data.email,
        Phone: data.phone,
        Organisation: data.organisation,
        Learners: data.learners,
        "Learner ages": data.learnerAges,
        Questions: data.message,
      },
    });

    // Do not claim receipt unless the inquiry reached storage or the team inbox.
    if (!stored && !notified) throw new Error("Tour inquiry could not be delivered");

    await acknowledge({
      to: data.email,
      subject: `Inquiry received — ${aviationTourEvent.title}`,
      heading: `Thank you, ${data.name.split(" ")[0]}`,
      paragraphs: [
        `We received your inquiry about ${aviationTourEvent.title} on 26 November 2026 for ${data.learners} ${data.learners === 1 ? "learner" : "learners"}.`,
        "The EduWings team will follow up with booking and payment details. Your place is not reserved and no payment has been taken.",
        "— The EduWings team",
      ],
    });
  },
});
