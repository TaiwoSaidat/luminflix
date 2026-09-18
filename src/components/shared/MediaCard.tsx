import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Plus } from "lucide-react";

import type { MediaItem } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import TitleBadges from "./TitleBadges";
import IconButton from "../ui/IconButton";

interface MediaCardProps {
  item: MediaItem;
  /**
   * Layout hint for `next/image`. The default assumes the card sits in
   * `MediaGrid` at full page width; the detail modal is narrower and overrides.
   */
  sizes?: string;
  className?: string;
}

const DEFAULT_SIZES =
  "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, (max-width: 1280px) 30vw, 320px";

/**
 * The grid card — one title as a landscape tile with its metadata underneath.
 *
 * This is the counterpart to `VideoCard`, not a replacement for it: `VideoCard`
 * is built for a horizontal row and depends on hover to reveal anything beyond
 * the artwork, which never fires on touch. A grid has room to show the metadata
 * outright, so nothing here is hidden behind a pointer.
 *
 * No `"use client"`: it renders inside Server Components (`/search`) and Client
 * Components (`MoreLikeThis`) alike, so it deliberately holds no state.
 */
const MediaCard: React.FC<MediaCardProps> = ({
  item,
  sizes = DEFAULT_SIZES,
  className,
}) => {
  // A backdrop is 16:9 and textless; a poster is 2:3, so it is contained rather
  // than cropped when it stands in for a missing backdrop.
  const artwork = item.backdrop ?? item.poster;

  // Runtime is detail-only, so list results fall back to the year. Either may
  // be absent, in which case the corner label is dropped entirely.
  const corner = item.runtime ? formatDuration(item.runtime) : item.year;

  return (
    <Link
      href={`/watch/${item.mediaType}/${item.id}`}
      className={cn(
        "group focusRing block overflow-hidden rounded-md bg-zinc-800 transition hover:bg-zinc-700",
        className
      )}
    >
      <div className="relative aspect-video w-full bg-zinc-900">
        {artwork ? (
          <Image
            src={artwork}
            alt={item.title}
            fill
            sizes={sizes}
            className={item.backdrop ? "object-cover" : "object-contain"}
          />
        ) : (
          <div className="h-full w-full flexCenter p-4">
            <span className="small-14 text-center text-zinc-400 line-clamp-3">
              {item.title}
            </span>
          </div>
        )}

        {corner && (
          <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 small-12">
            {corner}
          </span>
        )}

        {/* Pointer affordance only — the whole card is the link, so this never
            has to be reachable on its own. Hidden from assistive tech via
            `decorative`, which also keeps it out of the tab order. */}
        <span className="absolute inset-0 flexCenter opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton
            icon={Play}
            iconClassName="fill-current"
            variant="overlay"
            size="xl"
            decorative
            label=""
            className="border-2 border-white bg-black/50"
          />
        </span>
      </div>

      <div className="space-y-2 p-3 md:p-4">
        <div className="flexBetween gap-2">
          <TitleBadges media={item} />

          {/* My List has no backing store yet, and this sits inside a link —
              a real button here would be invalid markup. */}
          <IconButton
            icon={Plus}
            size="sm"
            decorative
            label=""
            title="My List is not available yet"
          />
        </div>

        {/* Backdrops are textless plates, so the title has to be written out —
            without it a card whose artwork loaded is still unidentifiable. */}
        <h3 className="regular-16 line-clamp-1">{item.title}</h3>

        <p className="small-14 leading-relaxed text-zinc-400 line-clamp-3">
          {item.overview || "No synopsis available."}
        </p>
      </div>
    </Link>
  );
};

export default MediaCard;
