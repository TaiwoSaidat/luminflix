"use client";

import React, { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import Logo from "../shared/logo";
import { Search, Bell, X } from "lucide-react";
import Profiles from "../headerComponents/Profiles";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import type { Profile } from "@/data/mockProfiles";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

interface HeaderShellProps {
  user: { name: string; email: string } | null;
  profiles: Profile[];
  activeProfile: Profile;
}

const HeaderShell: React.FC<HeaderShellProps> = ({
  user,
  profiles,
  activeProfile,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Owned here rather than by the page, so the page can stay a Server Component.
  // Same external-store pattern as useMediaQuery — correct initial value on a
  // mid-page refresh, without a setState-in-effect cascade.
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 50,
    () => false
  );

  // `href: "#"` marks an item with no destination yet — TMDB has no games, and
  // language browsing needs UI that doesn't exist. Kept visible on purpose.
  const navItems = [
    { label: "Home", href: ROUTES.HOME },
    { label: "Series", href: `${ROUTES.BROWSE}?type=tv` },
    { label: "Films", href: `${ROUTES.BROWSE}?type=movie` },
    { label: "Games", href: "#" },
    { label: "New & Popular", href: `${ROUTES.BROWSE}?sort=new` },
    { label: "My List", href: ROUTES.MY_LIST },
    { label: "Browse by Language", href: "#" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-black/95 backdrop-blur-sm"
          : "bg-linear-to-b from-black/80 to-transparent"
      )}
    >
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />

          {/* DESKTOP NAVIGATION: Visible on md and up */}
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-gray-200 hover:text-gray-400 transition"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* MOBILE/TABLET NAVIGATION: Visible below md */}
          <div className="relative md:hidden">
            <div
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <p className="text-white text-sm">Browse</p>
              <ChevronDown
                className={`w-4 h-4 text-white transition ${
                  showMobileMenu ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {showMobileMenu && (
              <div className="absolute top-10 left-0 w-56 bg-black border border-b-black border-x-black flex flex-col py-2 shadow-xl">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-3 text-sm text-gray-200 hover:bg-zinc-800 transition text-center"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center gap-4">
          {showSearch ? (
            <div className="flex items-center bg-black/80 border border-white px-3 py-1">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Titles, people, genres"
                aria-label="Search titles, people and genres"
                className="bg-transparent text-white text-sm outline-none w-32 md:w-64"
                autoFocus
              />
              <X
                className="w-4 h-4 text-gray-400 cursor-pointer ml-2"
                onClick={() => setShowSearch(false)}
              />
            </div>
          ) : (
            <Search
              className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition"
              onClick={() => setShowSearch(true)}
            />
          )}
          <Bell className="w-5 h-5 text-white cursor-pointer hover:text-gray-300 transition" />

          {/* Every route that renders the header is gated, so the signed-out
              branch is defensive rather than a designed state. */}
          {user ? (
            <Profiles profiles={profiles} activeProfile={activeProfile} />
          ) : (
            <Link
              href={ROUTES.LOGIN}
              className="text-sm bg-luminflix-red text-white px-4 py-1.5 rounded hover:bg-luminflix-red/90 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderShell;
