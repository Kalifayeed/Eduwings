import { cn } from "@/lib/utils";

/**
 * Loading placeholder. Marked `aria-hidden` and paired with a visually hidden
 * live-region message by the surrounding `loading.tsx`, so screen readers
 * announce "Loading" once rather than reading a wall of empty boxes.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("shimmer rounded-lg bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
