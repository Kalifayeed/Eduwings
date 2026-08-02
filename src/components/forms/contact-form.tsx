"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";

import { routes } from "@/config/routes";
import { CONTACT_TOPICS, contactSchema, type ContactInput } from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SelectField, TextareaField, TextField } from "@/components/forms/fields";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { FormSuccess } from "@/components/forms/form-success";

function ContactForm({ className }: { className?: string }) {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: CONTACT_TOPICS[0],
      message: "",
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess, reset } = useApiForm({
    endpoint: "/api/contact",
    form,
    successTitle: "Message sent",
    successDescription: "We reply to everything within two working days.",
  });

  if (isSuccess) {
    return (
      <FormSuccess
        className={className}
        title="Thank you — we have it"
        description="Someone from the team will read this personally and reply within two working days."
        nextSteps={[
          "We read every message ourselves; there is no queue system.",
          "If it is urgent, call us — the number is on this page.",
          "Expect a reply within two working days.",
        ]}
        action={{ label: "Back to home", href: routes.home }}
        onReset={reset}
        resetLabel="Send another message"
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate className={className}>
        <div className="grid gap-5 sm:grid-cols-2">
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
            autoComplete="tel"
            placeholder="0700 000 000"
            description="Optional, but it usually gets a faster answer."
          />
          <SelectField
            control={form.control}
            name="topic"
            label="What is this about?"
            required
            options={CONTACT_TOPICS}
          />
          <TextareaField
            control={form.control}
            name="message"
            label="Your message"
            required
            rows={6}
            className="sm:col-span-2"
            placeholder="Tell us about your school, your organisation, or what you are trying to find out."
          />
        </div>

        <HoneypotField registration={form.register("website")} />

        <Button type="submit" size="lg" className="mt-7" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <Send className="size-4" />
              Send message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export { ContactForm };
