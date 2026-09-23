"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

import ErrorState from "@/components/shared/ErrorState";
import Button from "@/components/ui/Button";
import "./globals.css";

/**
 * Last resort: catches errors thrown by the root layout itself, which the normal
 * `error.tsx` boundary sits inside and therefore cannot catch.
 *
 * This replaces the root layout entirely, so it has to supply its own `<html>`
 * and `<body>` — and it imports `globals.css` directly, since the layout that
 * normally does isn't running. The font CSS variables are set on the layout's
 * body element, so text here falls back to the system stack. That is acceptable
 * for a screen that should never appear; the alternative is an unstyled white
 * page with a stack trace.
 *
 * No `Go home` link: if the layout is broken, navigating within the app lands on
 * the same broken layout. A full reload via `reset()` is the only useful action.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <div className="min-h-screen flexCenter pageX">
          <ErrorState
            title="LuminFlix couldn't start"
            detail="Something failed before the page could be built. Reloading usually clears it."
            digest={error.digest}
          >
            <Button onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>
              Reload
            </Button>
          </ErrorState>
        </div>
      </body>
    </html>
  );
}
