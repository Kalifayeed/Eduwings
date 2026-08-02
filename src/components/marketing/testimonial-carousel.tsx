"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

import { cn, initialsOf } from "@/lib/utils";
import type { Testimonial } from "@/lib/content/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/**
 * Testimonial carousel.
 *
 * Accessibility notes: the viewport is a labelled region with `aria-roledescription`,
 * slides are addressable, and the previous/next controls are real buttons that
 * disable at the ends. Crucially there is no autoplay — a quotation that moves
 * on its own is hostile to slow readers and fails WCAG 2.2.2.
 */
function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false, skipSnaps: false });
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selected, setSelected] = React.useState(0);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;

    // The initial sync is deferred to an animation frame rather than run inline:
    // Embla measures the DOM to decide what can be scrolled, so reading it after
    // layout is both more accurate and avoids setting state synchronously inside
    // the effect, which would force an extra render on every mount.
    const frame = requestAnimationFrame(onSelect);
    emblaApi.on("select", onSelect).on("reInit", onSelect);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (testimonials.length === 0) return null;

  return (
    <div
      className="relative"
      role="region"
      aria-roledescription="carousel"
      aria-label="What schools, students and volunteers say"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <ul className="-ml-5 flex">
          {testimonials.map((testimonial, index) => (
            <li
              key={testimonial.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${testimonials.length}`}
              className="min-w-0 shrink-0 grow-0 basis-full pl-5 sm:basis-4/5 lg:basis-1/2 xl:basis-[38%]"
            >
              <figure className="flex h-full flex-col rounded-2xl border bg-card p-7 shadow-[var(--shadow-soft)]">
                <Quote aria-hidden className="size-8 shrink-0 text-primary/25" />

                <blockquote className="mt-5 flex-1">
                  <p className="text-base leading-relaxed text-balance">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </blockquote>

                <figcaption className="mt-7 flex items-center gap-3.5 border-t pt-5">
                  <Avatar className="size-11">
                    <AvatarFallback className="bg-primary/10 font-display font-semibold text-primary">
                      {initialsOf(testimonial.authorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{testimonial.authorName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {testimonial.authorRole} · {testimonial.organisation}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <div className="flex gap-1.5" aria-hidden>
          {testimonials.map((testimonial, index) => (
            <span
              key={testimonial.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === selected ? "w-6 bg-primary" : "w-1.5 bg-border",
              )}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            aria-label="Next testimonial"
          >
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export { TestimonialCarousel };
