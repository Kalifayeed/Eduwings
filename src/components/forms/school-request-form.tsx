"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, School } from "lucide-react";

import { routes } from "@/config/routes";
import {
  PROGRAMMES_REQUESTED,
  SCHOOL_LEVELS,
  SCHOOL_TYPES,
  schoolRequestSchema,
  type SchoolRequestInput,
} from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  CheckboxField,
  CheckboxGroupField,
  SelectField,
  TextareaField,
  TextField,
} from "@/components/forms/fields";
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
      schoolType: SCHOOL_TYPES[0],
      level: SCHOOL_LEVELS[1],
      county: "",
      town: "",
      address: "",
      schoolWebsite: "",
      contactName: "",
      role: "",
      email: "",
      phone: "",
      studentCount: 120,
      targetGrades: "",
      teacherCount: 2,
      programmesRequested: [],
      preferredDate: "",
      alternativeDate: "",
      preferredTime: "",
      notes: "",
      consent: false,
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess, reset } = useApiForm({
    endpoint: "/api/schools",
    form,
    successTitle: "Quotation request received",
    successDescription: "We will be in touch within three working days.",
  });

  if (isSuccess) {
    return (
      <FormSuccess
        className={className}
        title="We have your quotation request"
        description="Thank you. We will review your requirements and prepare an itemised quotation. Your request does not confirm a booking."
        nextSteps={[
          "We reply within three working days to discuss your modules, group size and dates.",
          "You receive a quotation for school-based teaching and any separately costed field trip.",
          "Dates and arrangements are confirmed after quotation approval and any required host confirmation.",
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
            name="schoolType"
            label="School type"
            required
            options={SCHOOL_TYPES}
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
            name="address"
            label="Physical address or landmark"
            required
            className="sm:col-span-2"
          />
          <TextField
            control={form.control}
            name="schoolWebsite"
            label="School website"
            type="url"
            placeholder="https://…"
          />
          <TextField
            control={form.control}
            name="studentCount"
            label="How many students?"
            type="number"
            inputMode="numeric"
            required
            description="A rough figure is fine."
          />
          <TextField
            control={form.control}
            name="targetGrades"
            label="Which grades or forms?"
            required
            placeholder="e.g. Grade 7–9, or Form 2–4"
          />
          <TextField
            control={form.control}
            name="teacherCount"
            label="Accompanying teachers"
            type="number"
            inputMode="numeric"
            required
          />
        </fieldset>

        <fieldset className="mt-10 grid gap-5">
          <legend className="mb-4 font-mono text-xs tracking-[0.18em] text-primary uppercase">
            Which services should we quote for?
          </legend>
          <CheckboxGroupField
            control={form.control}
            name="programmesRequested"
            label="Choose everything that applies"
            required
            options={PROGRAMMES_REQUESTED}
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

          <div className="grid gap-5 sm:grid-cols-3">
            <TextField
              control={form.control}
              name="preferredDate"
              label="Preferred date"
              type="date"
              required
            />
            <TextField
              control={form.control}
              name="alternativeDate"
              label="Alternative date"
              type="date"
            />
            <TextField
              control={form.control}
              name="preferredTime"
              label="Preferred time"
              type="time"
            />
          </div>
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
            description="We will use these details to prepare your quotation and discuss the arrangements."
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
              Get Quotation
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export { SchoolRequestForm };
