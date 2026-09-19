import { siteConfig } from "@/config/site";
import { createFormRoute } from "@/lib/api/form-route";
import { storeSubmission } from "@/lib/api/submissions";
import { acknowledge, notifyTeam } from "@/lib/email";
import { aviationVisitSchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: aviationVisitSchema,
  scope: "visits",
  successMessage: "Quotation request received — we will be in touch within three working days.",
  handle: async (data) => {
    await storeSubmission({
      kind: "aviation-visit",
      name: data.contactName,
      email: data.email,
      phone: data.phone,
      subject: `Field-trip quotation request — ${data.schoolName} (${data.destinationType})`,
      message: data.notes ?? null,
      payload: {
        requestType: "quotation",
        schoolName: data.schoolName,
        schoolType: data.schoolType,
        level: data.level,
        county: data.county,
        town: data.town,
        role: data.role,
        destinationType: data.destinationType,
        purposes: data.purposes.join(", "),
        studentCount: data.studentCount,
        teacherCount: data.teacherCount,
        preferredDate: data.preferredDate,
        alternativeDate: data.alternativeDate,
      },
    });

    await Promise.all([
      notifyTeam({
        subject: `Field-trip quotation request — ${data.schoolName} (${data.county})`,
        heading: `${data.schoolName} wants to visit a ${data.destinationType.toLowerCase()}`,
        replyTo: data.email,
        fields: {
          School: data.schoolName,
          "School type": data.schoolType,
          Level: data.level,
          County: data.county,
          Town: data.town,
          Destination: data.destinationType,
          Purposes: data.purposes.join(", "),
          Students: data.studentCount,
          Teachers: data.teacherCount,
          "Preferred date": data.preferredDate,
          "Alternative date": data.alternativeDate,
          Contact: `${data.contactName} (${data.role})`,
          Email: data.email,
          Phone: data.phone,
          Notes: data.notes,
        },
      }),
      acknowledge({
        to: data.email,
        subject: `We have your field-trip quotation request — ${siteConfig.name}`,
        heading: `Thank you, ${data.contactName.split(" ")[0]}`,
        paragraphs: [
          `We have received your request for ${data.schoolName} to visit a ${data.destinationType.toLowerCase()} and will reply within three working days.`,
          "We will check host availability, the group size, access requirements and any simulator activities, then prepare an itemised quotation.",
          "Field-trip coordination, transport, facility access, simulator activities and meals are included only where listed in the quotation. A booking is confirmed separately after your approval and host confirmation.",
          "— The EduWings team",
        ],
      }),
    ]);
  },
});
