import { siteConfig } from "@/config/site";
import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { acknowledge, notifyTeam } from "@/lib/email";
import { formatCurrency } from "@/lib/utils";
import { donationSchema } from "@/lib/validation/schemas";

/**
 * Records a donation *intention*.
 *
 * No payment instrument is collected or processed here — that requires a payment
 * provider and the compliance work around it. This endpoint captures intent and
 * triggers a follow-up with payment instructions, which is the correct and
 * honest first step.
 */
export const POST = createFormRoute({
  schema: donationSchema,
  scope: "donate",
  successMessage: "Thank you — payment instructions are on their way.",
  handle: async (data) => {
    const amount = formatCurrency(data.amountKes);

    await storeSubmission({
      kind: "donation",
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      subject: `Donation intent — ${amount} (${data.frequency})`,
      message: data.note ?? null,
      payload: {
        amountKes: data.amountKes,
        frequency: data.frequency,
        designation: data.designation,
        isOrganisation: data.isOrganisation,
        organisation: data.organisation,
      },
    });

    await Promise.all([
      notifyTeam({
        subject: `Donation intent — ${amount} ${data.frequency.toLowerCase()}`,
        heading: `${data.isOrganisation && data.organisation ? data.organisation : data.name} would like to give ${amount}`,
        replyTo: data.email,
        fields: {
          Amount: amount,
          Frequency: data.frequency,
          Name: data.name,
          Organisation: data.isOrganisation ? data.organisation : undefined,
          Email: data.email,
          Phone: data.phone,
          Designation: data.designation,
          Note: data.note,
        },
      }),
      acknowledge({
        to: data.email,
        subject: `Thank you for your gift of ${amount} — ${siteConfig.name}`,
        heading: `Thank you, ${data.name.split(" ")[0]}`,
        paragraphs: [
          `We have recorded your intention to give ${amount} ${data.frequency.toLowerCase()}.`,
          "We will send payment instructions — M-Pesa and bank transfer — within one working day, and a receipt as soon as the gift clears.",
          "After the visit your gift funds, we will write to you with what actually happened: which school, how many students, and what they said afterwards.",
          "— The EduWings team",
        ],
      }),
    ]);
  },
});
