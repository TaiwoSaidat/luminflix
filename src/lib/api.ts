import "server-only";

import type { MediaItem, MediaRow, MediaType } from "@/types";
import type {
  MediaDetailResponse,
  GenreResponse,
  MediaItemResponse,
  MediaListResponse,
  MovieResponse,
  ImagesResponse,
} from "@/types/media";

const BASE_URL = process.env.MEDIA_API_URL ?? "https://api.themoviedb.org/3";
const ACCESS_TOKEN = process.env.MEDIA_ACCESS_TOKEN;
const IMAGE_URL =
  process.env.NEXT_PUBLIC_MEDIA_IMAGE_URL ?? "https://image.tmdb.org/t/p";

/** Revalidation windows, per the caching table in CLAUDE.md. */
const CATALOG_TTL = 3600; // 1 hour
const DETAIL_TTL = 86400; // 1 day
const GENRE_TTL = 604800; // 1 week — the provider's genre list is effectively static

export class MediaApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string
  ) {
    super(`Media API request failed (${status}): ${path}`);
    this.name = "MediaApiError";
  }
}

type CacheMode = { revalidate: number } | "no-store";

async function fetchMedia<T>(
  path: string,
  options: { cache: CacheMode; params?: Record<string, string> }
): Promise<T> {
  if (!ACCESS_TOKEN) {
    throw new Error(
      "MEDIA_ACCESS_TOKEN is not set. Add it to .env — without a NEXT_PUBLIC_ prefix."
    );
  }

  const url = new URL(`${BASE_URL}${path}`);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    ...(options.cache === "no-store"
      ? { cache: "no-store" as const }
      : { next: { revalidate: options.cache.revalidate } }),
  });

  if (!response.ok) {
    throw new MediaApiError(response.status, path);
  }

  return response.json() as Promise<T>;
}

/* ------------------------------------------------------------------ *
 * Mappers — the only place the provider's field names are allowed to exist.
 * ------------------------------------------------------------------ */

function imageUrl(path: string | null, size: string): string | null {
  return path ? `${IMAGE_URL}/${size}${path}` : null;
}

/**
 * PNG is preferred over SVG: SVG logos would need `images.dangerouslyAllowSVG`
 * in next.config to render through `next/image`, which isn't worth switching on
 * for provider-hosted artwork. Falls back to whatever is on file if no PNG.
 */
function pickLogo(images?: ImagesResponse): string | null {
  const logos = images?.logos ?? [];
  const best =
    logos.find((logo) => logo.file_path.toLowerCase().endsWith(".png")) ??
    logos[0];
  return imageUrl(best?.file_path ?? null, "w500");
}

/**
 * Title logos come from a per-title endpoint, so a row of 20 costs 20 requests.
 * They're immutable once published, hence the long TTL — after the first render
 * these are served from the data cache. A failure here is non-fatal: the card
 * falls back to text, so one bad response must not take down a whole row.
 */
async function getLogo(mediaType: MediaType, id: number): Promise<string | null> {
  try {
    const images = await fetchMedia<ImagesResponse>(
      `/${mediaType}/${id}/images`,
      {
        cache: { revalidate: DETAIL_TTL },
        // `null` keeps textless-language logos, which are usually the English one.
        params: { include_image_language: "en,null" },
      }
    );
    return pickLogo(images);
  } catch {
    return null;
  }
}

function yearOf(date?: string): number | null {
  if (!date) return null;
  const year = Number.parseInt(date.slice(0, 4), 10);
  return Number.isNaN(year) ? null : year;
}

function isMovie(item: MediaItemResponse): item is MovieResponse {
  return "title" in item;
}

/**
 * List endpoints return `genre_ids` rather than names, so callers pass in the
 * lookup built by `getGenreMap()`.
 */
function mapListItem(
  item: MediaItemResponse,
  mediaType: MediaType,
  genreNames: Map<number, string>
): MediaItem {
  return {
    id: item.id,
    mediaType,
    title: isMovie(item) ? item.title : item.name,
    overview: item.overview,
    poster: imageUrl(item.poster_path, "w500"),
    backdrop: imageUrl(item.backdrop_path, "w1280"),
    // List endpoints carry no artwork beyond poster/backdrop; `getList` fills
    // this in with a second, separately-cached request per title.
    logo: null,
    year: yearOf(isMovie(item) ? item.release_date : item.first_air_date),
    genres: (item.genre_ids ?? [])
      .map((id) => genreNames.get(id))
      .filter((name): name is string => Boolean(name)),
    matchScore: Math.round(item.vote_average * 10),
  };
}

/** US certification sits in a different shape for movies vs TV. */
function certificationOf(detail: MediaDetailResponse): string | undefined {
  const movieCert = detail.release_dates?.results
    ?.find((entry) => entry.iso_3166_1 === "US")
    ?.release_dates.map((release) => release.certification)
    .find((value) => value.length > 0);

  const tvCert = detail.content_ratings?.results?.find(
    (entry) => entry.iso_3166_1 === "US"
  )?.rating;

  return movieCert || tvCert || undefined;
}

function mapDetail(detail: MediaDetailResponse, mediaType: MediaType): MediaItem {
  const runtime = detail.runtime ?? detail.episode_run_time?.[0];

  return {
    id: detail.id,
    mediaType,
    title: detail.title ?? detail.name ?? "Untitled",
    overview: detail.overview,
    poster: imageUrl(detail.poster_path, "w500"),
    backdrop: imageUrl(detail.backdrop_path, "original"),
    logo: pickLogo(detail.images),
    year: yearOf(detail.release_date ?? detail.first_air_date),
    genres: (detail.genres ?? []).map((genre) => genre.name),
    matchScore: Math.round(detail.vote_average * 10),
    runtime: runtime && runtime > 0 ? runtime : undefined,
    certification: certificationOf(detail),
    cast: detail.credits?.cast?.slice(0, 4).map((member) => member.name),
    trailerKey: detail.videos?.results?.find(
      (video) => video.site === "YouTube" && video.type === "Trailer"
    )?.key,
  };
}

/* ------------------------------------------------------------------ *
 * Endpoints
 * ------------------------------------------------------------------ */

/** Genre id → name. Needed to resolve the `genre_ids` on list results. */
export async function getGenreMap(
  mediaType: MediaType
): Promise<Map<number, string>> {
  const genres = await getGenres(mediaType);
  return new Map(genres.map((genre) => [genre.id, genre.name]));
}

export async function getGenres(mediaType: MediaType): Promise<GenreResponse[]> {
  const data = await fetchMedia<{ genres: GenreResponse[] }>(`/genre/${mediaType}/list`, {
    cache: { revalidate: GENRE_TTL },
  });
  return data.genres;
}

async function getList(
  path: string,
  mediaType: MediaType,
  params?: Record<string, string>,
  /** Trims the page before the per-title logo fetches, which cost one request each. */
  limit?: number
): Promise<MediaItem[]> {
  // Genre list is fetched alongside, not after — it's a separate cached request.
  const [data, genreNames] = await Promise.all([
    fetchMedia<MediaListResponse<MediaItemResponse>>(path, {
      cache: { revalidate: CATALOG_TTL },
      params,
    }),
    getGenreMap(mediaType),
  ]);

  const results = limit ? data.results.slice(0, limit) : data.results;

  return Promise.all(
    results.map(async (item) => ({
      ...mapListItem(item, mediaType, genreNames),
      logo: await getLogo(mediaType, item.id),
    }))
  );
}

const ROW_DEFINITIONS = [
  {
    id: "trending",
    title: "Trending Now",
    path: "/trending/movie/week",
    mediaType: "movie",
  },
  {
    id: "popular-tv",
    title: "Popular Series",
    path: "/tv/popular",
    mediaType: "tv",
  },
  {
    id: "top-rated",
    title: "Top Rated Films",
    path: "/movie/top_rated",
    mediaType: "movie",
  },
  {
    id: "now-playing",
    title: "New Releases",
    path: "/movie/now_playing",
    mediaType: "movie",
  },
  {
    id: "top-rated-tv",
    title: "Critically Acclaimed Series",
    path: "/tv/top_rated",
    mediaType: "tv",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  path: string;
  mediaType: MediaType;
}[];

/** Every row on the home page, fetched in parallel. */
export async function getRows(): Promise<MediaRow[]> {
  return Promise.all(
    ROW_DEFINITIONS.map(async (row) => ({
      id: row.id,
      title: row.title,
      items: await getList(row.path, row.mediaType),
    }))
  );
}

/** The hero title — the top trending film, with detail fields filled in. */
export async function getFeatured(): Promise<MediaItem | null> {
  const trending = await getList("/trending/movie/week", "movie");
  const top = trending[0];
  if (!top) return null;

  // The hero shows runtime and certification, which list results don't carry.
  return getById("movie", top.id);
}

export async function getById(
  mediaType: MediaType,
  id: number
): Promise<MediaItem> {
  const detail = await fetchMedia<MediaDetailResponse>(`/${mediaType}/${id}`, {
    cache: { revalidate: DETAIL_TTL },
    params: {
      append_to_response:
        mediaType === "movie"
          ? "credits,release_dates,videos,images"
          : "credits,content_ratings,videos,images",
      include_image_language: "en,null",
    },
  });

  return mapDetail(detail, mediaType);
}

/**
 * "More Like This" on the title detail modal.
 *
 * Non-fatal by design: the modal is still worth showing without its
 * recommendation grid, so a provider failure here resolves to an empty list
 * rather than taking the whole modal down.
 */
export async function getRecommendations(
  mediaType: MediaType,
  id: number,
  limit = 9
): Promise<MediaItem[]> {
  try {
    return await getList(
      `/${mediaType}/${id}/recommendations`,
      mediaType,
      undefined,
      limit
    );
  } catch {
    return [];
  }
}

export async function getByGenre(
  mediaType: MediaType,
  genreId: number
): Promise<MediaItem[]> {
  return getList(`/discover/${mediaType}`, mediaType, {
    with_genres: String(genreId),
    sort_by: "popularity.desc",
  });
}

/**
 * Query-dependent, so never cached. `/search/multi` also returns people —
 * they're dropped here so callers only ever see titles.
 */
export async function search(query: string): Promise<MediaItem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const [data, movieGenres, tvGenres] = await Promise.all([
    fetchMedia<MediaListResponse<MediaItemResponse>>("/search/multi", {
      cache: "no-store",
      params: { query: trimmed, include_adult: "false" },
    }),
    getGenreMap("movie"),
    getGenreMap("tv"),
  ]);

  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => {
      const mediaType = item.media_type as MediaType;
      return mapListItem(
        item,
        mediaType,
        mediaType === "movie" ? movieGenres : tvGenres
      );
    });
}
