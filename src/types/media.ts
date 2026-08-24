/**
 * Raw response shapes from the upstream media API (TMDB) — only the fields
 * this app actually consumes.
 *
 * Nothing outside `src/lib/api.ts` should import from this file. These types
 * describe the wire format the provider sends; the rest of the app works with
 * `MediaItem` from `@/types`, which the mappers in `api.ts` produce.
 *
 * Note the deliberate split: `MediaItemResponse` here is raw provider data, while
 * `MediaItem` in `@/types` is the cleaned, normalized shape components render.
 */

export interface MediaListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

/** Shared by list endpoints (/trending, /popular, /discover, /search). */
interface MediaResponseBase {
  id: number;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  vote_average: number;
  media_type?: "movie" | "tv" | "person";
}

export interface MovieResponse extends MediaResponseBase {
  title: string;
  release_date?: string;
}

export interface SeriesResponse extends MediaResponseBase {
  name: string;
  first_air_date?: string;
}

export type MediaItemResponse = MovieResponse | SeriesResponse;

export interface GenreResponse {
  id: number;
  name: string;
}

/** Detail endpoints return full genre objects rather than `genre_ids`. */
export interface MediaDetailResponse extends Omit<MediaResponseBase, "genre_ids"> {
  title?: string;
  name?: string;
  release_date?: string;
  first_air_date?: string;
  genres?: GenreResponse[];
  runtime?: number;
  episode_run_time?: number[];
  credits?: {
    cast?: { id: number; name: string }[];
  };
  /** Movies: certification lives under a per-country release list. */
  release_dates?: {
    results?: {
      iso_3166_1: string;
      release_dates: { certification: string }[];
    }[];
  };
  /** TV: the equivalent is a flat per-country rating. */
  content_ratings?: {
    results?: { iso_3166_1: string; rating: string }[];
  };
  videos?: {
    results?: { site: string; type: string; key: string }[];
  };
}
