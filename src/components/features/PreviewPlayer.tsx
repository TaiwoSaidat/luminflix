"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MediaItem } from "@/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "../shared/Skeleton";

interface PreviewPlayerProps {
  movie: MediaItem;
  /** Sizes hint for the artwork — the modal renders far wider than a preview. */
  sizes?: string;
  /** Overrides the title-treatment box, which is larger in the modal. */
  logoClassName?: string;
  /** Controls drawn under the title treatment, inside the media area. */
  children?: React.ReactNode;
  priority?: boolean;
}

/**
 * The media area shared by the hover preview and the title detail modal — a
 * placeholder for the trailer player.
 *
 * Netflix autoplays a muted trailer here. That player doesn't exist yet (see
 * `plan/phase-2-routes.md` §1.3), so this renders the title's backdrop instead,
 * over a pulsing skeleton that shows until the image decodes. When the player
 * lands, swap the <Image> for the trailer element and keep everything else: the
 * aspect box, the skeleton (it becomes the buffering state), the scrim, the
 * title treatment and the overlaid controls all still apply.
 */
const PreviewPlayer: React.FC<PreviewPlayerProps> = ({
  movie,
  sizes = "(max-width: 768px) 90vw, 480px",
  logoClassName = "h-10 w-2/3",
  children,
  priority = false,
}) => {
  const [loaded, setLoaded] = useState(false);

  // Backdrops are 16:9 and textless; a poster is 2:3, so it is contained
  // rather than cropped when it stands in for a missing backdrop.
  const artwork = movie.backdrop ?? movie.poster;
  const isPosterFallback = !movie.backdrop && Boolean(movie.poster);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
      {!loaded && <Skeleton radius="none" className="absolute inset-0" />}

      {artwork ? (
        <Image
          src={artwork}
          alt={movie.title}
          fill
          sizes={sizes}
          priority={priority}
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
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 space-y-4 p-4 md:p-6">
        {movie.logo ? (
          <div className={cn("relative", logoClassName)}>
            <Image
              src={movie.logo}
              alt={movie.title}
              fill
              sizes={sizes}
              className="object-contain object-left-bottom drop-shadow-md"
            />
          </div>
        ) : (
          <h3 className="regular-16 font-semibold line-clamp-2 drop-shadow-md">
            {movie.title}
          </h3>
        )}

        {children}
      </div>
    </div>
  );
};

export default PreviewPlayer;
