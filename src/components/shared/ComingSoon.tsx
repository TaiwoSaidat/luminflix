import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

/**
 * On-brand placeholder for routes that exist but aren't built yet.
 *
 * These pages are deliberately data-free — they only guarantee that every link
 * in the app resolves instead of 404ing. Replace each one with a real Server
 * Component that fetches through `@/lib/api` as the routes get built out.
 */
const ComingSoon: React.FC<{ title: string; detail?: string }> = ({
  title,
  detail,
}) => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flexCenter px-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="large-40">{title}</h1>
          <p className="regular-16 text-gray-400 leading-relaxed">
            {detail ?? "This part of LuminFlix isn't built yet."}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComingSoon;
