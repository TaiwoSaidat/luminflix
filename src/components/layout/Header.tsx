import { auth } from "@/auth";
import HeaderShell from "./HeaderShell";
import { getActiveProfile } from "@/lib/profile";
import { profiles } from "@/data/mockProfiles";

/**
 * Server half of the header: HeaderShell owns scroll/search/menu state and so
 * has to be a Client Component, which means it cannot call `auth()` itself.
 * Session and active profile are resolved here and passed down as props.
 */
export default async function Header() {
  const [session, activeProfile] = await Promise.all([
    auth(),
    getActiveProfile(),
  ]);

  return (
    <HeaderShell
      user={
        session?.user
          ? { name: session.user.name ?? "", email: session.user.email ?? "" }
          : null
      }
      profiles={profiles}
      activeProfile={activeProfile}
    />
  );
}
