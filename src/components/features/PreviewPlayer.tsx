"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MediaItem } from "@/types";

/**
 * The media area of the hover preview — a placeholder for the trailer player.
 *
 * Netflix autoplays a muted trailer here. That player doesn't exist yet (see
 * `plan/phase-2-routes.md` §1.3), so this renders the title's backdrop at
 * preview width instead, over a pulsing skeleton that shows until the image
 * decodes. When the player lands, swap the <Image> for the trailer element and
 * keep everything else: the aspect box, the skeleton (it becomes the buffering
 * state), the scrim and the title treatment all still apply.
 */
const PreviewPlayer: React.FC<{ movie: MediaItem }> = ({ movie }) => {
  const [loaded, setLoaded] = useState(false);

  // Backdrops are 16:9 and textless; a poster is 2:3, so it is contained
  // rather than cropped when it stands in for a missing backdrop.
  const artwork = movie.backdrop ?? movie.poster;
  const isPosterFallback = !movie.backdrop && Boolean(movie.poster);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-zinc-800"
          aria-hidden="true"
        />
      )}

      {artwork ? (
        <Image
          src={artwork}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 90vw, 480px"
          onLoad={() => setLoaded(true)}
          className={isPosterFallback ? "object-contain" : "object-cover"}
        />
      ) : (
        <div className="w-full h-full flexCenter p-6">
          <span className="small-14 text-zinc-400 text-center line-clamp-3">
            {movie.title}
          </span>
        </div>
      )}

      {/* Scrim under the title treatment — backdrops are busy and a logo
          dropped straight onto one is often unreadable. */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/85 via-black/35 to-transparent" />

      {movie.logo ? (
        <div className="absolute bottom-4 left-4 right-4 h-10">
          <Image
            src={movie.logo}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 90vw, 480px"
            className="object-contain object-left-bottom drop-shadow-md"
          />
        </div>
      ) : (
        <h3 className="absolute bottom-4 left-4 right-4 regular-16 font-semibold line-clamp-2 drop-shadow-md">
          {movie.title}
        </h3>
      )}
    </div>
  );
};

export default PreviewPlayer;
