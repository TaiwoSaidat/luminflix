import type { Metadata } from "next";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BrowseFilters from "@/components/features/BrowseFilters";
import MediaCard from "@/components/shared/MediaCard";
import MediaGrid from "@/components/shared/MediaGrid";
import { getDiscover, getGenres, getTrending } from "@/lib/api";
import type { MediaItem, MediaType } from "@/types";

type SearchParams = Promise<{
  type?: string | string[];
  genre?: string | string[];
  sort?: string | string[];
}>;

/** A repeated param arrives as an array; only the first value is meaningful. */
function first(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Anything that isn't `tv` falls back to films rather than throwing. */
function readType(value?: string | string[]): MediaType {
  return first(value) === "tv" ? "tv" : "movie";
}

function readGenre(value?: string | string[]): number | undefined {
  const parsed = Number.parseInt(first(value) ?? "", 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * `?sort=new` is the header's "New & Popular" link. It names an ordering, not a
 * media type, so it switches the page to a mixed trending list instead of
 * filtering one of the two catalogs.
 */
function isTrending(value?: string | string[]): boolean {
  return first(value) === "new";
}

const TYPE_LABELS: Record<MediaType, string> = {
  movie: "Films",
  tv: "Series",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;

  if (isTrending(params.sort)) return { title: "New & Popular — LuminFlix" };

  const mediaType = readType(params.type);
  const label = TYPE_LABELS[mediaType];
  const genreId = readGenre(params.genre);
  if (!genreId) return { title: `${label} — LuminFlix` };

  // Cached for a week and memoized within the request, so this costs nothing
  // beyond what the page itself already fetches.
  const genres = await getGenres(mediaType);
  const name = genres.find((genre) => genre.id === genreId)?.name;

  return { title: name ? `${name} ${label} — LuminFlix` : `${label} — LuminFlix` };
}

/**
 * `/browse` — the destination of three header nav items: Series (`?type=tv`),
 * Films (`?type=movie`) and New & Popular (`?sort=new`).
 *
 * A Server Component: all filter state is in the URL, so there is nothing for a
 * client store to hold. Catalog data is ISR-cached in `@/lib/api` per the
 * caching table in CLAUDE.md.
 */
export default async function BrowsePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const trending = isTrending(params.sort);
  const mediaType = readType(params.type);
  const genreId = readGenre(params.genre);

  let items: MediaItem[];
  let genres: { id: number; name: string }[] = [];

  if (trending) {
    // A mixed list has no single genre vocabulary, so no chips are offered.
    items = await getTrending();
  } else {
    [items, genres] = await Promise.all([
      getDiscover(mediaType, genreId),
      getGenres(mediaType),
    ]);
  }

  const activeGenreName = genres.find((genre) => genre.id === genreId)?.name;
  const heading = trending
    ? "New & Popular"
    : `${activeGenreName ? `${activeGenreName} ` : ""}${TYPE_LABELS[mediaType]}`;

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pageX pageTop pb-16 space-y-6 md:space-y-8">
        {/* Heading and filter share a row: the dropdown names the same thing
            the heading does, so stacking them read as two separate controls. */}
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="large-30 md:large-40">{heading}</h1>

          {!trending && (
            <BrowseFilters
              mediaType={mediaType}
              genres={genres}
              activeGenre={activeGenreName ? genreId : undefined}
            />
          )}
        </div>

        {items.length === 0 ? (
          <p className="regular-16 leading-relaxed text-zinc-400 max-w-2xl">
            Nothing to show under this filter. Try another genre, or switch
            between films and series.
          </p>
        ) : (
          <MediaGrid className="xl:grid-cols-4">
            {items.map((item) => (
              <MediaCard
                key={`${item.mediaType}-${item.id}`}
                item={item}
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, (max-width: 1280px) 30vw, 22vw"
              />
            ))}
          </MediaGrid>
        )}
      </main>

      <Footer />
    </div>
  );
}
