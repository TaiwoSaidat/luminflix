"use client";

import React from "react";
import { MediaItem } from "@/types";
import { Skeleton, SkeletonText } from "../shared/Skeleton";
import MediaCard from "../shared/MediaCard";
import MediaGrid from "../shared/MediaGrid";

/** Matches the grid so the pending state occupies the same space as the result. */
const SKELETON_CARDS = [1, 2, 3, 4, 5, 6];

/** Shaped like `MediaCard`: artwork, badge strip, title line, synopsis. */
const CardSkeleton = () => (
  <div className="overflow-hidden rounded-md bg-zinc-800">
    <Skeleton tone="onSurface" radius="none" className="aspect-video w-full" />
    <div className="space-y-2 p-3 md:p-4">
      <Skeleton tone="onSurface" className="h-3 w-1/2" />
      <Skeleton tone="onSurface" className="h-3 w-2/3" />
      <SkeletonText tone="onSurface" lines={2} />
    </div>
  </div>
);

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

      {/* No wider step than three: the modal is capped at max-w-4xl, so a
          four-column breakpoint would fire on viewport width the container
          doesn't actually have. */}
      <MediaGrid busy={pending}>
        {pending
          ? SKELETON_CARDS.map((card) => <CardSkeleton key={card} />)
          : items.map((item) => (
              <MediaCard
                key={`${item.mediaType}-${item.id}`}
                item={item}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 300px"
              />
            ))}
      </MediaGrid>
    </section>
  );
};

export default MoreLikeThis;
