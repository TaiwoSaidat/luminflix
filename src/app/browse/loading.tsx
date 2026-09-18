import React from "react";
import GridSkeleton from "@/components/shared/GridSkeleton";
import { Skeleton } from "@/components/shared/Skeleton";

/** Stands in for the type toggle and the genre chip row. */
const CHIP_WIDTHS = [
  "w-16",
  "w-20",
  "w-24",
  "w-16",
  "w-28",
  "w-20",
  "w-24",
  "w-16",
];

/**
 * Shown while `/browse` fetches. The route is dynamic — it reads `searchParams`
 * — so every filter change re-renders on the server, and without a boundary the
 * page would sit blank on each one.
 *
 * Laid out like the real page: heading, filter chips, then the grid, at the same
 * column steps so nothing reflows when the data arrives.
 */
export default function BrowseLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading titles"
      className="bg-black text-white min-h-screen"
    >
      <div className="pageX pageTop pb-16 space-y-6 md:space-y-8">
        <Skeleton className="h-9 w-48 md:h-11 md:w-64" />

        <div className="space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20 rounded-full" radius="none" />
            <Skeleton className="h-10 w-20 rounded-full" radius="none" />
          </div>

          <div className="flex flex-wrap gap-2">
            {CHIP_WIDTHS.map((width, index) => (
              <Skeleton
                key={index}
                radius="none"
                className={`h-10 rounded-full ${width}`}
              />
            ))}
          </div>
        </div>

        <GridSkeleton className="xl:grid-cols-4" />
      </div>
    </div>
  );
}
