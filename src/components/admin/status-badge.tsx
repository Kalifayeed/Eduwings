import { Archive, CircleDashed, CircleCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

const STATUS_META = {
  published: { label: "Published", variant: "success" as const, icon: CircleCheck },
  draft: { label: "Draft", variant: "muted" as const, icon: CircleDashed },
  archived: { label: "Archived", variant: "secondary" as const, icon: Archive },
};

/** Consistent lifecycle indicator across every admin list and editor. */
function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status as keyof typeof STATUS_META] ?? STATUS_META.draft;
  const Icon = meta.icon;

  return (
    <Badge variant={meta.variant}>
      <Icon className="size-3.5" aria-hidden />
      {meta.label}
    </Badge>
  );
}

export { StatusBadge };
