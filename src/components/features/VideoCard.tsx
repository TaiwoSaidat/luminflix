import React, { useState } from "react";
import { Movie } from "@/types";
import Button from "../ui/Button";
import { Play, Plus, ThumbsUp } from "lucide-react";

const VideoCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      //   min-w-[200px] md:min-w-[280px]
      className="relative group cursor-pointer transition-all duration-300 min-w-50 md:min-w-70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-md">
        <img
          src={movie.thumbnail}
          alt={movie.title}
          className="w-full aspect-2/3 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2 bg-linear-to-t from-black to-transparent">
          <h3 className="font-bold text-sm line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Play className="w-4 h-4 fill-current" />}
            >
              Play
            </Button>
            <button className="p-1.5 rounded-full border border-white/50 hover:bg-white/20 transition">
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-full border border-white/50 hover:bg-white/20 transition">
              <ThumbsUp className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="text-green-500">95%</span>
            <span>{movie.year}</span>
            <span className="border border-gray-400 px-1">{movie.rating}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
