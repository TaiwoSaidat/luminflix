"use client";

import React from "react";
import { MediaItem } from "@/types";
import GridSkeleton from "../shared/GridSkeleton";
import MediaCard from "../shared/MediaCard";
import MediaGrid from "../shared/MediaGrid";

interface MoreLikeThisProps {
  items: MediaItem[];
  /** True while the recommendations request is in flight. */
  pending: boolean;
}

/**
 * "More Like This" — recommendations from `getRecommendations()`.
 *
 * These come from a list endpoint, so `runtime` and `certification` are absent
 * on most entries; each is guarded rather than rendered blank.
 */
const MoreLikeThis: React.FC<MoreLikeThisProps> = ({ items, pending }) => {
  if (!pending && items.length === 0) return null;

  return (
    <section aria-labelledby="more-like-this-heading" className="space-y-4">
      <h3 id="more-like-this-heading" className="large-24">
        More Like This
      </h3>

      {/* No wider step than three in either state: the modal is capped at
          max-w-4xl, so a four-column breakpoint would fire on viewport width
          the container doesn't actually have. `onSurface` because these sit on
          the modal's raised panel, not on the page ground. */}
      {pending ? (
        <GridSkeleton cards={6} tone="onSurface" />
      ) : (
        <MediaGrid>
          {items.map((item) => (
            <MediaCard
              key={`${item.mediaType}-${item.id}`}
              item={item}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
            />
          ))}
        </MediaGrid>
      )}
    </section>
  );
};

export default MoreLikeThis;
