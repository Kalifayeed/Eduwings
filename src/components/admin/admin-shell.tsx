"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, ExternalLink, LogOut, Menu, X } from "lucide-react";

import { cn, initialsOf } from "@/lib/utils";
import { routes } from "@/config/routes";
import { adminNavigation } from "@/lib/admin/navigation";
import type { SessionUser } from "@/lib/auth/session";
import { signOut } from "@/lib/auth/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Admin console chrome.
 *
 * A persistent sidebar on desktop, an overlay drawer below `lg`. Client-side
 * because it needs `usePathname` for the active state and local state for the
 * drawer — everything inside it is still server-rendered.
 */
function AdminShell({
  user,
  sourceKind,
  children,
}: {
  user: SessionUser;
  sourceKind: "static" | "supabase";
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Open only while the recorded URL matches the current one, so navigating
  // closes the drawer without an effect correcting state after the fact.
  const [openedAt, setOpenedAt] = React.useState<string | null>(null);
  const drawerOpen = openedAt === pathname;
  const setDrawerOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-dvh bg-surface">
      <a
        href="#admin-main"
        className="sr-only bg-primary text-primary-foreground focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2.5 focus:text-sm"
      >
        Skip to main content
      </a>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-card transition-transform duration-300 ease-[var(--ease-out-expo)]",
          "lg:translate-x-0",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Admin navigation"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
          <Logo />
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {adminNavigation.map((group) => {
            const items = group.items.filter((item) => !item.adminOnly || isAdmin);
            if (items.length === 0) return null;

            return (
              <div key={group.label} className="mb-6 last:mb-0">
                <p className="px-3 pb-2 font-mono text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
                  {group.label}
                </p>
                <ul className="grid gap-0.5">
                  {items.map((item) => {
                    // Exact match for the dashboard root; prefix match elsewhere,
                    // so `/admin/articles/new` still highlights Articles.
                    const active =
                      item.href === routes.admin.root
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                            active
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          )}
                        >
                          <item.icon className="size-4 shrink-0" aria-hidden />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t p-4">
          <div
            className={cn(
              "mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-xs",
              sourceKind === "supabase"
                ? "bg-success/10 text-success"
                : "bg-accent/15 text-gold-700 dark:text-gold-300",
            )}
          >
            <Database className="size-3.5 shrink-0" aria-hidden />
            {sourceKind === "supabase"
              ? "Editing live database content"
              : "Serving bundled seed content"}
          </div>

          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initialsOf(user.fullName ?? user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.fullName ?? user.email}</p>
              <Badge variant="muted" className="mt-0.5 px-2 py-0 text-[0.65rem]">
                {user.role}
              </Badge>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="icon-sm" aria-label="Sign out">
                <LogOut className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Drawer backdrop */}
      {drawerOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-navy-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-label="Close navigation"
        />
      ) : null}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b glass px-5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </Button>

          <div className="ml-auto flex items-center gap-1.5">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
              <Link href={routes.home} target="_blank" rel="noopener noreferrer">
                View site
                <ExternalLink className="size-3.5" />
              </Link>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main id="admin-main" className="p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export { AdminShell };
