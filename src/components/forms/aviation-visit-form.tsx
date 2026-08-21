"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Plane } from "lucide-react";

import { routes } from "@/config/routes";
import {
  VISIT_DESTINATION_TYPES,
  VISIT_PURPOSES,
  VISIT_SCHOOL_LEVELS,
  VISIT_SCHOOL_TYPES,
  aviationVisitSchema,
  type AviationVisitInput,
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
 * Requests a visit *to* an aviation destination — an airport, airstrip or
 * training college — as distinct from `SchoolRequestForm`, which brings
 * EduWings to the school instead. Same shape and conventions deliberately,
 * so the two forms read as siblings rather than unrelated features.
 */
function AviationVisitForm({ className }: { className?: string }) {
  const form = useForm<AviationVisitInput>({
    resolver: zodResolver(aviationVisitSchema),
    defaultValues: {
      schoolName: "",
      schoolType: VISIT_SCHOOL_TYPES[0],
      level: VISIT_SCHOOL_LEVELS[1],
      county: "",
      town: "",
      contactName: "",
      role: "",
      email: "",
      phone: "",
      destinationType: VISIT_DESTINATION_TYPES[0],
      purposes: [],
      studentCount: 40,
      teacherCount: 2,
      preferredDate: "",
      alternativeDate: "",
      notes: "",
      consent: false,
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess, reset } = useApiForm({
    endpoint: "/api/visits",
    form,
    successTitle: "Request received",
    successDescription: "We will be in touch within three working days.",
  });

  if (isSuccess) {
    return (
      <FormSuccess
        className={className}
        title="We have your request"
        description="Thank you. We will check availability with the destination and confirm directly with you — this is a request, not a confirmed booking."
        nextSteps={[
          "We reply within three working days.",
          "We confirm feasibility with the destination and propose a date.",
          "You receive the final arrangements once everything is confirmed.",
        ]}
        action={{ label: "See the programme", href: routes.program }}
        onReset={reset}
        resetLabel="Request another visit"
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
            options={VISIT_SCHOOL_TYPES}
          />
          <SelectField
            control={form.control}
            name="level"
            label="Level"
            required
            options={VISIT_SCHOOL_LEVELS}
          />
          <TextField
            control={form.control}
            name="county"
            label="County"
            required
            placeholder="e.g. Machakos"
          />
          <TextField control={form.control} name="town" label="Town or ward" />
        </fieldset>

        <fieldset className="mt-10 grid gap-5">
          <legend className="mb-4 font-mono text-xs tracking-[0.18em] text-primary uppercase">
            Where you would like to go
          </legend>

          <SelectField
            control={form.control}
            name="destinationType"
            label="Destination type"
            required
            options={VISIT_DESTINATION_TYPES}
          />
          <CheckboxGroupField
            control={form.control}
            name="purposes"
            label="Purpose of the visit"
            required
            options={VISIT_PURPOSES}
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
            Timing and group size
          </legend>

          <div className="grid gap-5 sm:grid-cols-2">
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
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
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
              name="teacherCount"
              label="Accompanying teachers"
              type="number"
              inputMode="numeric"
              required
            />
          </div>
          <TextareaField
            control={form.control}
            name="notes"
            label="Anything we should know?"
            rows={4}
            placeholder="Accessibility needs, a specific institution in mind, particular careers your students ask about…"
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
              <Plane className="size-4" />
              Request this visit
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export { AviationVisitForm };
