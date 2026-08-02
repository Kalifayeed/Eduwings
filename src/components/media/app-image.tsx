import Image from "next/image";

import { cn } from "@/lib/utils";
import { PlaceholderArt, type ArtMotif, type ArtTone } from "@/components/media/placeholder-art";

export interface AppImageProps {
  /**
   * Real asset path or URL. When absent — which is the case for all seeded
   * content until photography is delivered — designed placeholder art is drawn
   * instead. Populating this field is therefore the entire migration path from
   * placeholder to production imagery: no component changes are required.
   */
  src?: string | null;
  /**
   * Describes the image for assistive technology. Pass an empty string only when
   * the image is purely decorative and the surrounding text already conveys it.
   */
  alt: string;
  /** Stable identity (usually a slug) driving the placeholder's appearance. */
  seed: string;
  motif?: ArtMotif;
  tone?: ArtTone;
  label?: string;
  className?: string;
  /** Passed to next/image; set on above-the-fold imagery only. */
  priority?: boolean;
  /** Responsive hint for next/image. Defaults to a sensible card width. */
  sizes?: string;
  /** Applied to the `<img>` itself rather than the wrapper. */
  imageClassName?: string;
}

/**
 * The single image entry point for the whole product.
 *
 * Every content surface renders through this component, which means image
 * optimisation policy, aspect-ratio handling and the placeholder fallback are
 * decided once. Callers control the frame; this controls the pixels.
 */
function AppImage({
  src,
  alt,
  seed,
  motif = "aircraft",
  tone,
  label,
  className,
  priority = false,
  sizes = "(min-width: 1280px) 30rem, (min-width: 768px) 45vw, 100vw",
  imageClassName,
}: AppImageProps) {
  if (!src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <PlaceholderArt seed={seed} motif={motif} tone={tone} label={label} />
        {alt ? <span className="sr-only">{alt}</span> : null}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}

export { AppImage };
