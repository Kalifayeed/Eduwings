"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { HandHeart, Loader2 } from "lucide-react";

import { cn, formatCurrency } from "@/lib/utils";
import { routes } from "@/config/routes";
import { DONATION_FREQUENCIES, donationSchema, type DonationInput } from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CheckboxField, SelectField, TextareaField, TextField } from "@/components/forms/fields";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { FormSuccess } from "@/components/forms/form-success";

/** Amounts tied to a concrete outcome rather than round numbers. */
const PRESET_AMOUNTS = [
  { amount: 2500, label: "Materials for one classroom" },
  { amount: 12000, label: "A simulator session" },
  { amount: 45000, label: "A full school day" },
  { amount: 180000, label: "A whole term upcountry" },
] as const;

/**
 * Donation intent form.
 *
 * This deliberately captures an intent rather than taking a payment. Handling
 * card or M-Pesa details requires a payment provider integration and the
 * compliance work that comes with it; collecting an intent and following up with
 * proper payment instructions is the correct first step, and the honest one.
 * The `payments` future-work item in the README covers the upgrade path.
 */
function DonationForm({ className }: { className?: string }) {
  const form = useForm<DonationInput>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      amountKes: 45000,
      frequency: DONATION_FREQUENCIES[0],
      designation: "",
      isOrganisation: false,
      organisation: "",
      note: "",
      website: "",
    },
  });

  const { submit, isSubmitting, isSuccess } = useApiForm({
    endpoint: "/api/donate",
    form,
    successTitle: "Thank you",
    successDescription: "We will send payment instructions by email.",
  });

  // `useWatch` rather than `form.watch()`: the latter returns a fresh function
  // on every render, which opts the whole component out of compiler memoisation.
  const amount = useWatch({ control: form.control, name: "amountKes" });
  const isOrganisation = useWatch({ control: form.control, name: "isOrganisation" });

  const setAmount = React.useCallback(
    (value: number) => form.setValue("amountKes", value, { shouldValidate: true }),
    [form],
  );

  if (isSuccess) {
    return (
      <FormSuccess
        className={className}
        title="Thank you — that reaches a classroom"
        description="We will email payment instructions, including M-Pesa and bank transfer details, within one working day."
        nextSteps={[
          "Payment instructions arrive by email within one working day.",
          "You receive a receipt as soon as the gift clears.",
          "We write to you after the visit your gift funded, with what happened.",
        ]}
        action={{ label: "See where we have been", href: routes.schools }}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={submit} noValidate className={className}>
        <fieldset>
          <legend className="mb-4 font-mono text-xs tracking-[0.18em] text-primary uppercase">
            Choose an amount
          </legend>

          <div className="grid gap-3 sm:grid-cols-2">
            {PRESET_AMOUNTS.map((preset) => {
              const selected = amount === preset.amount;
              return (
                <button
                  key={preset.amount}
                  type="button"
                  onClick={() => setAmount(preset.amount)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all duration-200",
                    selected
                      ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                      : "hover:border-primary/40",
                  )}
                >
                  <span className="block font-display text-lg font-bold">
                    {formatCurrency(preset.amount)}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <TextField
              control={form.control}
              name="amountKes"
              label="Or enter your own amount (KES)"
              type="number"
              inputMode="numeric"
              required
            />
            <SelectField
              control={form.control}
              name="frequency"
              label="How often?"
              required
              options={DONATION_FREQUENCIES}
            />
          </div>
        </fieldset>

        <fieldset className="mt-10 grid gap-5 sm:grid-cols-2">
          <legend className="mb-4 font-mono text-xs tracking-[0.18em] text-primary uppercase">
            Your details
          </legend>

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
          />
          <TextField
            control={form.control}
            name="designation"
            label="Direct this gift somewhere?"
            placeholder="e.g. a specific county or school"
            description="Optional. We will honour it where we can."
          />

          <CheckboxField
            control={form.control}
            name="isOrganisation"
            className="sm:col-span-2"
            label="I am giving on behalf of an organisation."
          />

          {isOrganisation ? (
            <TextField
              control={form.control}
              name="organisation"
              label="Organisation name"
              className="sm:col-span-2"
              autoComplete="organization"
            />
          ) : null}

          <TextareaField
            control={form.control}
            name="note"
            label="Anything you would like to tell us?"
            rows={3}
            className="sm:col-span-2"
          />
        </fieldset>

        <HoneypotField registration={form.register("website")} />

        <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
          This form records your intention to give. We will email payment instructions — M-Pesa or
          bank transfer — within one working day. No card details are collected on this site.
        </p>

        <Button type="submit" size="xl" className="mt-6 w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              <HandHeart className="size-4" />
              Give {formatCurrency(amount || 0)}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export { DonationForm };
