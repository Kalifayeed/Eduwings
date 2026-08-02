import Link from "next/link";
import { Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: { label: string; href: string };
  className?: string;
}

/**
 * Shared empty state.
 *
 * An empty list is a dead end unless it offers a way out, so every use supplies
 * an action. Consistency here matters: a visitor who hits an empty gallery
 * filter and an empty article filter should recognise the same pattern.
 */
function EmptyState({
  title,
  description,
  icon: Icon = Compass,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-border/70 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
        <Icon className="size-6" aria-hidden />
      </span>
      <h2 className="mt-6 font-display text-lg font-semibold">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action ? (
        <Button asChild variant="outline" className="mt-7">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </div>
  );
}

export { EmptyState };
