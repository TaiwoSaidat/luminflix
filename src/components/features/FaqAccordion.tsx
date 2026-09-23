"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface Faq {
  question: string;
  /** One entry per paragraph — the longer answers need the break. */
  answer: string[];
}

/**
 * Written to be true of this project rather than adapted from Netflix's copy.
 * A landing page is the first thing a stranger reads, and answering "can I
 * actually watch something" with anything other than the truth wastes their
 * time.
 */
const FAQS: Faq[] = [
  {
    question: "What is LuminFlix?",
    answer: [
      "LuminFlix is a streaming interface built as a portfolio project — the browsing experience of a service like Netflix, built with Next.js, React and Tailwind.",
      "Everything you see is driven by a real film and television catalogue, so the artwork, synopses, cast and ratings all belong to genuine titles rather than placeholder data.",
    ],
  },
  {
    question: "Do I need an account?",
    answer: [
      "You need to sign in, but you don't need to create anything. LuminFlix keeps no database of its own accounts, so there is no sign-up and no password reset — the two demo users are part of the code.",
      "Their details are printed directly on the sign-in page. Use either one.",
    ],
  },
  {
    question: "Where do the films and series come from?",
    answer: [
      "The catalogue is supplied by TMDB, a community-maintained film and television database. Titles, artwork, genres, cast and ratings are all fetched from it.",
      "LuminFlix is not endorsed or certified by TMDB.",
    ],
  },
  {
    question: "Can I actually play something?",
    answer: [
      "Not yet. The player is the last piece still being built, and no real video is licensed for this project — when it lands it will play a public-domain sample clip rather than the title you picked.",
      "Everything up to that point is real: browsing, searching, filtering by genre and the title detail view all work.",
    ],
  },
  {
    question: "Does LuminFlix store any of my data?",
    answer: [
      "Almost none. The films and series are read from TMDB's database through its API, but LuminFlix keeps no store of its own about you — no accounts table, no watch history, no analytics.",
      "Your session is a signed cookie and the profile you pick is a second cookie, both held in your browser. Anything that would need to follow you between devices is deliberately left out rather than faked.",
    ],
  },
];

/**
 * The FAQ on the signed-out page.
 *
 * One open panel at a time: opening a second closes the first, so the list
 * never becomes a wall of text you have to scroll past to reach question five.
 *
 * Built as a disclosure pattern rather than hidden checkboxes — each heading is
 * a real button carrying `aria-expanded`, and the panel it controls stays in
 * the DOM so `aria-controls` points at something that exists.
 */
const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="pageX space-y-6">
      <h2 className="large-24 md:large-30">Frequently Asked Questions</h2>

      <ul className="mx-auto max-w-4xl space-y-2">
        {FAQS.map((faq, index) => {
          const isOpen = index === openIndex;
          const buttonId = `faq-trigger-${index}`;
          const panelId = `faq-panel-${index}`;

          return (
            <li key={faq.question}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="focusRing flexBetween w-full gap-4 bg-zinc-800 px-6 py-5 text-left transition hover:bg-zinc-700"
                >
                  <span className="regular-22">{faq.question}</span>

                  {/* Decorative: `aria-expanded` on the button already conveys
                      the state, so announcing the glyph would say it twice. */}
                  {isOpen ? (
                    <X className="h-7 w-7 shrink-0" aria-hidden="true" />
                  ) : (
                    <Plus className="h-7 w-7 shrink-0" aria-hidden="true" />
                  )}
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className="mt-px space-y-4 bg-zinc-800 px-6 py-6"
              >
                {faq.answer.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="small-16 leading-relaxed text-zinc-200"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default FaqAccordion;
