"use client";

import { Movie } from "@/types";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";

import React from "react";
// import movieInfo from "../heroComponents/movieInfo";
// import MovieInfo from "../heroComponents/movieInfo";
import MovieInfo from "../heroComponents/movieInfo";


const Hero: React.FC<{ movie: Movie }> = ({ movie }) => {
  const [muted, setMuted] = useState(true);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center px-4 md:px-12">
        <div className="max-w-2xl space-y-4 pb-24">
          <h1 className="text-5xl md:text-7xl font-bold drop-shadow-lg">
            {movie.title}
          </h1>

          <div className=" flex items-center gap-3">
            <div className="w-9.5 h-9.5 rounded bg-linear-to-br from-red-600 to-red-700 text-xs font-extrabold  flex flex-col items-center justify-center">
              <span className="">Top</span>
              <span className="">10</span>
            </div>
            <p className=" font-bold text-2xl">No.2 in Films Today</p>
          </div>

          <p className="text-lg md:text-xl text-gray-200 max-w-xl line-clamp-3">
            {movie.description}
          </p>
          <div className="flex gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              icon={<Play className="w-6 h-6 fill-current" />}
            >
              Play
            </Button>
            {/* <Button
              variant="secondary"
              size="lg"
              icon={<Info className="w-6 h-6" />}
            >
              More Info
            </Button> */}
            <Button
              variant="secondary"
              size="lg"
              icon={<Info className="w-6 h-6" />}
              onClick={() => setOpen(true)}
            >
              More Info
            </Button>

            {open && <MovieInfo movie={movie} onClose={() => setOpen(false)} />}
          </div>
        </div>
      </div>

      <button
        onClick={() => setMuted(!muted)}
        className="absolute bottom-32 top right-8 p-2 rounded-full border-2 border-white/60 bg-black/30 hover:bg-black/50 transition"
      >
        {muted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default Hero;
