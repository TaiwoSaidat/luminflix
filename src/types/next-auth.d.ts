import type { DefaultSession } from "next-auth";

/**
 * Adds the `id` that `src/auth.ts`'s jwt/session callbacks put on the session,
 * so `session.user.id` typechecks. Picked up automatically — tsconfig.json
 * already includes `**\/*.ts`.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
