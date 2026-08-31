import "server-only";

/**
 * Seeded demo accounts.
 *
 * LuminFlix has no database, so there is no signup and no password reset —
 * accounts are added by editing this file. Generate a hash with:
 *
 *   node scripts/hash-password.mjs "somepassword"
 *
 * The matching passwords are printed on the sign-in page itself, because with
 * no signup route a visitor has no other way in — see src/app/login/page.tsx.
 * This is a demo fixture, not a credential store. Replace it with a real user
 * table before this app handles anything worth protecting.
 *
 * `server-only` keeps the hashes out of any client bundle: importing this from
 * a Client Component is a build error rather than a silent leak.
 */
export interface SeededUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export const users: SeededUser[] = [
  {
    id: "1",
    name: "Taiwo",
    email: "demo@luminflix.com",
    passwordHash: "$2b$12$mnfKvn.gHY/pI/.iWzQsVe.SvEdyt2dG1cQRHCf9nPVfI8y7BwR9i",
  },
  {
    id: "2",
    name: "Guest",
    email: "guest@luminflix.com",
    passwordHash: "$2b$12$OXyCXVJjs8ZamR2leY1Bb.W9mc3.k5jBDjJUqTE1AiUyuHzskax5i",
  },
];

/** Case-insensitive lookup — emails are not case-sensitive in practice. */
export function findUserByEmail(email: string): SeededUser | undefined {
  const normalised = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalised);
}
