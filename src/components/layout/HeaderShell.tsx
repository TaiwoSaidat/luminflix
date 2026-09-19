"use client";

import React, { Suspense, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import Logo from "../shared/logo";
import { Bell, Search } from "lucide-react";
import Profiles from "../headerComponents/Profiles";
import SearchBox from "../headerComponents/SearchBox";
import NavMenu, { type NavItem } from "../headerComponents/NavMenu";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import type { Profile } from "@/data/mockProfiles";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/**
 * The fixed slot every icon control in the strip occupies.
 *
 * Shared rather than repeated: the bell used to be a bare `<svg>` with its own
 * `h-5 w-5`, so it drifted out of step with the search toggle — which pads its
 * glyph — at any width where their boxes disagreed.
 *
 * Deliberately not `relative`: the search field positions against the nav
 * column that contains this slot, not against the slot itself. The fixed size
 * is what keeps the row still when the field takes the toggle out of flow.
 */
const ICON_SLOT = "h-7 w-7 shrink-0";

// `href: "#"` marks an item with no destination yet — TMDB has no games, and
// language browsing needs UI that doesn't exist. Kept visible on purpose.
const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Series", href: `${ROUTES.BROWSE}?type=tv` },
  { label: "Films", href: `${ROUTES.BROWSE}?type=movie` },
  { label: "Games", href: "#" },
  { label: "New & Popular", href: `${ROUTES.BROWSE}?sort=new` },
  { label: "My List", href: ROUTES.MY_LIST },
  { label: "Browse by Language", href: "#" },
];

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
  const [searchOpen, setSearchOpen] = useState(false);

  // Owned here rather than by the page, so the page can stay a Server Component.
  // Same external-store pattern as useMediaQuery — correct initial value on a
  // mid-page refresh, without a setState-in-effect cascade.
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 50,
    () => false
  );

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-black/95 backdrop-blur-sm"
          : "bg-linear-to-b from-black/80 to-transparent"
      )}
    >
      <div className="pageX py-4 flex items-center gap-4">
        {/* The wordmark doubles as the way back to the home page. */}
        <Link
          href={ROUTES.HOME}
          aria-label="LuminFlix home"
          className="focusRing shrink-0 rounded"
        >
          <Logo />
        </Link>

        {/*
          The nav column and the search toggle share one positioning context, so
          the field the toggle opens can stretch across exactly this span — the
          nav plus the icon it replaces — and nothing else. The logo to the left
          and the bell and profile to the right sit outside it and are never
          covered.
        */}
        <div className="relative flex min-w-0 flex-1 items-center gap-4">
          {/* Below `sm` the field covers this column outright, so the nav goes
              `invisible`: out of view and out of the tab order, while the box
              stays and the columns either side hold their place. */}
          <div
            className={cn(
              "min-w-0 flex-1",
              searchOpen && "invisible sm:visible"
            )}
          >
            <NavMenu items={NAV_ITEMS} />
          </div>

          {/* SearchBox reads `?q=` with useSearchParams, which needs a Suspense
              boundary so a statically-rendered route (/my-list) isn't forced
              into client-side rendering as a whole. */}
          <div className={ICON_SLOT}>
            <Suspense
              fallback={
                <span className="flexCenter h-full w-full">
                  <Search className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
              }
            >
              <SearchBox onOpenChange={setSearchOpen} />
            </Suspense>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {/* Same slot as the search toggle, so the two stay the same size at
              every width — which is all that changed here. */}
          <span className={cn(ICON_SLOT, "flexCenter")}>
            <Bell className="h-5 w-5 text-white cursor-pointer hover:text-gray-300 transition" />
          </span>

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
