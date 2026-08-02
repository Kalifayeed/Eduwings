"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Check, Loader2 } from "lucide-react";

import { newsletterSchema, type NewsletterInput } from "@/lib/validation/schemas";
import { useApiForm } from "@/hooks/use-api-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HoneypotField } from "@/components/forms/honeypot-field";

/**
 * Newsletter subscription. Deliberately one field — every additional input
 * measurably reduces sign-ups, and a name we do not need is not worth the cost.
 */
function NewsletterForm({ source = "website" }: { source?: string }) {
  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "", source, website: "" },
  });

  const { submit, isSubmitting, isSuccess } = useApiForm({
    endpoint: "/api/newsletter",
    form,
    successTitle: "You're subscribed",
    successDescription: "One email a term, starting with the next one.",
  });

  if (isSuccess) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-5 text-white">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold-400 text-navy-900">
          <Check className="size-5" strokeWidth={3} />
        </span>
        <p className="text-sm leading-relaxed">
          <span className="block font-semibold">You&rsquo;re on the list.</span>
          Look out for our next term update.
        </p>
      </div>
    );
  }

  const error = form.formState.errors.email?.message;

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            {...form.register("email")}
            id="newsletter-email"
            type="email"
            autoComplete="email"
            placeholder="you@school.ac.ke"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "newsletter-email-error" : undefined}
            className="h-12 border-white/25 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/50 focus-visible:ring-white/25"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          variant="accent"
          disabled={isSubmitting}
          className="h-12 shrink-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Subscribing
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>

      {error ? (
        <p
          id="newsletter-email-error"
          role="alert"
          className="mt-2 text-xs font-medium text-gold-200"
        >
          {error}
        </p>
      ) : (
        <p className="mt-2.5 text-xs text-white/60">
          We never share your address, and every email has a one-click unsubscribe.
        </p>
      )}

      <HoneypotField registration={form.register("website")} />
    </form>
  );
}

export { NewsletterForm };
