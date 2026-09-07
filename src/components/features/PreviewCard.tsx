"use client";

import React from "react";
import { ChevronDown, Play, Plus, ThumbsUp } from "lucide-react";
import { MediaItem } from "@/types";
import PreviewPlayer from "./PreviewPlayer";
import TitleBadges from "../shared/TitleBadges";
import IconButton from "../ui/IconButton";

export type PreviewRect = {
  /** Viewport coordinates — the popup is fixed-positioned, not in flow. */
  top: number;
  left: number;
  width: number;
};

interface PreviewCardProps {
  movie: MediaItem;
  rect: PreviewRect;
  /** Opens the full detail modal — same one the hero's "More Info" opens. */
  onOpenDetails: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * The expanded card shown while a row card is hovered.
 *
 * It is rendered through a portal into <body>: rows scroll horizontally with
 * `overflow-x-scroll`, which clips anything overflowing the row vertically, so
 * a popup positioned inside the card would be cut off. Fixed coordinates are
 * measured by the card and passed in as `rect`.
 *
 * `runtime`, `certification` and `cast` are detail-only fields — a title that
 * came from a row doesn't have them, so each is guarded rather than rendered
 * blank.
 */
const PreviewCard: React.FC<PreviewCardProps> = ({
  movie,
  rect,
  onOpenDetails,
  onMouseEnter,
  onMouseLeave,
}) => {
  const watchHref = `/watch/${movie.mediaType}/${movie.id}`;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ top: rect.top, left: rect.left, width: rect.width }}
      className="fixed z-50 overflow-hidden rounded-md bg-zinc-900 text-white shadow-2xl shadow-black/70 ring-1 ring-white/10"
    >
      <PreviewPlayer movie={movie} />

      <div className="space-y-3 p-4">
        <div className="flexBetween">
          <div className="flex items-center gap-2">
            <IconButton
              icon={Play}
              iconClassName="fill-current"
              variant="solid"
              href={watchHref}
              label={`Play ${movie.title}`}
            />

            {/* My List and ratings have no backing store yet — shown as
                disabled rather than as live controls that do nothing. */}
            <IconButton
              icon={Plus}
              disabled
              title="My List is not available yet"
              label={`Add ${movie.title} to My List`}
            />
            <IconButton
              icon={ThumbsUp}
              disabled
              title="Ratings are not available yet"
              label={`Rate ${movie.title}`}
            />
          </div>

          <IconButton
            icon={ChevronDown}
            onClick={onOpenDetails}
            label={`More information about ${movie.title}`}
          />
        </div>

        <TitleBadges media={movie} />

        {movie.genres.length > 0 && (
          <ul className="flex flex-wrap items-center gap-x-2 gap-y-1 regular-12">
            {movie.genres.slice(0, 3).map((genre, index) => (
              <li key={genre} className="flex items-center gap-2">
                {index > 0 && (
                  <span aria-hidden="true" className="text-luminflix-red">
                    &bull;
                  </span>
                )}
                {genre}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PreviewCard;
