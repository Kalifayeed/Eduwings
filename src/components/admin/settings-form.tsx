"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { updateRecord } from "@/lib/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Announcement {
  enabled: boolean;
  message: string;
  href: string;
}

/**
 * Operational toggles stored in `site_settings`.
 *
 * These are the things the team may need to change at short notice — closing
 * school requests during a term break, putting a banner up before an open day —
 * without waiting for a deployment.
 */
function SettingsForm({
  announcement,
  schoolRequestsOpen,
}: {
  announcement: Announcement;
  schoolRequestsOpen: boolean;
}) {
  const router = useRouter();
  const [banner, setBanner] = React.useState(announcement);
  const [requestsOpen, setRequestsOpen] = React.useState(schoolRequestsOpen);
  const [isPending, startTransition] = React.useTransition();

  const save = () => {
    startTransition(async () => {
      const results = await Promise.all([
        updateRecord(
          "site_settings",
          "announcement",
          { value: banner },
          routes.admin.settings,
          "key",
        ),
        updateRecord(
          "site_settings",
          "school_requests_open",
          { value: { enabled: requestsOpen } },
          routes.admin.settings,
          "key",
        ),
      ]);

      const failure = results.find((result) => !result.ok);

      if (failure) {
        toast.error("Could not save settings", { description: failure.error });
        return;
      }

      toast.success("Settings saved");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
      className="grid gap-6 rounded-2xl border bg-card p-6"
    >
      <fieldset className="grid gap-4">
        <legend className="text-sm font-semibold">Site announcement</legend>

        <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
          <div>
            <Label htmlFor="announcement-enabled">Show an announcement banner</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Appears above the header on every page.
            </p>
          </div>
          <Switch
            id="announcement-enabled"
            checked={banner.enabled}
            onCheckedChange={(enabled) => setBanner((current) => ({ ...current, enabled }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="announcement-message">Message</Label>
          <Textarea
            id="announcement-message"
            rows={2}
            value={banner.message}
            onChange={(event) =>
              setBanner((current) => ({ ...current, message: event.target.value }))
            }
            placeholder="Registration for the Nairobi Open Day closes on Friday."
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="announcement-href">Link</Label>
          <Input
            id="announcement-href"
            value={banner.href}
            onChange={(event) => setBanner((current) => ({ ...current, href: event.target.value }))}
            placeholder="/events/eduwings-open-day-nairobi"
            className="font-mono text-sm"
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-4 border-t pt-6">
        <legend className="text-sm font-semibold">School requests</legend>

        <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
          <div>
            <Label htmlFor="requests-open">Accepting school visit requests</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Turn this off during a term break so schools are not left waiting for a reply.
            </p>
          </div>
          <Switch id="requests-open" checked={requestsOpen} onCheckedChange={setRequestsOpen} />
        </div>
      </fieldset>

      <div className="flex justify-end border-t pt-6">
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Save settings
        </Button>
      </div>
    </form>
  );
}

export { SettingsForm };
