import { siteConfig } from "@/config/site";
import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { acknowledge, notifyTeam } from "@/lib/email";
import { volunteerSchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: volunteerSchema,
  scope: "volunteer",
  successMessage: "Application received — thank you.",
  handle: async (data) => {
    await storeSubmission({
      kind: "volunteer",
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `Volunteer application — ${data.role}`,
      message: data.motivation,
      payload: {
        role: data.role,
        organisation: data.organisation,
        yearsExperience: data.yearsExperience,
        availability: data.availability,
        county: data.county,
      },
    });

    await Promise.all([
      notifyTeam({
        subject: `Volunteer application — ${data.role} (${data.county})`,
        heading: `${data.name} would like to volunteer`,
        replyTo: data.email,
        fields: {
          Name: data.name,
          Role: data.role,
          Employer: data.organisation,
          Experience: `${data.yearsExperience} years`,
          Availability: data.availability,
          County: data.county,
          Email: data.email,
          Phone: data.phone,
          Motivation: data.motivation,
        },
      }),
      acknowledge({
        to: data.email,
        subject: `Thank you for offering to volunteer — ${siteConfig.name}`,
        heading: `Thank you, ${data.name.split(" ")[0]}`,
        paragraphs: [
          "Volunteers are the reason this programme works at all. Students are far more interested in someone who does the job than in anyone presenting slides about it.",
          "We will call you for a short conversation — not a formal interview — and you will shadow a session before leading anything.",
          "Volunteering with students requires a background check. We will explain that process when we speak.",
          "— The EduWings team",
        ],
      }),
    ]);
  },
});
