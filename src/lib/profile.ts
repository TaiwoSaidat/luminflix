import "server-only";

import { cookies } from "next/headers";

import { profiles, type Profile } from "@/data/mockProfiles";

const PROFILE_COOKIE = "luminflix.profile";

/**
 * The active profile, read from an httpOnly cookie.
 *
 * This is a cookie rather than React Context on purpose: personalised fetches
 * happen in Server Components, and Context only exists on the client.
 *
 * A cookie is user-controlled input, so the id is validated against the known
 * list on the way out as well as on the way in — a tampered value falls back to
 * the first profile rather than throwing.
 */
export async function getActiveProfile(): Promise<Profile> {
  const store = await cookies();
  const id = store.get(PROFILE_COOKIE)?.value;

  return profiles.find((profile) => profile.id === id) ?? profiles[0];
}

export function isKnownProfile(id: string): boolean {
  return profiles.some((profile) => profile.id === id);
}

export { PROFILE_COOKIE };
