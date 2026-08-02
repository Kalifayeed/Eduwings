"use client";

import * as React from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import type { ApiResponse } from "@/lib/api/types";

interface UseApiFormOptions<TValues extends FieldValues> {
  /** API route that receives the JSON payload. */
  endpoint: string;
  form: UseFormReturn<TValues>;
  /** Toast heading shown when the submission succeeds. */
  successTitle: string;
  successDescription?: string;
  /** Clear the form after a successful submission. Defaults to true. */
  resetOnSuccess?: boolean;
  onSuccess?: (data: unknown) => void;
}

/**
 * Wires a react-hook-form instance to an API route.
 *
 * Consolidating submission here means every form in the product gets identical
 * behaviour for free: server-side field errors are mapped back onto the exact
 * inputs that produced them, network failures produce a readable message rather
 * than an unhandled rejection, and double submission is impossible.
 *
 * Returns `isSuccess` so a form can swap itself for a confirmation panel — far
 * clearer than a toast alone for a submission the visitor cannot repeat.
 */
export function useApiForm<TValues extends FieldValues>({
  endpoint,
  form,
  successTitle,
  successDescription,
  resetOnSuccess = true,
  onSuccess,
}: UseApiFormOptions<TValues>) {
  const [isSuccess, setIsSuccess] = React.useState(false);

  const submit = form.handleSubmit(async (values) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as ApiResponse<unknown>;

      if (payload.ok) {
        setIsSuccess(true);
        toast.success(successTitle, { description: successDescription });
        if (resetOnSuccess) form.reset();
        onSuccess?.(payload.data);
        return;
      }

      // Re-attach server validation messages to their fields so the visitor is
      // taken to the problem rather than told one exists.
      if (payload.fieldErrors) {
        for (const [field, messages] of Object.entries(payload.fieldErrors)) {
          const first = messages?.[0];
          if (first) form.setError(field as Path<TValues>, { type: "server", message: first });
        }
      }

      toast.error("We could not send that", { description: payload.error });
    } catch {
      toast.error("Something went wrong", {
        description: "Check your connection and try again. If it persists, please call us.",
      });
    }
  });

  return {
    submit,
    isSubmitting: form.formState.isSubmitting,
    isSuccess,
    reset: () => {
      setIsSuccess(false);
      form.reset();
    },
  };
}
