import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Info, ShieldAlert } from "lucide-react";

import { routes } from "@/config/routes";
import { capabilities } from "@/lib/env";
import { getSessionUser, isStaff } from "@/lib/auth/session";
import { getContentSource } from "@/lib/content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · EduWings Admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin console shell and authorisation gate.
 *
 * Three checks, in order of what the visitor can do about them:
 *
 *  1. **Not configured** — the deployment has no database. Explain how to fix it.
 *  2. **Not signed in** — redirect to login. (Middleware normally catches this
 *     first; the check is repeated here because middleware is a convenience,
 *     not a security boundary, and this layout must be safe on its own.)
 *  3. **Signed in but not staff** — a real account with no permissions. Say so
 *     plainly rather than bouncing them to a login form they will just pass again.
 *
 * Row Level Security independently enforces all of this at the database, so even
 * a mistake here cannot expose data.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!capabilities.supabase) {
    return (
      <NoticeScreen
        icon={<Info aria-hidden className="size-6" />}
        title="The admin console needs a database"
        body={
          <>
            <p>
              EduWings runs its entire public site from bundled content, which is why you can clone
              and build it with no configuration. The admin console is the one part that genuinely
              requires Supabase.
            </p>
            <p className="mt-3">
              Set <code>NEXT_PUBLIC_SUPABASE_URL</code>, <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
              and <code>SUPABASE_SERVICE_ROLE_KEY</code>, apply the migrations in{" "}
              <code>supabase/migrations</code>, then run <code>npm run db:seed</code>.
            </p>
          </>
        }
      />
    );
  }

  const user = await getSessionUser();

  if (!user) redirect(`${routes.login}?next=${routes.admin.root}`);

  if (!isStaff(user)) {
    return (
      <NoticeScreen
        icon={<ShieldAlert aria-hidden className="size-6" />}
        title="Your account does not have access"
        body={
          <>
            <p>
              You are signed in as <strong>{user.email}</strong>, but your role is{" "}
              <strong>{user.role}</strong>. The admin console requires the editor or administrator
              role.
            </p>
            <p className="mt-3">
              Ask an administrator to change your role. They can do that from Users in this console.
            </p>
          </>
        }
      />
    );
  }

  // Surfaced in the sidebar so an operator can tell at a glance whether the
  // console is editing live data or the deployment has fallen back to seed content.
  const sourceKind = getContentSource().kind;

  return (
    <AdminShell user={user} sourceKind={sourceKind}>
      {children}
    </AdminShell>
  );
}

function NoticeScreen({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh place-items-center bg-aurora px-5 py-12">
      <div className="w-full max-w-lg">
        <div className="flex justify-center">
          <Logo />
        </div>

        <Alert variant="info" className="mt-8 bg-card p-7">
          {icon}
          <AlertTitle className="text-base">{title}</AlertTitle>
          <AlertDescription className="mt-2 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-xs">
            {body}
          </AlertDescription>
        </Alert>

        <div className="mt-8 flex justify-center">
          <Button asChild variant="ghost">
            <Link href={routes.home}>
              <ArrowLeft className="size-4" />
              Back to the site
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
