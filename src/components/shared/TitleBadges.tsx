import React from "react";
import type { MediaItem } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import { Skeleton } from "./Skeleton";

const TEXT: Record<"sm" | "md", string> = {
  sm: "small-12",
  md: "small-14",
};

const GAPS: Record<"sm" | "md", string> = {
  sm: "gap-x-2.5 gap-y-1.5",
  md: "gap-x-3 gap-y-2",
};

/** The boxed badges — certification and HD. */
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="border border-white/40 px-1.5 py-0.5">{children}</span>
);

interface TitleBadgesProps {
  media: MediaItem;
  size?: "sm" | "md";
  /**
   * Holds the certification slot with a placeholder while detail data loads.
   * `certification` is detail-only, so a row card never has it up front.
   */
  pendingCertification?: boolean;
  className?: string;
}

/**
 * The metadata strip under a title — match, year, runtime, certification, HD.
 *
 * One canonical order everywhere it appears. `runtime` and `certification` are
 * detail-only fields, absent on anything that came from a list endpoint, so
 * each is guarded here rather than at every call site.
 */
const TitleBadges: React.FC<TitleBadgesProps> = ({
  media,
  size = "sm",
  pendingCertification = false,
  className,
}) => (
  <div
    className={cn(
      "flex flex-wrap items-center",
      GAPS[size],
      TEXT[size],
      className
    )}
  >
    <span className="font-semibold text-green-500">
      {media.matchScore}% Match
    </span>
    {media.year && <span>{media.year}</span>}
    {media.runtime && <span>{formatDuration(media.runtime)}</span>}
    {media.certification ? (
      <Badge>{media.certification}</Badge>
    ) : (
      pendingCertification && <Skeleton className="h-5 w-10" />
    )}
    <Badge>HD</Badge>
  </div>
);

export default TitleBadges;
