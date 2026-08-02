import { siteConfig } from "@/config/site";
import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { acknowledge, notifyTeam } from "@/lib/email";
import { schoolRequestSchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: schoolRequestSchema,
  scope: "schools",
  successMessage: "Request received — we will be in touch within three working days.",
  handle: async (data) => {
    await storeSubmission({
      kind: "school",
      name: data.contactName,
      email: data.email,
      phone: data.phone,
      subject: `School visit request — ${data.schoolName}`,
      message: data.notes ?? null,
      payload: {
        schoolName: data.schoolName,
        level: data.level,
        county: data.county,
        town: data.town,
        role: data.role,
        studentCount: data.studentCount,
        preferredTerm: data.preferredTerm,
      },
    });

    await Promise.all([
      notifyTeam({
        subject: `School visit request — ${data.schoolName} (${data.county})`,
        heading: `${data.schoolName} would like a visit`,
        replyTo: data.email,
        fields: {
          School: data.schoolName,
          Level: data.level,
          County: data.county,
          Town: data.town,
          Students: data.studentCount,
          Contact: `${data.contactName} (${data.role})`,
          Email: data.email,
          Phone: data.phone,
          "Preferred timing": data.preferredTerm,
          Notes: data.notes,
        },
      }),
      acknowledge({
        to: data.email,
        subject: `We have your visit request — ${siteConfig.name}`,
        heading: `Thank you, ${data.contactName.split(" ")[0]}`,
        paragraphs: [
          `We have received your request for ${data.schoolName} and will reply within three working days.`,
          "The visit costs your school nothing. We bring the simulators, the materials and a working aviation professional; you provide a room, a socket and a wall we can project onto.",
          "Once we agree a date, we will send you the curriculum mapping in advance so your teachers can align it with what they are already covering.",
          "— The EduWings team",
        ],
      }),
    ]);
  },
});
