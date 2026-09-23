import React from "react";
import { MediaItem } from "@/types";
import ScrollRow from "../shared/ScrollRow";
import VideoCard from "./VideoCard";

/**
 * A home-page row: one catalog list drawn as `VideoCard`s in a horizontal
 * strip.
 *
 * No longer a Client Component — the scroll state moved into `ScrollRow` when
 * the Top 10 row needed the same behaviour, and nothing is left here that runs
 * in the browser. The cards are still client components in their own right.
 */
const ContentRow: React.FC<{ title: string; movies: MediaItem[] }> = ({
  title,
  movies,
}) => (
  <ScrollRow title={title}>
    {movies.map((movie) => (
      <VideoCard key={movie.id} movie={movie} />
    ))}
  </ScrollRow>
);

export default ContentRow;
