"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

import ErrorState from "@/components/shared/ErrorState";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

/**
 * The app-wide error boundary — anything thrown while rendering a route that has
 * no closer `error.tsx` of its own lands here. Most often a TMDB failure: a bad
 * `MEDIA_ACCESS_TOKEN`, a rate limit, or the provider being down.
 *
 * `error.tsx` files are Client Components by definition (they receive `reset`),
 * which is why this can't render `Header`.
 *
 * `error.message` is never shown. Next already logs the real error server-side,
 * and `digest` is what ties this screen to that log entry — note that
 * `next.config.ts` strips `console.*` in production, so adding a client-side log
 * here would achieve nothing.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-black text-white min-h-screen flexCenter pageX">
      <ErrorState
        title="Something went wrong"
        detail="We couldn't load this page. This is usually temporary — try again, and if it keeps happening the catalog service may be unavailable."
        digest={error.digest}
      >
        <Button onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>
          Try again
        </Button>
        <Button variant="ghost" href={ROUTES.HOME}>
          Go home
        </Button>
      </ErrorState>
    </div>
  );
}
