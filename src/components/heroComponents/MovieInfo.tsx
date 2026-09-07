import React from "react";
import { MediaItem } from "@/types";
import Image from "next/image";
import { X } from "lucide-react";
import TitleBadges from "../shared/TitleBadges";
import IconButton from "../ui/IconButton";

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
          <IconButton
            icon={X}
            variant="overlay"
            onClick={onClose}
            label="Close details"
            className="absolute top-4 right-4 z-10"
          />
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
                <TitleBadges media={movie} size="md" />
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
