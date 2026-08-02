"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Handshake, Loader2 } from "lucide-react";

import { routes } from "@/config/routes";
import {
  PARTNERSHIP_TYPES,
  partnershipSchema,
  type PartnershipInput,
} from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectField, TextareaField, TextField } from "@/components/forms/fields";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { FormSuccess } from "@/components/forms/form-success";

function PartnershipForm({ className }: { className?: string }) {
  const form = useForm<PartnershipInput>({
    resolver: zodResolver(partnershipSchema),
    defaultValues: {
      organisation: "",
      contactName: "",
      role: "",
      email: "",
      phone: "",
      type: PARTNERSHIP_TYPES[0],
      message: "",
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess } = useApiForm({
    endpoint: "/api/partnership",
    form,
    successTitle: "Enquiry received",
    successDescription: "We will come back to you within three working days.",
  });

  if (isSuccess) {
    return (
      <FormSuccess
        className={className}
        title="Thank you for reaching out"
        description="We will come back to you within three working days with a concrete proposal rather than a brochure."
        nextSteps={[
          "A short call to understand what you can realistically offer.",
          "We propose specific schools, dates and outcomes.",
          "You receive an impact report after every visit you support.",
        ]}
        action={{ label: "See our current partners", href: routes.partners }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate className={className}>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            control={form.control}
            name="organisation"
            label="Organisation"
            required
            className="sm:col-span-2"
            autoComplete="organization"
          />
          <TextField
            control={form.control}
            name="contactName"
            label="Your name"
            required
            autoComplete="name"
          />
          <TextField
            control={form.control}
            name="role"
            label="Your role"
            required
            autoComplete="organization-title"
          />
          <TextField
            control={form.control}
            name="email"
            label="Work email"
            type="email"
            required
            autoComplete="email"
          />
          <TextField
            control={form.control}
            name="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            placeholder="0700 000 000"
          />
          <SelectField
            control={form.control}
            name="type"
            label="How would you like to help?"
            required
            className="sm:col-span-2"
            options={PARTNERSHIP_TYPES}
          />
          <TextareaField
            control={form.control}
            name="message"
            label="Tell us more"
            required
            rows={5}
            className="sm:col-span-2"
            placeholder="What can your organisation realistically offer, and what would you want in return? Being specific here saves both of us a meeting."
          />
        </div>

        <HoneypotField registration={form.register("website")} />

        <Button type="submit" size="xl" className="mt-8 w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Handshake className="size-4" />
              Start the conversation
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export { PartnershipForm };
