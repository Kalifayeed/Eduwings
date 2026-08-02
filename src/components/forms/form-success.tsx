import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FormSuccessProps {
  title: string;
  description: string;
  /** What happens next, in order. Reduces "have they received it?" follow-ups. */
  nextSteps?: string[];
  action?: { label: string; href: string };
  /** Lets the visitor submit again — useful for school and volunteer forms. */
  onReset?: () => void;
  resetLabel?: string;
  className?: string;
}

/**
 * Replaces a form after successful submission.
 *
 * A toast alone is not enough for a submission the visitor cannot repeat: it
 * disappears, and it does not tell them what happens next. The panel is marked
 * as a live region so the change is announced rather than silently swapped.
 */
function FormSuccess({
  title,
  description,
  nextSteps,
  action,
  onReset,
  resetLabel = "Submit another",
  className,
}: FormSuccessProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("rounded-2xl border border-success/30 bg-success/5 p-8 text-center", className)}
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-success text-success-foreground">
        <CheckCircle2 className="size-6" aria-hidden />
      </span>

      <h2 className="mt-5 font-display text-xl font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">{description}</p>

      {nextSteps?.length ? (
        <ol className="mx-auto mt-7 grid max-w-sm gap-3 text-left">
          {nextSteps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success/15 text-xs font-semibold text-success">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {action ? (
          <Button asChild>
            <Link href={action.href}>{action.label}</Link>
          </Button>
        ) : null}
        {onReset ? (
          <Button variant="outline" onClick={onReset}>
            {resetLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export { FormSuccess };
