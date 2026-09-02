export type MediaType = "movie" | "tv";

/**
 * The single shape every component renders.
 *
 * TMDB splits its catalog across /movie and /tv with different field names
 * (`title`/`release_date` vs `name`/`first_air_date`). The mappers in
 * `src/lib/api.ts` normalize both onto this type, so no component ever has to
 * branch on `mediaType` — it only exists so links and detail fetches know
 * which endpoint a title came from.
 *
* Fields below the divider are detail-only: TMDB's list endpoints don't return
 * them, so they're absent on anything that came from a row or search result.
 */
export interface MediaItem {
  id: number;
  mediaType: MediaType;
  title: string;
  overview: string;
  /** Full CDN URLs, already sized — null when TMDB has no artwork on file. */
  poster: string | null;
  backdrop: string | null;
  /**
   * The title treatment — the show/film's name as artwork, drawn over the
   * backdrop on cards and the hero. Backdrops are textless plates, so without
   * this a landscape card shows no name at all. Null when the provider has no
   * English logo on file; callers fall back to rendering `title` as text.
   */
  logo: string | null;
  /** Release year, or null for unreleased/undated titles. */
  year: number | null;
  genres: string[];
  /** TMDB's 0–10 vote average as a whole percentage, Netflix "% match" style. */
  matchScore: number;

  // ---- detail-only, via getById() ----
  /** Minutes. Movies use `runtime`; TV uses the first `episode_run_time`. */
  runtime?: number;
  /** US certification (PG-13, TV-MA...). Absent when TMDB has none. */
  certification?: string;
  cast?: string[];
  /** YouTube key for the primary trailer, when one exists. */
  trailerKey?: string;
}

export interface MediaRow {
  /** Stable slug — used as a React key and, later, as a browse filter. */
  id: string;
  title: string;
  items: MediaItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
