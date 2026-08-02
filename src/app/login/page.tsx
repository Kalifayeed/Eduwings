import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { capabilities } from "@/lib/env";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Logo } from "@/components/layout/logo";
import { SignInForm } from "@/app/login/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the EduWings admin console.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-aurora px-5 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <div className="relative w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-3xl border bg-card p-8 shadow-[var(--shadow-float)]">
          <h1 className="font-display text-2xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            The admin console is for {siteConfig.name} staff. If you are looking for the public
            site, it is{" "}
            <Link href={routes.home} className="text-primary underline-offset-4 hover:underline">
              this way
            </Link>
            .
          </p>

          {capabilities.supabase ? (
            <SignInForm className="mt-8" next={next} />
          ) : (
            <Alert variant="info" className="mt-8">
              <Info aria-hidden />
              <AlertTitle>Authentication is not configured</AlertTitle>
              <AlertDescription>
                Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your environment, apply the migrations
                in <code>supabase/migrations</code>, then reload this page. The public site runs
                without them; the admin console does not.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={routes.home}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to {siteConfig.name}
          </Link>
        </div>
      </div>
    </div>
  );
}
