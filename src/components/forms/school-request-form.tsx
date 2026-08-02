"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, School } from "lucide-react";

import { routes } from "@/config/routes";
import {
  SCHOOL_LEVELS,
  schoolRequestSchema,
  type SchoolRequestInput,
} from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CheckboxField, SelectField, TextareaField, TextField } from "@/components/forms/fields";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { FormSuccess } from "@/components/forms/form-success";

/**
 * The highest-value form on the site — a school visit request is the outcome
 * every other page is trying to produce. Grouped into three short sections so
 * it never reads as a wall of inputs.
 */
function SchoolRequestForm({ className }: { className?: string }) {
  const form = useForm<SchoolRequestInput>({
    resolver: zodResolver(schoolRequestSchema),
    defaultValues: {
      schoolName: "",
      level: SCHOOL_LEVELS[1],
      county: "",
      town: "",
      contactName: "",
      role: "",
      email: "",
      phone: "",
      studentCount: 120,
      preferredTerm: "",
      notes: "",
      consent: false,
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess, reset } = useApiForm({
    endpoint: "/api/schools",
    form,
    successTitle: "Request received",
    successDescription: "We will be in touch within three working days.",
  });

  if (isSuccess) {
    return (
      <FormSuccess
        className={className}
        title="We have your request"
        description="Thank you. Bringing EduWings to a school costs the school nothing, and we will work around your timetable."
        nextSteps={[
          "We reply within three working days to confirm we can reach you.",
          "We agree a date and the year groups taking part.",
          "You receive the curriculum mapping in advance for your teachers.",
        ]}
        action={{ label: "See the programme", href: routes.program }}
        onReset={reset}
        resetLabel="Request for another school"
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate className={className}>
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="mb-4 font-mono text-xs tracking-[0.18em] text-primary uppercase">
            About the school
          </legend>

          <TextField
            control={form.control}
            name="schoolName"
            label="School name"
            required
            className="sm:col-span-2"
            autoComplete="organization"
          />
          <SelectField
            control={form.control}
            name="level"
            label="Level"
            required
            options={SCHOOL_LEVELS}
          />
          <TextField
            control={form.control}
            name="county"
            label="County"
            required
            placeholder="e.g. Machakos"
          />
          <TextField control={form.control} name="town" label="Town or ward" />
          <TextField
            control={form.control}
            name="studentCount"
            label="How many students?"
            type="number"
            inputMode="numeric"
            required
            description="A rough figure is fine."
          />
        </fieldset>

        <fieldset className="mt-10 grid gap-5 sm:grid-cols-2">
          <legend className="mb-4 font-mono text-xs tracking-[0.18em] text-primary uppercase">
            Who we should talk to
          </legend>

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
            placeholder="e.g. Head Teacher, Careers Master"
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
        </fieldset>

        <fieldset className="mt-10 grid gap-5">
          <legend className="mb-4 font-mono text-xs tracking-[0.18em] text-primary uppercase">
            Timing and anything else
          </legend>

          <TextField
            control={form.control}
            name="preferredTerm"
            label="When would suit you?"
            placeholder="e.g. Term 2, or any time after the mocks"
          />
          <TextareaField
            control={form.control}
            name="notes"
            label="Anything we should know?"
            rows={4}
            placeholder="Available facilities, distance from the nearest town, whether you have power, particular careers your students ask about…"
          />
          <CheckboxField
            control={form.control}
            name="consent"
            label="I am authorised to make this request on behalf of the school."
            description="We will only use these details to arrange the visit."
          />
        </fieldset>

        <HoneypotField registration={form.register("website")} />

        <Button type="submit" size="xl" className="mt-9 w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending request
            </>
          ) : (
            <>
              <School className="size-4" />
              Request a visit
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export { SchoolRequestForm };
