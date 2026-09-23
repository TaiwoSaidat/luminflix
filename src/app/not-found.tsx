import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import Logo from "@/components/shared/logo";
import Footer from "@/components/layout/Footer";
import ErrorState from "@/components/shared/ErrorState";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Not found — LuminFlix",
};

/**
 * Shown for any unmatched URL and for every `notFound()` call — today that means
 * `/watch/{anything but movie or tv}/…` and a title id the provider doesn't
 * recognise. Before this existed, those rendered Next's unstyled default.
 *
 * A bare logo link rather than `Header`, and deliberately so: `Header` calls
 * `auth()`, and because the not-found boundary has to be renderable for any
 * route, a session read here forces every otherwise-static route (`/about`) to
 * be server-rendered per request. The two actions below cover navigation, so the
 * session-aware header isn't worth that cost. Same treatment `/about` uses.
 */
export default function NotFound() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <div className="pageX py-6">
        <Link href={ROUTES.HOME} aria-label="LuminFlix home">
          <Logo />
        </Link>
      </div>

      <main className="flex-1 flexCenter pageX pb-16">
        <ErrorState
          title="We can't find that page"
          detail="The link may be broken, or the title may no longer be in the catalog. Try searching for it, or head back to the home page."
        >
          <Button href={ROUTES.HOME}>Go home</Button>
          <Button variant="ghost" href={ROUTES.SEARCH}>
            Search
          </Button>
        </ErrorState>
      </main>

      <Footer />
    </div>
  );
}
