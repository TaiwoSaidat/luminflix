import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

/**
 * Next 16 renamed the `middleware` file convention to `proxy`; `middleware.ts`
 * still works but logs a deprecation warning at build time.
 *
 * This imports `@/auth.config`, never `@/auth` — see the note in auth.config.ts
 * about keeping bcryptjs out of this module graph.
 */
export default NextAuth(authConfig).auth;

/**
 * Scoped to the gated routes only. Running the proxy app-wide would put
 * per-request auth work on `/`, `/about` and `/login`, which are public.
 *
 * `/` is deliberately absent: it is public, but renders a landing page or the
 * full app depending on the session, which it decides itself by calling
 * `auth()`.
 */
export const config = {
  matcher: [
    "/browse/:path*",
    "/search/:path*",
    "/my-list/:path*",
    "/profiles/:path*",
    "/watch/:path*",
  ],
};
