"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";

import { routes } from "@/config/routes";
import { aviationTourInquirySchema, type AviationTourInquiryInput } from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CheckboxField, TextareaField, TextField } from "@/components/forms/fields";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { FormSuccess } from "@/components/forms/form-success";

export function AviationTourInquiryForm() {
  const form = useForm<AviationTourInquiryInput>({
    resolver: zodResolver(aviationTourInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organisation: "",
      learners: 1,
      learnerAges: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess } = useApiForm({
    endpoint: "/api/events/aviation-tour-inquiry",
    form,
    successTitle: "Inquiry received",
    successDescription: "The EduWings team will follow up with booking details.",
  });

  if (isSuccess) {
    return (
      <FormSuccess
        title="Thanks for your inquiry"
        description="The EduWings team has your details and will follow up about the tour. Your place is not reserved and no payment has been taken."
        action={{ label: "See other events", href: routes.events }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate>
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
            label="School or organisation (optional)"
            autoComplete="organization"
          />
          <TextField
            control={form.control}
            name="learners"
            label="Number of learners"
            type="number"
            inputMode="numeric"
            required
          />
          <TextField
            control={form.control}
            name="learnerAges"
            label="Learner age(s)"
            required
            placeholder="For example: 9 and 12"
            description="Ages only; please do not enter learner names. This tour is for ages 7–17."
          />
          <TextareaField
            control={form.control}
            name="message"
            label="Questions or accessibility needs (optional)"
            rows={3}
          />
          <CheckboxField
            control={form.control}
            name="consent"
            label="I agree to EduWings contacting me about this tour."
            description="This inquiry does not reserve a place or collect payment."
          />
        </div>

        <HoneypotField registration={form.register("website")} />

        <Button type="submit" size="lg" className="mt-7 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 aria-hidden className="size-4 animate-spin" />
              Sending inquiry
            </>
          ) : (
            <>
              <Send aria-hidden className="size-4" />
              Send inquiry
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
