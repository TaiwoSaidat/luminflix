"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, Play, Plus, ThumbsUp } from "lucide-react";
import { MediaItem } from "@/types";
import PreviewPlayer from "./PreviewPlayer";
import { formatDuration } from "@/lib/utils";

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
            <Link
              href={watchHref}
              aria-label={`Play ${movie.title}`}
              className="flexCenter h-9 w-9 rounded-full bg-white text-black transition hover:bg-white/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <Play className="h-4 w-4 fill-current" />
            </Link>

            {/* My List and ratings have no backing store yet — shown as
                disabled rather than as live controls that do nothing. */}
            <button
              type="button"
              disabled
              title="My List is not available yet"
              aria-label={`Add ${movie.title} to My List`}
              className="flexCenter h-9 w-9 rounded-full border border-white/40 text-white/50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled
              title="Ratings are not available yet"
              aria-label={`Rate ${movie.title}`}
              className="flexCenter h-9 w-9 rounded-full border border-white/40 text-white/50 disabled:cursor-not-allowed"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenDetails}
            aria-label={`More information about ${movie.title}`}
            className="flexCenter h-9 w-9 rounded-full border border-white/40 transition hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 small-12">
          {movie.certification && (
            <span className="border border-white/40 px-1.5 py-0.5">
              {movie.certification}
            </span>
          )}
          <span className="font-semibold text-green-500">
            {movie.matchScore}% Match
          </span>
          {movie.runtime && <span>{formatDuration(movie.runtime)}</span>}
          {movie.year && <span>{movie.year}</span>}
          <span className="border border-white/40 px-1.5 py-0.5">HD</span>
        </div>

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
