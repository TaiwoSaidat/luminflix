import React from "react";
import { Skeleton } from "@/components/shared/Skeleton";

/** Enough to fill a wide row; the rest would be off-screen anyway. */
const CARDS = [1, 2, 3, 4, 5, 6];
const ROWS = [1, 2, 3];

/**
 * Shown while `/` renders on the server.
 *
 * This exists for a concrete reason, not as decoration: `/` is dynamic (it
 * calls `auth()`), and `getRows()` fans out to one `/images` request per title.
 * Without a loading boundary the router has nothing to paint until all of that
 * resolves, so a navigation home looks frozen. With one, the shell appears
 * immediately and the real content streams in behind it.
 *
 * Shaped like the page it stands in for — hero, then rows of 16:9 cards at the
 * same widths `VideoCard` uses, so nothing jumps when the data lands.
 */
export default function HomeLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className="bg-black text-white min-h-screen"
    >
      <Skeleton radius="none" className="h-[70vh] w-full md:h-[85vh]" />

      <div className="relative -mt-32 space-y-12 pb-12">
        {ROWS.map((row) => (
          <div key={row} className="space-y-4 pageX">
            <Skeleton className="h-7 w-40 md:w-56" />

            <div className="flex gap-2 overflow-hidden">
              {CARDS.map((card) => (
                <Skeleton
                  key={card}
                  className="aspect-video min-w-62 shrink-0 md:min-w-78"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
