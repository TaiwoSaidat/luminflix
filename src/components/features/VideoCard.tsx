"use client";

import React, { useState } from "react";
import { MediaItem } from "@/types";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";
import { Play, Plus, ThumbsUp } from "lucide-react";

const VideoCard: React.FC<{ movie: MediaItem }> = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const watchHref = `/watch/${movie.mediaType}/${movie.id}`;

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 min-w-50 md:min-w-70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={watchHref} className="block">
        <div className="relative aspect-2/3 overflow-hidden rounded-md">
          {movie.poster ? (
            <Image
              src={movie.poster}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 200px, 280px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center p-4">
              <span className="text-sm text-zinc-400 text-center line-clamp-3">
                {movie.title}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 bg-linear-to-t from-black to-transparent">
          <h3 className="font-bold text-sm line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2">
            <Link href={watchHref}>
              <Button
                variant="primary"
                size="sm"
                icon={<Play className="w-4 h-4 fill-current" />}
              >
                Play
              </Button>
            </Link>
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
  );
};

export default VideoCard;
