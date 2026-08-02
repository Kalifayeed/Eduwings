import { siteConfig } from "@/config/site";
import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { acknowledge, notifyTeam } from "@/lib/email";
import { partnershipSchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: partnershipSchema,
  scope: "partnership",
  successMessage: "Enquiry received — we will come back to you within three working days.",
  handle: async (data) => {
    await storeSubmission({
      kind: "partnership",
      name: data.contactName,
      email: data.email,
      phone: data.phone ?? null,
      subject: `Partnership enquiry — ${data.organisation}`,
      message: data.message,
      payload: {
        organisation: data.organisation,
        role: data.role,
        type: data.type,
      },
    });

    await Promise.all([
      notifyTeam({
        subject: `Partnership enquiry — ${data.organisation}`,
        heading: `${data.organisation} would like to work with us`,
        replyTo: data.email,
        fields: {
          Organisation: data.organisation,
          Contact: `${data.contactName} (${data.role})`,
          Email: data.email,
          Phone: data.phone,
          "Offer type": data.type,
          Message: data.message,
        },
      }),
      acknowledge({
        to: data.email,
        subject: `Thank you for reaching out — ${siteConfig.name}`,
        heading: `Thank you, ${data.contactName.split(" ")[0]}`,
        paragraphs: [
          `We have received your enquiry on behalf of ${data.organisation}.`,
          "We will come back to you within three working days with a concrete proposal — specific schools, specific dates, specific outcomes — rather than a brochure.",
          "Every partner receives an impact report after each visit they support.",
          "— The EduWings team",
        ],
      }),
    ]);
  },
});
