"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";
import { ROUTES } from "@/lib/constants";

export interface LoginState {
  error?: string;
}

/**
 * Reduces `callbackUrl` to a path on this origin.
 *
 * Auth.js hands back an absolute URL (http://host/browse), so this parses it
 * and keeps only pathname + search, discarding the origin entirely. That is
 * what makes it safe: the redirect target is always a path on our own site, so
 * a crafted login link cannot bounce the user to another host after sign-in.
 *
 * The final `startsWith("/")` check is what stops non-http schemes: `new URL()`
 * happily parses `javascript:alert(1)` and yields a pathname that is not a path.
 */
function safeCallbackUrl(raw: unknown): string {
  if (typeof raw !== "string" || raw.length === 0) return ROUTES.PROFILES;

  let path: string;

  if (raw.startsWith("/")) {
    // `//evil.com` and `/\evil.com` are protocol-relative URLs: they start with
    // a slash but are not same-origin paths.
    if (raw.startsWith("//") || raw.startsWith("/\\")) return ROUTES.PROFILES;
    path = raw;
  } else {
    try {
      const url = new URL(raw);
      path = `${url.pathname}${url.search}`;
    } catch {
      return ROUTES.PROFILES;
    }
  }

  return path.startsWith("/") ? path : ROUTES.PROFILES;
}

export async function authenticate(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const redirectTo = safeCallbackUrl(formData.get("callbackUrl"));

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo,
    });
    return {};
  } catch (error) {
    // signIn throws NEXT_REDIRECT on success. Swallowing it here would leave
    // the user sitting on the login page with no error and no navigation, so
    // anything that is not an AuthError has to be re-thrown.
    if (error instanceof AuthError) {
      // Deliberately generic: never reveal whether the email exists.
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: ROUTES.HOME });
}
