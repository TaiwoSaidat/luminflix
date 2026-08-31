import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { authConfig } from "@/auth.config";
import { findUserByEmail } from "@/data/users";

/**
 * Node-only half of the Auth.js setup — this is where bcryptjs and the seeded
 * user list live. Never import this module from `src/proxy.ts`; import
 * `@/auth.config` there instead. See the note in auth.config.ts.
 *
 * Sessions are JWTs in a signed cookie: there is no database, so there is
 * nowhere to store a session row.
 */
/**
 * A real bcrypt hash, used to equalise response time when an email is unknown.
 * Its plaintext is irrelevant -- only its cost factor needs to match the real ones.
 */
const DUMMY_HASH =
  "$2b$12$mnfKvn.gHY/pI/.iWzQsVe.SvEdyt2dG1cQRHCf9nPVfI8y7BwR9i";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Returns `null` for every failure — unknown email, wrong password,
       * malformed input alike. It must never throw with a reason or vary its
       * response by failure mode, or the sign-in form becomes an oracle for
       * which email addresses exist.
       */
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) return null;

        const user = findUserByEmail(email);

        // Compare against a dummy hash when the email is unknown, so the
        // response time does not reveal whether the account exists.
        const hash = user?.passwordHash ?? DUMMY_HASH;
        const valid = await bcrypt.compare(password, hash);

        if (!user || !valid) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      // `user` is only present on the initial sign-in call.
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});

