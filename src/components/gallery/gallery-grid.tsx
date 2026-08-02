"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, MapPin, Play, X } from "lucide-react";

import { cn, formatDate } from "@/lib/utils";
import { GALLERY_CATEGORIES, type GalleryItem } from "@/lib/content/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { AppImage } from "@/components/media/app-image";

const ASPECT_CLASSES: Record<GalleryItem["aspectRatio"], string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

/**
 * Filterable gallery with a lightbox.
 *
 * Lightbox accessibility is handled by building on Radix `Dialog`: focus is
 * trapped and restored, Escape closes, and the backdrop is inert. On top of that
 * we add left/right arrow navigation, since a gallery a visitor must close and
 * reopen for each image is a gallery they stop using.
 */
function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = React.useState<string | null>(null);

  // The open index is stored with the filter it belongs to. A filter change can
  // leave an index pointing past the end of the new list, so rather than fixing
  // that up in an effect, an index from a stale filter simply reads as "closed".
  const [opened, setOpened] = React.useState<{ index: number; category: string | null } | null>(
    null,
  );
  const activeIndex = opened?.category === category ? opened.index : null;

  const setActiveIndex = React.useCallback(
    (index: number | null) => setOpened(index === null ? null : { index, category }),
    [category],
  );

  const visible = React.useMemo(
    () => (category ? items.filter((item) => item.category === category) : items),
    [items, category],
  );

  const active = activeIndex === null ? null : (visible[activeIndex] ?? null);

  /** Move by one item, refusing to run off either end of the filtered list. */
  const step = React.useCallback(
    (delta: number) => {
      if (activeIndex === null) return;
      const next = activeIndex + delta;
      if (next < 0 || next >= visible.length) return;
      setActiveIndex(next);
    },
    [activeIndex, visible.length, setActiveIndex],
  );

  React.useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, step]);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter the gallery by category"
        className="flex flex-wrap gap-2"
      >
        <FilterChip active={category === null} onClick={() => setCategory(null)}>
          Everything
          <span className="ml-1.5 opacity-60">{items.length}</span>
        </FilterChip>

        {GALLERY_CATEGORIES.map((option) => {
          const count = items.filter((item) => item.category === option).length;
          if (count === 0) return null;
          return (
            <FilterChip
              key={option}
              active={category === option}
              onClick={() => setCategory(option)}
            >
              {option}
              <span className="ml-1.5 opacity-60">{count}</span>
            </FilterChip>
          );
        })}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {items.length} items.
      </p>

      {visible.length === 0 ? (
        <EmptyState
          className="mt-12"
          title="Nothing here yet"
          description="We have not published anything in this category. Try another filter."
          action={{ label: "See everything", href: "#" }}
        />
      ) : (
        <RevealGroup
          as="ul"
          stagger={0.04}
          className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5 [&>li]:break-inside-avoid"
        >
          {visible.map((item, index) => (
            <RevealItem as="li" key={item.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group relative block w-full overflow-hidden rounded-2xl border text-left shadow-[var(--shadow-soft)] transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:shadow-[var(--shadow-float)] focus-visible:ring-2 focus-visible:ring-ring"
              >
                <div className={cn("relative w-full", ASPECT_CLASSES[item.aspectRatio])}>
                  <AppImage
                    src={item.url}
                    alt={item.title}
                    seed={item.id}
                    motif={item.mediaType === "video" ? "instruments" : "students"}
                    sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 100vw"
                    className="size-full transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                  />

                  {item.mediaType === "video" ? (
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="grid size-14 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm">
                        <Play className="size-6 translate-x-0.5" aria-hidden />
                      </span>
                    </span>
                  ) : null}

                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-5 pt-14">
                    <span className="block text-sm leading-snug font-semibold text-white">
                      {item.title}
                    </span>
                    {item.location ? (
                      <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/70">
                        <MapPin aria-hidden className="size-3" />
                        {item.location}
                      </span>
                    ) : null}
                  </span>
                </div>
              </button>
            </RevealItem>
          ))}
        </RevealGroup>
      )}

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      <Dialog open={active !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent
          showClose={false}
          className="max-w-5xl gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none"
        >
          {active ? (
            <>
              <DialogTitle className="sr-only">{active.title}</DialogTitle>
              <DialogDescription className="sr-only">
                {active.caption ?? "Gallery image"}. Item {(activeIndex ?? 0) + 1} of{" "}
                {visible.length}. Use the left and right arrow keys to navigate.
              </DialogDescription>

              <div className="overflow-hidden rounded-2xl border bg-card">
                <div className="relative aspect-[16/10] w-full bg-black">
                  {active.mediaType === "video" && active.videoUrl ? (
                    <iframe
                      src={active.videoUrl}
                      title={active.title}
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 size-full"
                    />
                  ) : (
                    <AppImage
                      src={active.url}
                      alt={active.title}
                      seed={active.id}
                      motif={active.mediaType === "video" ? "instruments" : "students"}
                      sizes="(min-width: 1024px) 64rem, 100vw"
                      className="size-full"
                      imageClassName="object-contain"
                    />
                  )}

                  <Button
                    variant="glass"
                    size="icon-sm"
                    onClick={() => setActiveIndex(null)}
                    aria-label="Close"
                    className="absolute top-3 right-3 border-white/20 text-white"
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-4 p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{active.category}</Badge>
                      {active.takenAt ? (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(active.takenAt)}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 font-display text-lg leading-snug font-semibold">
                      {active.title}
                    </h2>
                    {active.caption ? (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {active.caption}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="mr-1 font-mono text-xs text-muted-foreground">
                      {(activeIndex ?? 0) + 1} / {visible.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => step(-1)}
                      disabled={activeIndex === 0}
                      aria-label="Previous item"
                    >
                      <ArrowLeft className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => step(1)}
                      disabled={activeIndex === visible.length - 1}
                      aria-label="Next item"
                    >
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
          : "text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export { GalleryGrid };
