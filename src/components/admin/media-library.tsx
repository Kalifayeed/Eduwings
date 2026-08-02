"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Copy, ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { cn, formatDate, slugify } from "@/lib/utils";
import { routes } from "@/config/routes";
import { createClient } from "@/lib/supabase/client";
import { createRecord, deleteRecord } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface MediaAsset {
  id: string;
  file_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at: string;
}

const MAX_BYTES = 10 * 1024 * 1024;

/**
 * Media library.
 *
 * Uploads go directly from the browser to Supabase Storage using the signed-in
 * user's session, so a large file never passes through our server and the
 * bucket's own policies decide whether the write is allowed. The database row
 * is written afterwards through the standard admin action, which keeps the
 * authorisation path identical to every other resource.
 */
function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const supabase = createClient();
    if (!supabase) {
      toast.error("Storage is not configured on this deployment.");
      return;
    }

    setUploading(true);

    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is too large`, { description: "The limit is 10 MB per file." });
        continue;
      }

      // Prefix with a timestamp so re-uploading a file with the same name does
      // not silently replace the original, which may still be referenced.
      const safeName = slugify(file.name.replace(/\.[^.]+$/, ""));
      const extension = file.name.split(".").pop() ?? "bin";
      const path = `${new Date().getFullYear()}/${Date.now()}-${safeName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "31536000", upsert: false });

      if (uploadError) {
        toast.error(`Could not upload ${file.name}`, { description: uploadError.message });
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("media").getPublicUrl(path);

      const dimensions = await readImageDimensions(file);

      const result = await createRecord(
        "media_assets",
        {
          file_name: file.name,
          url: publicUrl,
          mime_type: file.type || "application/octet-stream",
          size_bytes: file.size,
          width: dimensions?.width ?? null,
          height: dimensions?.height ?? null,
        },
        routes.admin.media,
      );

      if (!result.ok) {
        toast.error(`Uploaded ${file.name}, but could not record it`, {
          description: result.error,
        });
      }
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    toast.success("Upload complete");
    router.refresh();
  };

  const copyUrl = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.id);
      toast.success("URL copied");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Could not copy", { description: asset.url });
    }
  };

  const remove = (asset: MediaAsset) => {
    startTransition(async () => {
      const result = await deleteRecord("media_assets", asset.id, routes.admin.media);
      if (result.ok) {
        toast.success("Removed from the library", {
          description: "Any page still referencing this URL will now show placeholder artwork.",
        });
        router.refresh();
      } else {
        toast.error("Could not remove", { description: result.error });
      }
    });
  };

  return (
    <div>
      {/* ── Dropzone ────────────────────────────────────────────────────── */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void upload(event.dataTransfer.files);
        }}
        className={cn(
          "rounded-2xl border border-dashed p-10 text-center transition-colors",
          dragging ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-muted-foreground">
          {uploading ? (
            <Loader2 className="size-6 animate-spin" aria-hidden />
          ) : (
            <Upload className="size-6" aria-hidden />
          )}
        </span>

        <p className="mt-5 font-display text-base font-semibold">
          {uploading ? "Uploading…" : "Drop files here"}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          JPEG, PNG, WebP, AVIF, SVG or MP4. Up to 10 MB each.
        </p>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,video/mp4"
          className="sr-only"
          id="media-upload"
          onChange={(event) => void upload(event.target.files)}
        />

        <Button asChild variant="outline" className="mt-6" disabled={uploading}>
          <label htmlFor="media-upload" className="cursor-pointer">
            Choose files
          </label>
        </Button>
      </div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      {assets.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={ImageIcon}
          title="The library is empty"
          description="Upload photography here, then paste the URL into an article, event or gallery item. Until then, every image slot renders designed placeholder artwork."
        />
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <li key={asset.id} className="overflow-hidden rounded-2xl border bg-card">
              <div className="relative aspect-[4/3] bg-secondary">
                {asset.mime_type.startsWith("image/") ? (
                  <Image
                    src={asset.url}
                    alt={asset.alt_text ?? asset.file_name}
                    fill
                    sizes="(min-width: 1280px) 18rem, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-xs text-muted-foreground">
                    {asset.mime_type}
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="truncate text-sm font-medium" title={asset.file_name}>
                  {asset.file_name}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {formatBytes(asset.size_bytes)}
                  {asset.width && asset.height ? ` · ${asset.width}×${asset.height}` : ""}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(asset.created_at, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>

                <div className="mt-4 flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => void copyUrl(asset)}
                  >
                    {copiedId === asset.id ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    Copy URL
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={isPending}
                    onClick={() => remove(asset)}
                    aria-label={`Remove ${asset.file_name}`}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Read intrinsic dimensions so the media grid and `next/image` can size correctly. */
function readImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return Promise.resolve(null);

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };

    image.src = url;
  });
}

export { MediaLibrary };
