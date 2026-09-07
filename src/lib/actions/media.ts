"use server";

import { auth } from "@/auth";
import { getById, getRecommendations } from "@/lib/api";
import type { MediaItem, MediaType } from "@/types";

export type TitleDetails = {
  detail: MediaItem;
  recommendations: MediaItem[];
};

/**
 * Everything the title detail modal renders beyond what a row card already
 * holds — runtime, certification, cast, trailer key, and "More Like This".
 *
 * The modal is a Client Component opened on demand, so it can't call
 * `src/lib/api.ts` (server-only) directly and shouldn't force its whole row to
 * fetch detail data up front for a modal that may never open. A Server Action
 * is the seam: the fetches stay on the server, behind the same cache windows,
 * with no new route handler and no client-side API key.
 *
 * Server Actions are publicly reachable endpoints, so this re-checks the
 * session itself rather than trusting the page it was rendered on — the same
 * reasoning as `setActiveProfile` in `./profile.ts`.
 */
export async function getTitleDetails(
  mediaType: MediaType,
  id: number
): Promise<TitleDetails | null> {
  const session = await auth();
  if (!session?.user) return null;

  if (mediaType !== "movie" && mediaType !== "tv") return null;
  if (!Number.isInteger(id) || id <= 0) return null;

  const [detail, recommendations] = await Promise.all([
    getById(mediaType, id),
    getRecommendations(mediaType, id),
  ]);

  return { detail, recommendations };
}
