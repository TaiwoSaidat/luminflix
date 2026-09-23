import React from "react";
import Image from "next/image";
import Link from "next/link";

import type { MediaItem } from "@/types";

interface TopTenCardProps {
  item: MediaItem;
  /** 1-based position in the list, drawn as the oversized digit. */
  rank: number;
}

/**
 * A ranked title: a portrait poster with its position drawn hollow beside it,
 * the poster overlapping the digit's trailing edge.
 *
 * A sibling of `VideoCard`, not a mode of it. This one is built around the 2:3
 * poster rather than the 16:9 backdrop, carries no hover preview, and has to
 * leave room to its left for a digit that is taller than the artwork — none of
 * which `VideoCard` can express without becoming two components in a trench
 * coat.
 */
const TopTenCard: React.FC<TopTenCardProps> = ({ item, rank }) => {
  // These lists are mixed film and series, and TMDB has no poster for a
  // handful of titles — the backdrop is a poor shape here but beats a gap.
  const artwork = item.poster ?? item.backdrop;

  return (
    <Link
      href={`/watch/${item.mediaType}/${item.id}`}
      // The digit is decorative, so the rank is spoken as part of the link's
      // name instead — otherwise a screen reader announces ten titles with no
      // indication that they are a ranking.
      aria-label={`Number ${rank}: ${item.title}`}
      className="focusRing group flex shrink-0 items-end rounded-md"
    >
      <span aria-hidden="true" className="rankNumeral">
        {rank}
      </span>

      <div className="relative -ml-5 aspect-2/3 w-28 shrink-0 overflow-hidden rounded-md bg-zinc-900 transition duration-200 group-hover:brightness-110 md:-ml-7 md:w-36">
        {artwork ? (
          <Image
            src={artwork}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 112px, 144px"
            className="object-cover"
          />
        ) : (
          <span className="flexCenter h-full w-full p-3 small-12 text-center text-zinc-400 line-clamp-4">
            {item.title}
          </span>
        )}
      </div>
    </Link>
  );
};

export default TopTenCard;
