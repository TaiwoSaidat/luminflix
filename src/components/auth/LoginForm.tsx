"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import Button from "@/components/ui/Button";
import { authenticate, type LoginState } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="brand"
      size="lg"
      disabled={pending}
      className="w-full mt-2"
    >
      {pending ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export default function LoginForm({
  callbackUrl,
  defaultEmail,
}: {
  callbackUrl: string;
  /** Carried over from the landing page's email field, when it was used. */
  defaultEmail?: string;
}) {
  const [state, formAction] = useActionState<LoginState, FormData>(
    authenticate,
    {}
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="small-14 text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={defaultEmail}
          placeholder="demo@luminflix.com"
          className="inputClass w-full! bg-zinc-800/80 text-white border border-zinc-700 placeholder:text-gray-500 focus:outline-none focus:border-white/60"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="small-14 text-gray-300">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="inputClass w-full! bg-zinc-800/80 text-white border border-zinc-700 placeholder:text-gray-500 focus:outline-none focus:border-white/60"
        />
      </div>

      {state.error && (
        // aria-live so the failure is announced, not just shown.
        <p role="alert" aria-live="polite" className="small-14 text-luminflix-red">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
