"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Loader2, LogIn } from "lucide-react";

import { signIn, type AuthActionState } from "@/lib/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const INITIAL_STATE: AuthActionState = { error: null };

/**
 * Sign-in form.
 *
 * Built on a Server Action with `useActionState`, so it works before hydration
 * — a plain form POST — and progressively upgrades to inline error handling.
 * Credentials therefore never pass through client-side JavaScript.
 */
function SignInForm({ className, next }: { className?: string; next?: string }) {
  const [state, formAction] = useActionState(signIn, INITIAL_STATE);

  return (
    <form action={formAction} className={className}>
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            placeholder="you@eduwings.org"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
          />
        </div>
      </div>

      {state.error ? (
        <Alert variant="destructive" className="mt-5">
          <AlertCircle aria-hidden />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <SubmitButton />

      <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
        Accounts are created by an administrator. If you cannot get in, ask them to check your role
        in the admin console rather than resetting your password.
      </p>
    </form>
  );
}

/**
 * Split out because `useFormStatus` reports the pending state of the *parent*
 * form, so it has to be read from inside it.
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="mt-6 w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Signing in
        </>
      ) : (
        <>
          <LogIn className="size-4" />
          Sign in
        </>
      )}
    </Button>
  );
}

export { SignInForm };
