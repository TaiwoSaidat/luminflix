import React from "react";
import { Movie } from "@/types";

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
          className="bg-zinc-900 p-6 rounded-xl max-w-lg w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            ✕
          </button>
          <p className="">insert movie details here</p>
          {/* Movie content */}
          {/* <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
          <p className="text-sm text-zinc-300 mb-4">{movie.overview}</p>

          <div className="text-sm text-zinc-400 space-y-1">
            <p>
              <span className="text-white font-medium">Release:</span>{" "}
              {movie.release_date}
            </p>
            <p>
              <span className="text-white font-medium">Rating:</span>{" "}
              {movie.vote_average}
            </p>
          </div> */}
          <div className="flex items-center gap-3 text-sm">
            {/* <span className="text-green-500 font-semibold">98% Match</span> */}
            <span>{movie.year}</span>

            <span>{movie.duration}</span>
            <span className="border border-gray-400 px-1.5 py-0.5">
              {movie.rating}
            </span>
            <span className="border border-gray-400 px-1.5 py-0.5">
              {movie.genre}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieInfo;
