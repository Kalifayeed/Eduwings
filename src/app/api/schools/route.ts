import { siteConfig } from "@/config/site";
import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { acknowledge, notifyTeam } from "@/lib/email";
import { schoolRequestSchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: schoolRequestSchema,
  scope: "schools",
  successMessage: "Quotation request received — we will be in touch within three working days.",
  handle: async (data) => {
    await storeSubmission({
      kind: "school",
      name: data.contactName,
      email: data.email,
      phone: data.phone,
      subject: `School quotation request — ${data.schoolName}`,
      message: data.notes ?? null,
      payload: {
        requestType: "quotation",
        schoolName: data.schoolName,
        schoolType: data.schoolType,
        level: data.level,
        county: data.county,
        town: data.town,
        address: data.address,
        schoolWebsite: data.schoolWebsite,
        role: data.role,
        studentCount: data.studentCount,
        targetGrades: data.targetGrades,
        teacherCount: data.teacherCount,
        programmesRequested: data.programmesRequested.join(", "),
        preferredDate: data.preferredDate,
        alternativeDate: data.alternativeDate,
        preferredTime: data.preferredTime,
      },
    });

    await Promise.all([
      notifyTeam({
        subject: `School quotation request — ${data.schoolName} (${data.county})`,
        heading: `${data.schoolName} requested a programme quotation`,
        replyTo: data.email,
        fields: {
          School: data.schoolName,
          "School type": data.schoolType,
          Level: data.level,
          County: data.county,
          Town: data.town,
          Address: data.address,
          Website: data.schoolWebsite,
          Students: data.studentCount,
          "Target grades": data.targetGrades,
          Teachers: data.teacherCount,
          "Programmes requested": data.programmesRequested.join(", "),
          Contact: `${data.contactName} (${data.role})`,
          Email: data.email,
          Phone: data.phone,
          "Preferred date": data.preferredDate,
          "Alternative date": data.alternativeDate,
          "Preferred time": data.preferredTime,
          Notes: data.notes,
        },
      }),
      acknowledge({
        to: data.email,
        subject: `We have your quotation request — ${siteConfig.name}`,
        heading: `Thank you, ${data.contactName.split(" ")[0]}`,
        paragraphs: [
          `We have received your request for ${data.schoolName} and will reply within three working days.`,
          "We will prepare an itemised quotation for your selected modules and delivery schedule. Our facilitators bring teaching materials; simulators are not brought to schools.",
          "After the modules, we organise a separately quoted field trip to a facility with simulators, subject to host availability and access requirements. Your request does not confirm a booking; dates and arrangements follow quotation approval.",
          "— The EduWings team",
        ],
      }),
    ]);
  },
});
