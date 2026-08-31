import Link from "next/link";

import Logo from "@/components/shared/logo";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

/**
 * The public, signed-out face of `/`.
 *
 * Deliberately does not render <Header />: every nav item in the header now
 * points at a gated route, so the full nav would just be a wall of redirects.
 *
 * Deliberately makes no API calls either — this is the one page a signed-out
 * visitor sees, and it costs nothing to serve.
 */
export default function Landing() {
  return (
    <div className="bg-luminflix-black text-white min-h-screen flex flex-col">
      <section className="relative flex-1 flex flex-col">
        {/* Backdrop: layered gradients rather than an image, so the page has
            no network cost and no layout shift. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-radial from-luminflix-red/25 via-luminflix-black to-black"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-luminflix-black via-transparent to-black/70"
        />

        <div className="relative z-10 flex flex-col flex-1">
          <div className="px-4 md:px-12 py-6 flexBetween">
            <Logo />
            <Link href={ROUTES.LOGIN}>
              <Button
                size="sm"
                className="bg-luminflix-red text-black hover:bg-luminflix-red/90"
              >
                Sign In
              </Button>
            </Link>
          </div>

          <main className="flex-1 flexCenter flex-col text-center px-4 py-24 md:py-32">
            <h1 className="large-40 md:text-6xl md:leading-tight max-w-3xl">
              Unlimited films, series and more
            </h1>
            <p className="regular-20 text-gray-300 mt-6 max-w-xl">
              Watch anywhere. Cancel anytime.
            </p>
            <p className="regular-16 text-gray-400 mt-6 max-w-xl">
              Ready to watch? Sign in to start browsing.
            </p>

            <Link href={ROUTES.LOGIN} className="mt-8">
              <Button
                size="lg"
                className="bg-luminflix-red text-black hover:bg-luminflix-red/90"
              >
                Sign In
              </Button>
            </Link>

            <p className="small-14 text-gray-500 mt-6">
              LuminFlix is a demo project.{" "}
              <Link
                href={ROUTES.ABOUT}
                className="underline hover:text-white transition"
              >
                Learn more
              </Link>
            </p>
          </main>
        </div>
      </section>

      <Footer />
    </div>
  );
}
