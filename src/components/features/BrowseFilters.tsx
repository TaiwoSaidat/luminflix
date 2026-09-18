import React from "react";
import type { MediaType } from "@/types";
import { ROUTES } from "@/lib/constants";
import Chip from "../shared/Chip";

/**
 * Local shape rather than the provider's `GenreResponse`: `src/types/media.ts`
 * describes the wire format and is documented as private to `src/lib/api.ts`.
 */
interface Genre {
  id: number;
  name: string;
}

interface BrowseFiltersProps {
  mediaType: MediaType;
  genres: Genre[];
  /** Undefined means "All" — no genre filter applied. */
  activeGenre?: number;
}

function browseHref(mediaType: MediaType, genreId?: number): string {
  const params = new URLSearchParams({ type: mediaType });
  if (genreId) params.set("genre", String(genreId));
  return `${ROUTES.BROWSE}?${params}`;
}

const TYPES: { label: string; value: MediaType }[] = [
  { label: "Films", value: "movie" },
  { label: "Series", value: "tv" },
];

/**
 * Type and genre filters for `/browse`.
 *
 * A Server Component with no client JS: every control is a navigation, so a
 * `Link` does the whole job, and the active state is derived from the params the
 * route already read. Filter state therefore lives only in the URL — reloading
 * or sharing a filtered address reproduces it exactly.
 *
 * Switching type drops the genre rather than carrying it over: the provider's
 * movie and TV genre ids are separate vocabularies, so the same number means
 * something different (or nothing) on the other side.
 */
const BrowseFilters: React.FC<BrowseFiltersProps> = ({
  mediaType,
  genres,
  activeGenre,
}) => (
  <div className="space-y-3">
    <div className="flex gap-2" role="group" aria-label="Media type">
      {TYPES.map((type) => (
        <Chip
          key={type.value}
          href={browseHref(type.value)}
          active={mediaType === type.value}
        >
          {type.label}
        </Chip>
      ))}
    </div>

    {/* Wraps rather than scrolls: there are ~19 genres, and a hidden scroll
        track on a phone is a control nobody finds. */}
    <ul aria-label="Genres" className="flex flex-wrap gap-2">
      <li>
        <Chip href={browseHref(mediaType)} active={!activeGenre}>
          All
        </Chip>
      </li>

      {genres.map((genre) => (
        <li key={genre.id}>
          <Chip
            href={browseHref(mediaType, genre.id)}
            active={activeGenre === genre.id}
          >
            {genre.name}
          </Chip>
        </li>
      ))}
    </ul>
  </div>
);

export default BrowseFilters;
