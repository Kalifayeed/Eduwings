import { siteConfig } from "@/config/site";
import { createFormRoute } from "@/lib/api/form-route";
import { storeSubscriber } from "@/lib/api/submissions";
import { acknowledge } from "@/lib/email";
import { RATE_LIMITS } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validation/schemas";

export const POST = createFormRoute({
  schema: newsletterSchema,
  scope: "newsletter",
  limits: RATE_LIMITS.newsletter,
  successMessage: "You are subscribed.",
  handle: async (data) => {
    await storeSubscriber(data.email, data.name ?? null, data.source);

    // No team notification here — a subscription is not something anyone needs
    // to action, and the admin console lists subscribers.
    await acknowledge({
      to: data.email,
      subject: `You're subscribed — ${siteConfig.name}`,
      heading: "You're on the list",
      paragraphs: [
        "One email a term. Where we have been, what students asked us, and which schools we are visiting next.",
        "No fundraising drives and no newsletters about newsletters. Every email has a one-click unsubscribe.",
        "— The EduWings team",
      ],
    });
  },
});
