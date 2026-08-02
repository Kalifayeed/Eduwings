"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { formatDate, initialsOf } from "@/lib/utils";
import { routes } from "@/config/routes";
import type { AppRole } from "@/lib/supabase/database.types";
import { updateRecord } from "@/lib/admin/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

const ROLES: { value: AppRole; label: string }[] = [
  { value: "viewer", label: "Viewer" },
  { value: "editor", label: "Editor" },
  { value: "admin", label: "Administrator" },
];

const ROLE_VARIANT: Record<string, "default" | "accent" | "muted"> = {
  admin: "accent",
  editor: "default",
  viewer: "muted",
};

function UserTable({ users, currentUserId }: { users: ProfileRow[]; currentUserId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const changeRole = (id: string, role: string) => {
    startTransition(async () => {
      const result = await updateRecord("profiles", id, { role }, routes.admin.users);
      if (result.ok) {
        toast.success("Role updated");
        router.refresh();
      } else {
        toast.error("Could not change that role", { description: result.error });
      }
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Person</TableHead>
            <TableHead className="hidden md:table-cell">Joined</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((profile) => {
            const isSelf = profile.id === currentUserId;

            return (
              <TableRow key={profile.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initialsOf(profile.full_name ?? profile.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {profile.full_name ?? profile.email}
                        {isSelf ? (
                          <Badge variant="muted" className="ml-2">
                            You
                          </Badge>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {formatDate(profile.created_at, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>

                <TableCell>
                  {isSelf ? (
                    // Preventing self-demotion removes the most common way an
                    // organisation locks itself out of its own console.
                    <div className="flex items-center gap-2">
                      <Badge variant={ROLE_VARIANT[profile.role] ?? "muted"}>
                        {ROLES.find((role) => role.value === profile.role)?.label ?? profile.role}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        (ask another admin to change this)
                      </span>
                    </div>
                  ) : (
                    <Select
                      value={profile.role}
                      onValueChange={(value) => changeRole(profile.id, value)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-9 w-44" aria-label={`Role for ${profile.email}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export { UserTable };
