import { siteConfig } from "@/config/site";
import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { acknowledge, notifyTeam } from "@/lib/email";
import { contactSchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: contactSchema,
  scope: "contact",
  successMessage: "Thank you — we will reply within two working days.",
  handle: async (data) => {
    await storeSubmission({
      kind: "contact",
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: data.topic,
      message: data.message,
      payload: { topic: data.topic },
    });

    // Notification and acknowledgement are independent; neither should block or
    // fail the other.
    await Promise.all([
      notifyTeam({
        subject: `New enquiry: ${data.topic}`,
        heading: `New enquiry from ${data.name}`,
        replyTo: data.email,
        fields: {
          Name: data.name,
          Email: data.email,
          Phone: data.phone,
          Topic: data.topic,
          Message: data.message,
        },
      }),
      acknowledge({
        to: data.email,
        subject: `We have your message — ${siteConfig.name}`,
        heading: `Thank you, ${data.name.split(" ")[0]}`,
        paragraphs: [
          "We have received your message and someone from the team will read it personally.",
          "We reply to everything within two working days. If it is urgent, call us on " +
            `${siteConfig.contact.phone}.`,
          "— The EduWings team",
        ],
      }),
    ]);
  },
});
