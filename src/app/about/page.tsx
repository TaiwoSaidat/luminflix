import type { Metadata } from "next";
import Link from "next/link";

import Logo from "@/components/shared/logo";
import Footer from "@/components/layout/Footer";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — LuminFlix",
  description:
    "About LuminFlix, a Netflix-style streaming interface built with Next.js, and its TMDB attribution.",
};

/**
 * Public. Carries the TMDB attribution, which the API terms require be shown.
 */
export default function AboutPage() {
  return (
    <div className="bg-luminflix-black text-white min-h-screen flex flex-col">
      <div className="px-4 md:px-12 py-6">
        <Link href={ROUTES.HOME} aria-label="LuminFlix home">
          <Logo />
        </Link>
      </div>

      <main className="flex-1 px-4 md:px-12 pb-24 max-w-3xl">
        <h1 className="large-40 mb-8">About LuminFlix</h1>

        <div className="space-y-6 text-gray-300">
          <p className="regular-16 leading-relaxed">
            LuminFlix is a Netflix-style streaming interface built as a portfolio
            project with Next.js, React and Tailwind CSS. It is not a real
            streaming service — no video is hosted or served here, and no
            subscription exists.
          </p>

          <p className="regular-16 leading-relaxed">
            Accounts are demo accounts. There is no database behind the app, so
            there is no sign-up and no password reset; the credentials are
            printed on the{" "}
            <Link
              href={ROUTES.LOGIN}
              className="underline hover:text-white transition"
            >
              sign-in page
            </Link>
            .
          </p>

          <section className="pt-6 border-t border-zinc-800">
            <h2 className="large-24 text-white mb-4">Attribution</h2>
            <p className="regular-16 leading-relaxed">
              All film and television metadata and artwork on this site comes
              from{" "}
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition"
              >
                The Movie Database (TMDB)
              </a>
              .
            </p>
            <p className="regular-16 leading-relaxed mt-4 text-gray-400">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
