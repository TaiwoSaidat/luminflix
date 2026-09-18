import React from "react";
import { Skeleton, SkeletonText, type Tone } from "./Skeleton";
import MediaGrid from "./MediaGrid";

/**
 * Shaped like `MediaCard` — artwork, badge strip, title line, synopsis — so the
 * real content lands in the space the placeholder already occupied instead of
 * shifting the page.
 */
export const MediaCardSkeleton: React.FC<{ tone?: Tone }> = ({
  tone = "default",
}) => (
  <div className="overflow-hidden rounded-md bg-zinc-800">
    <Skeleton tone={tone} radius="none" className="aspect-video w-full" />
    <div className="space-y-2 p-3 md:p-4">
      <Skeleton tone={tone} className="h-3 w-1/2" />
      <Skeleton tone={tone} className="h-3 w-2/3" />
      <SkeletonText tone={tone} lines={2} />
    </div>
  </div>
);

interface GridSkeletonProps {
  /** Roughly a screenful; more would only render below the fold. */
  cards?: number;
  /** `onSurface` for skeletons on a raised panel, like the detail modal. */
  tone?: Tone;
  /** Column steps, matched to whatever grid it stands in for. */
  className?: string;
}

/**
 * The pending state for any `MediaGrid` — search results, browse results,
 * recommendations. Uses the same grid component as the real content, so the two
 * cannot drift apart at a breakpoint.
 */
const GridSkeleton: React.FC<GridSkeletonProps> = ({
  cards = 8,
  tone = "default",
  className,
}) => (
  <MediaGrid busy className={className}>
    {Array.from({ length: cards }, (_, index) => (
      <MediaCardSkeleton key={index} tone={tone} />
    ))}
  </MediaGrid>
);

export default GridSkeleton;
