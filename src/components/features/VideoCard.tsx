"use client";

import React, { useState } from "react";
import { MediaItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import { Play, Plus, ThumbsUp } from "lucide-react";

interface VideoCardProps {
  movie: MediaItem;
  /** 0–100 watch progress. Renders the continue-watching bar when set. */
  progress?: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ movie, progress }) => {
  const [isHovered, setIsHovered] = useState(false);
  const watchHref = `/watch/${movie.mediaType}/${movie.id}`;
  // A poster is 2:3, so it can't fill a 16:9 frame without cropping away the
  // top and bottom of the art. It's contained rather than covered when it
  // stands in for a missing backdrop.
  const artwork = movie.backdrop ?? movie.poster;
  const isPosterFallback = !movie.backdrop && Boolean(movie.poster);

  return (
    <div
      className="relative group cursor-pointer min-w-62 md:min-w-78"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={watchHref} className="block">
        <div className="relative aspect-video overflow-hidden rounded-sm bg-zinc-900 transition-transform duration-300 group-hover:scale-105">
          {artwork ? (
            <Image
              src={artwork}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 250px, 312px"
              className={isPosterFallback ? "object-contain" : "object-cover"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              <span className="text-sm text-zinc-400 text-center line-clamp-3">
                {movie.title}
              </span>
            </div>
          )}

          {/* Scrim under the title treatment — backdrops are busy and a logo
              dropped straight onto one is often unreadable. */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/85 via-black/35 to-transparent" />

          {!isHovered &&
            (movie.logo ? (
              <div className="absolute bottom-3 left-3 right-3 h-10">
                <Image
                  src={movie.logo}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 250px, 312px"
                  className="object-contain object-left-bottom drop-shadow-md"
                />
              </div>
            ) : (
              <h3 className="absolute bottom-3 left-3 right-3 small-14 font-semibold line-clamp-2 drop-shadow-md">
                {movie.title}
              </h3>
            ))}

          {isHovered && (
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
              <h3 className="small-14 font-semibold line-clamp-1">{movie.title}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Play className="w-4 h-4 fill-current" />}
                >
                  Play
                </Button>
                <button
                  aria-label={`Add ${movie.title} to My List`}
                  className="p-1.5 rounded-full border border-white/50 hover:bg-white/20 transition"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  aria-label={`Rate ${movie.title}`}
                  className="p-1.5 rounded-full border border-white/50 hover:bg-white/20 transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="text-green-500">{movie.matchScore}%</span>
                {movie.year && <span>{movie.year}</span>}
                {movie.certification && (
                  <span className="border border-gray-400 px-1">
                    {movie.certification}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {typeof progress === "number" && (
          <div
            className="mt-2 h-[3px] w-full bg-zinc-600"
            role="progressbar"
            aria-label={`${movie.title} watch progress`}
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-luminflix-red"
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        )}
      </Link>
    </div>
  );
};

export default VideoCard;
