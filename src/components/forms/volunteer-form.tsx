"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { HeartHandshake, Loader2 } from "lucide-react";

import { routes } from "@/config/routes";
import {
  VOLUNTEER_AVAILABILITY,
  VOLUNTEER_ROLES,
  volunteerSchema,
  type VolunteerInput,
} from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CheckboxField, SelectField, TextareaField, TextField } from "@/components/forms/fields";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { FormSuccess } from "@/components/forms/form-success";

function VolunteerForm({ className }: { className?: string }) {
  const form = useForm<VolunteerInput>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: VOLUNTEER_ROLES[0],
      organisation: "",
      yearsExperience: 5,
      availability: VOLUNTEER_AVAILABILITY[1],
      county: "",
      motivation: "",
      consent: false,
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess } = useApiForm({
    endpoint: "/api/volunteer",
    form,
    successTitle: "Application received",
    successDescription: "We will be in touch about the next session near you.",
  });

  if (isSuccess) {
    return (
      <FormSuccess
        className={className}
        title="Thank you — genuinely"
        description="Volunteers are the reason this programme works at all. Someone will contact you about the next session within your reach."
        nextSteps={[
          "We call you for a short conversation — no formal interview.",
          "You shadow one session before leading anything.",
          "You choose which visits you can make, term by term.",
        ]}
        action={{ label: "See what a session involves", href: routes.activities }}
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
            required
            autoComplete="tel"
            placeholder="0700 000 000"
          />
          <TextField
            control={form.control}
            name="county"
            label="Which county are you based in?"
            required
            placeholder="e.g. Nairobi"
          />
          <SelectField
            control={form.control}
            name="role"
            label="What do you do?"
            required
            options={VOLUNTEER_ROLES}
          />
          <TextField
            control={form.control}
            name="organisation"
            label="Employer"
            autoComplete="organization"
            description="Optional — we never name employers without permission."
          />
          <TextField
            control={form.control}
            name="yearsExperience"
            label="Years in the industry"
            type="number"
            inputMode="numeric"
            required
          />
          <SelectField
            control={form.control}
            name="availability"
            label="How often could you help?"
            required
            options={VOLUNTEER_AVAILABILITY}
          />
          <TextareaField
            control={form.control}
            name="motivation"
            label="Why do you want to do this?"
            required
            rows={5}
            className="sm:col-span-2"
            placeholder="You do not need teaching experience. Students are far more interested in what you actually do than in how polished you are while describing it."
          />
          <CheckboxField
            control={form.control}
            name="consent"
            className="sm:col-span-2"
            label="I understand that volunteering with students requires a background check."
            description="Standard safeguarding practice. We will explain the process when we call."
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
              <HeartHandshake className="size-4" />
              Apply to volunteer
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export { VolunteerForm };
