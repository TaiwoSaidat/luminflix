import type { Metadata } from "next";
import Link from "next/link";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MediaCard from "@/components/shared/MediaCard";
import MediaGrid from "@/components/shared/MediaGrid";
import { search } from "@/lib/api";
import { MOVIE_GENRES, ROUTES } from "@/lib/constants";
import type { MediaItem } from "@/types";

/** `?q=` arrives as a string, an array (repeated param) or not at all. */
type SearchParams = Promise<{ q?: string | string[] }>;

function readQuery(params: { q?: string | string[] }): string {
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  return raw?.trim() ?? "";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const query = readQuery(await searchParams);

  return {
    title: query ? `${query} — Search LuminFlix` : "Search — LuminFlix",
    // A results page is query-scoped and never worth indexing.
    robots: { index: false, follow: true },
  };
}

/** The genre list doubles as starting points when there's nothing to show. */
const Suggestions: React.FC = () => (
  <ul className="flex flex-wrap gap-2">
    {MOVIE_GENRES.map((genre) => (
      <li key={genre}>
        <Link
          href={`${ROUTES.SEARCH}?q=${encodeURIComponent(genre)}`}
          className="focusRing block rounded-full border border-white/30 px-4 py-2 small-14 transition hover:border-white hover:bg-white/10"
        >
          {genre}
        </Link>
      </li>
    ))}
  </ul>
);

/**
 * `/search` — results for `?q=`.
 *
 * A Server Component on purpose: the query already lives in the URL, so there
 * is no client state to hold and no reason to ship a fetch to the browser. The
 * header's SearchBox rewrites `?q=` and this re-renders on the server.
 *
 * `search()` is `no-store` (see the caching table in CLAUDE.md) — caching one
 * query's response would serve it under a different query.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = readQuery(await searchParams);
  const results: MediaItem[] = query ? await search(query) : [];

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pageX pageTop pb-16 space-y-6 md:space-y-8">
        {!query ? (
          <section className="space-y-4 max-w-2xl">
            <h1 className="large-30 md:large-40">Search LuminFlix</h1>
            <p className="regular-16 leading-relaxed text-zinc-400">
              Find films and series by title, cast or genre. Start typing in the
              search box above, or pick one of these.
            </p>
            <Suggestions />
          </section>
        ) : results.length === 0 ? (
          <section className="space-y-4 max-w-2xl">
            <h1 className="large-30 md:large-40">
              No results for &ldquo;{query}&rdquo;
            </h1>
            <p className="regular-16 leading-relaxed text-zinc-400">
              Try a different spelling, a shorter phrase, or a cast member&apos;s
              name. You could also browse by genre.
            </p>
            <Suggestions />
          </section>
        ) : (
          <>
            <div className="space-y-2">
              <h1 className="large-24 md:large-30">
                Results for &ldquo;{query}&rdquo;
              </h1>
              <p aria-live="polite" className="small-14 text-zinc-400">
                {results.length} {results.length === 1 ? "title" : "titles"}
              </p>
            </div>

            <MediaGrid className="xl:grid-cols-4">
              {results.map((item) => (
                <MediaCard
                  key={`${item.mediaType}-${item.id}`}
                  item={item}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, (max-width: 1280px) 30vw, 22vw"
                />
              ))}
            </MediaGrid>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
