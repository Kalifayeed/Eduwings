import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level loading state for the public site.
 *
 * Mirrors the shape every page shares — a hero band followed by a content grid —
 * so the transition is a fill rather than a reflow. The skeletons themselves are
 * `aria-hidden`; a single live-region message carries the state to screen
 * readers instead of announcing dozens of empty boxes.
 */
export default function MarketingLoading() {
  return (
    <>
      <p role="status" aria-live="polite" className="sr-only">
        Loading page content
      </p>

      <div className="border-b bg-aurora">
        <div className="container-page pt-10 pb-16 sm:pb-20">
          <Skeleton className="h-4 w-56" />
          <Skeleton className="mt-8 h-3.5 w-40" />
          <Skeleton className="mt-6 h-12 w-full max-w-2xl" />
          <Skeleton className="mt-3 h-12 w-full max-w-xl" />
          <Skeleton className="mt-7 h-4 w-full max-w-2xl" />
          <Skeleton className="mt-2.5 h-4 w-full max-w-lg" />
          <div className="mt-9 flex gap-3">
            <Skeleton className="h-12 w-48 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="container-page py-20">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="mt-5 h-9 w-full max-w-lg" />
        <Skeleton className="mt-4 h-4 w-full max-w-2xl" />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      </div>
    </>
  );
}
