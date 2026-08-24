import React from "react";
import { MediaItem } from "@/types";
import Image from "next/image";
import { formatDuration } from "@/lib/utils";

type MovieInfoProps = {
  movie: MediaItem;
  onClose: () => void;
};

/**
 * `runtime`, `certification` and `cast` only exist on titles fetched through
 * `getById()`. Opened from a row, those fields are absent — each is guarded
 * rather than rendered blank.
 */
const MovieInfo: React.FC<MovieInfoProps> = ({ movie, onClose }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-zinc-900 rounded-xl max-w-xl w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close details"
            className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-white"
          >
            ✕
          </button>
          <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
            {movie.backdrop ? (
              <Image
                src={movie.backdrop}
                alt={movie.title}
                fill
                sizes="(max-width: 768px) 100vw, 576px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800" />
            )}
          </div>
          <div className="flex px-6 py-4  flex-col gap-4">
            <div className=" flex gap-2">
              <div className=" flex-3 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-green-500 font-semibold">
                    {movie.matchScore}% Match
                  </span>
                  {movie.year && <span>{movie.year}</span>}
                  {movie.runtime && <span>{formatDuration(movie.runtime)}</span>}
                  <span className="border border-gray-400 px-1.5 py-0.5">
                    HD
                  </span>
                  {movie.genres[0] && (
                    <span className="border border-gray-400 px-1.5 py-0.5">
                      {movie.genres[0]}
                    </span>
                  )}
                </div>
                {movie.certification && (
                  <div className="flex items-center gap-3 text-sm">
                    <span className="">{movie.certification}</span>
                  </div>
                )}
                <div className="">
                  <p className="">{movie.overview}</p>
                </div>
              </div>
              <div className=" flex-1 gap-4">
                {movie.cast && movie.cast.length > 0 && (
                  <div className=" ">
                    <span className="text-[#9C949B] capitalize"> cast: </span>
                    <span className="text-sm">{movie.cast.join(", ")}</span>
                  </div>
                )}
                <div className="">
                  <span className="text-[#9C949B] capitalize mt-4">
                    genres:
                  </span>
                  <span className="text-sm">{movie.genres.join(", ")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieInfo;
