"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { auth } from "@/auth";
import { ROUTES } from "@/lib/constants";
import { PROFILE_COOKIE, isKnownProfile } from "@/lib/profile";

/**
 * Writes the active profile cookie.
 *
 * Server Actions are publicly reachable endpoints, so this re-checks the
 * session itself rather than trusting that the proxy gated the page the form
 * was rendered on, and validates the id against the known list before writing.
 */
export async function setActiveProfile(id: string) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.LOGIN);

  if (!isKnownProfile(id)) return;

  const store = await cookies();
  store.set(PROFILE_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  // The header renders the active profile on every page.
  revalidatePath("/", "layout");
}

/** Picks a profile, then continues into the app. */
export async function selectProfileAndContinue(id: string) {
  await setActiveProfile(id);
  redirect(ROUTES.HOME);
}
