import { Movie } from "@/types";
import MOCK_MOVIES from "./mockMovies";

const CATEGORIES = [
  { name: "Trending Now", movies: MOCK_MOVIES.slice(0, 4) },
  { name: "Action & Adventure", movies: MOCK_MOVIES.slice(1, 5) },
  { name: "Romantic Movies", movies: MOCK_MOVIES.slice(2, 6) },
  { name: "Documentaries", movies: MOCK_MOVIES.slice(0, 3) },
];

export default CATEGORIES;

export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};
