import React from "react";
import GridSkeleton from "@/components/shared/GridSkeleton";
import { Skeleton } from "@/components/shared/Skeleton";

/**
 * Shown while `/search` fetches.
 *
 * Search is `no-store` by design — every settled keystroke is a live request —
 * so this is the state users see most often in the whole app. It mirrors the
 * results layout: heading, result count, then the grid.
 */
export default function SearchLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Searching"
      className="bg-black text-white min-h-screen"
    >
      <div className="pageX pageTop pb-16 space-y-6 md:space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 md:h-9 md:w-72" />
          <Skeleton className="h-3 w-20" />
        </div>

        <GridSkeleton className="xl:grid-cols-4" />
      </div>
    </div>
  );
}
