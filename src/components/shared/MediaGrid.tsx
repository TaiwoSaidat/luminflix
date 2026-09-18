import React from "react";
import { cn } from "@/lib/utils";

interface MediaGridProps {
  children: React.ReactNode;
  /** Set while results are being fetched, so screen readers announce the wait. */
  busy?: boolean;
  /** Extra column steps for wide surfaces — `/search` opens up to four. */
  className?: string;
}

/**
 * The responsive tile grid shared by search results, recommendations and
 * (next) browse.
 *
 * Mobile-first: one column by default, because a 16:9 tile plus three lines of
 * synopsis is already the full width of a phone. Columns are added upward from
 * there. Column counts are viewport-based, not container-based, so a surface
 * that is itself narrow — the detail modal is capped at `max-w-4xl` — passes a
 * `className` to stop short rather than inheriting the widest step.
 */
const MediaGrid: React.FC<MediaGridProps> = ({ children, busy, className }) => (
  <div
    aria-busy={busy}
    className={cn(
      "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
      className
    )}
  >
    {children}
  </div>
);

export default MediaGrid;
