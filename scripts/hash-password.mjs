/**
 * Generates a bcrypt hash for a demo account password.
 *
 *   node scripts/hash-password.mjs "somepassword"
 *
 * Paste the output into `passwordHash` in src/data/users.ts. Hashes are
 * generated here, once, and committed — never computed at runtime.
 */
import bcrypt from "bcryptjs";

const [password] = process.argv.slice(2);

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "somepassword"');
  process.exit(1);
}

const COST = 12;

console.log(await bcrypt.hash(password, COST));
