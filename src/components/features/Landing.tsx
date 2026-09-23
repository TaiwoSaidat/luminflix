import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Logo from "@/components/shared/logo";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import TopTenRow from "@/components/features/TopTenRow";
import ReasonsToJoin from "@/components/features/ReasonsToJoin";
import FaqAccordion from "@/components/features/FaqAccordion";
import { getTrending } from "@/lib/api";
import { ROUTES } from "@/lib/constants";

/**
 * The public, signed-out face of `/`.
 *
 * Deliberately does not render <Header />: every nav item in the header points
 * at a gated route, so the full nav would just be a wall of redirects.
 *
 * The hero artwork is a static collage in /public rather than live backdrops,
 * but the Top 10 row below it is real catalog data — showing a stranger what
 * is actually on the service is the job of this page. `getTrending()` is
 * ISR-cached for an hour and fetches no logos, so the whole row costs three
 * upstream requests shared across every signed-out visitor.
 *
 * The cards link into `/watch/*`, which the proxy gates: a signed-out click
 * lands on /login with a callbackUrl and returns here afterwards.
 */
export default async function Landing() {
  const trending = await getTrending();

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <section className="relative flex flex-col min-h-[38rem] flex-1">
        {/*
          Decorative, so the alt is empty and the node is hidden from assistive
          tech: it is a wall of unrelated cover art that names nothing a screen
          reader user needs. The headline below carries the page's meaning.
        */}
        <Image
          src="/landing-collage.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Two passes: a flat wash to hold contrast over the busiest part of
            the collage, then a vignette that lands the copy in the dark middle
            and fades the whole thing into the footer. */}
        <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/60 to-black"
        />

        {/* The divider capping the collage: a straight rule with a short glow.
            Anchored inside the hero rather than placed between sections, so it
            can't push the next section's heading around the way a negative
            margin did. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 border-t-2 border-luminflix-red shadow-[0_0_18px_rgba(229,9,20,0.5)]"
        />

        <div className="relative z-10 flex flex-1 flex-col">
          <div className="pageX py-6 flexBetween">
            <Link href={ROUTES.HOME} aria-label="LuminFlix home">
              <Logo />
            </Link>

            <Button href={ROUTES.LOGIN} variant="brand" size="sm">
              Sign In
            </Button>
          </div>

          <main className="flex-1 flexCenter flex-col px-4 py-20 text-center md:py-28">
            <h1 className="large-40 md:text-6xl md:leading-tight max-w-3xl drop-shadow-lg">
              So much to watch, matched to you
            </h1>

            <p className="regular-28 mt-6 max-w-xl text-gray-200">
              Unlimited films and series. No card, no sign-up — it&rsquo;s a
              demo.
            </p>

            <p className="regular-16 mt-6 max-w-xl text-gray-300">
              Ready to watch? Enter your email and we&rsquo;ll take you to the
              sign-in page.
            </p>

            {/*
              A plain GET form, so this stays a Server Component and works with
              no JavaScript: it navigates to /login?email=…, which prefills the
              sign-in field. There is no sign-up to submit to — the demo has no
              database — so the field hands off rather than pretending to
              register anyone.
            */}
            <form
              action={ROUTES.LOGIN}
              method="get"
              className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            >
              <label htmlFor="landing-email" className="sr-only">
                Email address
              </label>
              <input
                id="landing-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                className="h-full md:h-14 w-full min-w-0 flex-1 rounded border border-white/40 bg-black/60 px-4 regular-16 text-white placeholder:text-gray-400 focus:border-white focus:outline-none"
              />

              <Button
                type="submit"
                variant="brand"
                size="lg"
                icon={<ChevronRight className="h-5 w-5" />}
                iconPosition="right"
                className="h-14 shrink-0"
              >
                Get Started
              </Button>
            </form>

            <p className="small-14 mt-8 text-gray-400">
              LuminFlix is a demo project.{" "}
              <Link
                href={ROUTES.ABOUT}
                className="underline transition hover:text-white"
              >
                Learn more
              </Link>
            </p>
          </main>
        </div>
      </section>

      {/* Clears the hero rather than tucking under it: the collage runs to the
          edge of its own section, so any negative margin here puts the heading
          on top of the artwork instead of on the black below it. */}
      {trending.length > 0 && (
        <section className="relative z-10 bg-black pt-12 md:pt-16">
          <TopTenRow title="Trending Now" items={trending} />
        </section>
      )}

      <div className="relative z-10 bg-black py-12 md:py-16">
        <ReasonsToJoin />
      </div>

      <div className="relative z-10 bg-black pb-16 md:pb-20">
        <FaqAccordion />
      </div>

      <Footer />
    </div>
  );
}
