import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the Auth.js setup.
 *
 * `src/proxy.ts` runs on every gated request, so it must not pull in bcryptjs,
 * `server-only`, or the seeded user list. Keeping `providers` empty here and
 * adding the Credentials provider in `src/auth.ts` is the documented Auth.js
 * split, and it is the thing most likely to break the build if it is undone:
 * one stray import of `./auth` from this file and the proxy graph gains a
 * Node-only dependency.
 *
 * Nothing in this file may import from `src/auth.ts` or `src/data/users.ts`.
 */
export const authConfig = {
  /**
   * Auth.js only auto-trusts the request host in development and on Vercel.
   * Under `next start` (and any self-hosted deploy) it otherwise rejects every
   * request with UntrustedHost, so this has to be explicit.
   *
   * This trusts the Host / X-Forwarded-Host header, which is safe when the app
   * sits behind a proxy that sets it (Vercel, or any reverse proxy you
   * control), and is the standard setting for a Next.js deployment. Set
   * AUTH_URL instead if the app is ever exposed directly to untrusted traffic.
   */
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**
     * `src/proxy.ts` scopes its matcher to the gated routes, so anything that
     * reaches this callback requires a session. Returning `false` makes Auth.js
     * redirect to `pages.signIn` with a `callbackUrl` automatically.
     */
    authorized({ auth }) {
      return Boolean(auth?.user);
    },
  },
  providers: [],
} satisfies NextAuthConfig;
