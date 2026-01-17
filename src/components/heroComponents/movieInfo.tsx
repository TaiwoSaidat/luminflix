import React from "react";
import { Movie } from "@/types";
import Image from "next/image";

type MovieInfoProps = {
  movie: Movie;
  onClose: () => void;
};
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
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            ✕
          </button>
          <div className="">
            <img
              src={movie.backdrop}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex px-6 py-4  flex-col gap-4">
            <div className=" flex gap-2">
              <div className=" flex-3 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  {/* <span className="text-green-500 font-semibold">98% Match</span> */}
                  <span>{movie.year}</span>

                  <span>{movie.duration}</span>
                  <span className="border border-gray-400 px-1.5 py-0.5">
                    HD
                  </span>
                  <span className="border border-gray-400 px-1.5 py-0.5">
                    {movie.genre}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="">{movie.rating}</span>
                  <span className="">{movie.triggers?.join(", ")}</span>
                </div>
                <div className="">
                  <p className="">{movie.description}</p>
                </div>
              </div>
              <div className=" flex-1 gap-4">
                <div className=" ">
                  <span className="text-[#9C949B] capitalize"> cast: </span>
                  <span className="text-sm">{movie.cast?.join(", ")}</span>
                </div>
                <div className="">
                  <span className="text-[#9C949B] capitalize mt-4">
                    genres:
                  </span>
                  <span className="text-sm">{movie.genres?.join(", ")}</span>
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
