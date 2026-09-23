import React from "react";
import { ArrowDownToLine, Send, Smile, Tv } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Reason {
  icon: LucideIcon;
  title: string;
  body: string;
}

/**
 * Written against what this demo actually does. The layout is Netflix's, but
 * the claims are not: there is no download feature, no TV app and no kids
 * mode here, and a marketing card is still a promise to the person reading it.
 */
const REASONS: Reason[] = [
  {
    icon: Tv,
    title: "Enjoy on your TV",
    body: "The layout adapts from a phone up to a television, so the same page works wherever the browser is.",
  },
  {
    icon: ArrowDownToLine,
    title: "Only what you asked for",
    body: "Artwork and detail load as you reach them, so a row costs a handful of requests rather than a hundred.",
  },
  {
    icon: Send,
    title: "Watch everywhere",
    body: "Stream films and series on your phone, tablet, laptop and TV — every page is a shareable link.",
  },
  {
    icon: Smile,
    title: "Profiles for everyone",
    body: "Switch between profiles from the header, and each one keeps its own place in the catalogue.",
  },
];

/**
 * The "More Reasons to Join" strip on the signed-out page.
 *
 * Static content, so it is a Server Component and ships no JavaScript. The
 * cards are a plain grid rather than a scroller: there are only four, and they
 * reflow to one column on a phone instead of hiding three off-screen.
 */
const ReasonsToJoin: React.FC = () => (
  <section className="pageX space-y-6">
    <h2 className="large-24 md:large-30">More Reasons to Join</h2>

    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {REASONS.map(({ icon: Icon, title, body }) => (
        <li
          key={title}
          className="flex min-h-72 flex-col rounded-2xl border border-white/10 bg-[linear-gradient(149deg,#192247_0%,#210e17_100%)] p-6"
        >
          <h3 className="regular-22 font-bold">{title}</h3>
          <p className="small-16 mt-4 leading-relaxed text-zinc-300">{body}</p>

          {/* Pushed to the bottom-right corner, and decorative — the heading
              beside it already names the point the icon is illustrating. */}
          <span className="mt-auto self-end flexCenter h-14 w-14 rounded-full bg-linear-to-br from-luminflix-red to-purple-600">
            <Icon className="h-7 w-7 text-white" aria-hidden="true" />
          </span>
        </li>
      ))}
    </ul>
  </section>
);

export default ReasonsToJoin;
