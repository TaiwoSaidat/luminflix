import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Logo from "@/components/shared/logo";
import { profiles } from "@/data/mockProfiles";
import { getActiveProfile } from "@/lib/profile";
import { selectProfileAndContinue } from "@/lib/actions/profile";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Who's watching? — LuminFlix",
};

/**
 * Gated by src/proxy.ts. Hand-built rather than composed from shadcn: the
 * profile grid is part of the Netflix visual identity, not a generic primitive.
 *
 * With no database the profile list is shared across all demo accounts —
 * per-user profiles need persistence and are out of scope.
 */
export default async function ProfilesPage() {
  const activeProfile = await getActiveProfile();

  return (
    <div className="bg-luminflix-black text-white min-h-screen flex flex-col">
      <div className="px-4 md:px-12 py-6">
        <Link href={ROUTES.HOME} aria-label="LuminFlix home">
          <Logo />
        </Link>
      </div>

      <main className="flex-1 flexCenter flex-col px-4 pb-24">
        <h1 className="large-40 text-center mb-10">Who&apos;s watching?</h1>

        <ul className="flex flex-wrap justify-center gap-6 md:gap-10">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <form action={selectProfileAndContinue.bind(null, profile.id)}>
                <button
                  type="submit"
                  aria-current={profile.id === activeProfile.id}
                  className="group flex flex-col items-center gap-3 focus:outline-none"
                >
                  <span
                    className={`block w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-linear-to-br border-2 transition group-hover:border-white group-focus-visible:border-white ${
                      profile.id === activeProfile.id
                        ? "border-white"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={profile.avatar}
                      alt=""
                      width={128}
                      height={128}
                      className="w-full h-full object-contain p-6"
                    />
                  </span>
                  <span className="regular-16 text-gray-400 group-hover:text-white group-focus-visible:text-white transition">
                    {profile.name}
                  </span>
                </button>
              </form>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
