import React from "react";
import type { MediaType } from "@/types";
import { ROUTES } from "@/lib/constants";
import GenreSelect from "./GenreSelect";

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

/**
 * The genre filter for `/browse`.
 *
 * A Server Component with no client JS: every control is a navigation, so a
 * `Link` does the whole job, and the active state is derived from the params
 * the route already read. Filter state therefore lives only in the URL —
 * reloading or sharing a filtered address reproduces it exactly.
 *
 * Films/Series used to sit here as a second pair of chips, which restated the
 * heading directly above them. The header nav already owns that switch, so
 * this is genre only.
 */
const BrowseFilters: React.FC<BrowseFiltersProps> = ({
  mediaType,
  genres,
  activeGenre,
}) => (
  <GenreSelect
    options={genres}
    activeId={activeGenre}
    hrefFor={(genreId) => browseHref(mediaType, genreId)}
  />
);

export default BrowseFilters;
