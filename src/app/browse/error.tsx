"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

import ErrorState from "@/components/shared/ErrorState";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

/**
 * Browse-specific failure copy.
 *
 * A filter combination that returns nothing is an empty state handled in the
 * page itself — this boundary only catches an actual provider failure, so the
 * copy points at the catalog rather than suggesting the user's filter was wrong.
 */
export default function BrowseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-black text-white min-h-screen flexCenter pageX">
      <ErrorState
        title="We couldn't load these titles"
        detail="The catalog didn't respond. Your filters are fine — try again, or start from the home page."
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
