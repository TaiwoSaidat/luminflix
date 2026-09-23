"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

import ErrorState from "@/components/shared/ErrorState";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

/**
 * Search-specific failure copy.
 *
 * Worth its own boundary rather than falling through to the app-wide one:
 * search is the only uncached path in the app, so it is the most likely thing to
 * fail, and "your search failed" is far more useful than "something went wrong".
 */
export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="bg-black text-white min-h-screen flexCenter pageX">
      <ErrorState
        title="Search isn't working right now"
        detail="We couldn't reach the catalog to run that search. Nothing is wrong with your query — try again in a moment."
        digest={error.digest}
      >
        <Button onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>
          Try again
        </Button>
        <Button variant="ghost" href={ROUTES.BROWSE}>
          Browse instead
        </Button>
      </ErrorState>
    </div>
  );
}
