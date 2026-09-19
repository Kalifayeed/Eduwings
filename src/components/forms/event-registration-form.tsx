"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Ticket } from "lucide-react";

import { routes } from "@/config/routes";
import { eventRegistrationSchema, type EventRegistrationInput } from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CheckboxField, TextareaField, TextField } from "@/components/forms/fields";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { FormSuccess } from "@/components/forms/form-success";

function EventRegistrationForm({
  eventSlug,
  className,
}: {
  eventSlug: string;
  className?: string;
}) {
  const form = useForm<EventRegistrationInput>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      eventSlug,
      name: "",
      email: "",
      phone: "",
      organisation: "",
      attendees: 1,
      notes: "",
      consent: false,
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess } = useApiForm({
    endpoint: "/api/events/register",
    form,
    successTitle: "Quotation request received",
    successDescription: "We will follow up with pricing and availability.",
  });

  if (isSuccess) {
    return (
      <FormSuccess
        className={className}
        title="We have your quotation request"
        description="We will review your group’s requirements and provide a quotation. Places are confirmed separately after approval and availability checks."
        nextSteps={[
          "We acknowledge your enquiry and check availability.",
          "You receive pricing and arrangements for review before booking.",
          "Any host access requirements are explained before attendance is confirmed.",
        ]}
        action={{ label: "See other events", href: routes.events }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate className={className}>
        <div className="grid gap-5">
          <TextField
            control={form.control}
            name="name"
            label="Your name"
            required
            autoComplete="name"
          />
          <TextField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
          />
          <TextField
            control={form.control}
            name="phone"
            label="Phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="0700 000 000"
          />
          <TextField
            control={form.control}
            name="organisation"
            label="School or organisation"
            required
            autoComplete="organization"
          />
          <TextField
            control={form.control}
            name="attendees"
            label="How many people?"
            type="number"
            inputMode="numeric"
            required
            description="Including yourself. For groups over 60, contact us directly."
          />
          <TextareaField
            control={form.control}
            name="notes"
            label="Anything we should know?"
            rows={3}
            placeholder="Accessibility requirements, travel constraints, year groups attending…"
          />
          <CheckboxField
            control={form.control}
            name="consent"
            label="I agree to EduWings contacting me about this event."
            description="We will not add you to any list you did not ask for."
          />
        </div>

        <HoneypotField registration={form.register("website")} />
        <input type="hidden" {...form.register("eventSlug")} />

        <Button type="submit" size="lg" className="mt-7 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending request
            </>
          ) : (
            <>
              <Ticket className="size-4" />
              Get Quotation
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export { EventRegistrationForm };
