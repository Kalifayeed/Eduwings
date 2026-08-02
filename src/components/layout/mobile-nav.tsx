"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { mainNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";

/**
 * Mobile navigation drawer.
 *
 * The same navigation model as the desktop mega menu, rendered as an accordion
 * so the whole hierarchy is reachable by thumb without nested overlays. Closes
 * automatically on navigation.
 */
function MobileNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The drawer records *where* it was opened. Because it is only considered open
  // while that matches the current URL, navigating closes it automatically —
  // derived from render rather than corrected afterwards in an effect.
  const [openedAt, setOpenedAt] = React.useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-[92vw] max-w-sm p-0">
        <SheetHeader>
          <SheetTitle asChild>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6">
          <Accordion type="multiple" className="w-full">
            {mainNavigation.map((section) => (
              <AccordionItem key={section.label} value={section.label}>
                <AccordionTrigger className="text-sm">{section.label}</AccordionTrigger>
                <AccordionContent className="pb-3">
                  <ul className="grid gap-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-secondary",
                              active ? "font-medium text-primary" : "text-foreground",
                            )}
                          >
                            {Icon ? (
                              <Icon className="size-4 shrink-0 text-muted-foreground" />
                            ) : null}
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>

        <div className="grid gap-3 border-t px-6 py-5">
          <Button asChild size="lg">
            <Link href={routes.schools}>
              Bring us to your school
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={routes.donate}>Donate</Link>
          </Button>
          <a
            href={`tel:${siteConfig.contact.phoneE164}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="size-4" />
            {siteConfig.contact.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export { MobileNav };
