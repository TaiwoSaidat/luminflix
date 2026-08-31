import React from "react";
import Link from "next/link";

import { ROUTES } from "@/lib/constants";

const Footer: React.FC = () => {
  return (
    <footer className="px-4 md:px-12 py-12 bg-black/50 mt-24">
      <div className="max-w-6xl space-y-8">
        <div className="flex flex-wrap gap-6 text-gray-400">
          <Link href={ROUTES.ABOUT} className="hover:underline">
            About
          </Link>
          <a href="#" className="hover:underline">
            Audio and Subtitles
          </a>
          <a href="#" className="hover:underline">
            Media Center
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Contact Us
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
          <div className="space-y-2">
            <a href="#" className="block hover:underline">
              FAQ
            </a>
            <a href="#" className="block hover:underline">
              Investor Relations
            </a>
            <a href="#" className="block hover:underline">
              Ways to Watch
            </a>
          </div>
          <div className="space-y-2">
            <a href="#" className="block hover:underline">
              Help Center
            </a>
            <a href="#" className="block hover:underline">
              Jobs
            </a>
            <a href="#" className="block hover:underline">
              Terms of Use
            </a>
          </div>
          <div className="space-y-2">
            <a href="#" className="block hover:underline">
              Account
            </a>
            <a href="#" className="block hover:underline">
              Redeem Gift Cards
            </a>
            <a href="#" className="block hover:underline">
              Cookie Preferences
            </a>
          </div>
          <div className="space-y-2">
            <a href="#" className="block hover:underline">
              Media Center
            </a>
            <a href="#" className="block hover:underline">
              Buy Gift Cards
            </a>
            <a href="#" className="block hover:underline">
              Legal Notices
            </a>
          </div>
        </div>

        <p className="text-gray-500 text-sm">
          © 2024 LuminFlix, Inc. ·{" "}
          {/* The full TMDB attribution lives on /about; this is the link to it. */}
          <Link href={ROUTES.ABOUT} className="hover:underline">
            Powered by TMDB
          </Link>
        </p>
      </div>
    </footer>
  );
};
export default Footer;
