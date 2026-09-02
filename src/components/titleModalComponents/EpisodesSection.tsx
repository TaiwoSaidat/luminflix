"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * The Episodes block of the title detail modal.
 *
 * Deliberately empty: the season/episode endpoints aren't wired up yet, so
 * rather than inventing episode data this renders the real layout — season
 * picker, numbered rows with a still, a title, a runtime and a synopsis — as
 * skeletons. When `/tv/{id}/season/{n}` is added to `src/lib/api.ts`, the rows
 * fill in and the shape below stays as it is.
 */
const PLACEHOLDER_ROWS = [1, 2, 3, 4, 5];

const EpisodesSection: React.FC<{ title: string }> = ({ title }) => {
  return (
    <section aria-labelledby="episodes-heading" className="space-y-4">
      <div className="flexBetween gap-4">
        <h3 id="episodes-heading" className="large-24">
          Episodes
        </h3>

        <button
          type="button"
          disabled
          title="Season selection arrives with episode data"
          aria-label={`Select a season of ${title}`}
          className="flex items-center gap-3 rounded border border-white/40 px-4 py-2 regular-14 text-white/50 disabled:cursor-not-allowed"
        >
          Season 1
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <ul className="divide-y divide-white/10" aria-busy="true">
        {PLACEHOLDER_ROWS.map((row) => (
          <li key={row} className="flex items-center gap-4 py-4">
            <span className="w-6 shrink-0 text-center regular-20 text-zinc-500">
              {row}
            </span>
            <div className="h-16 w-28 shrink-0 animate-pulse rounded bg-zinc-800" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 animate-pulse rounded bg-zinc-800" />
              <div className="h-3 w-full animate-pulse rounded bg-zinc-800/70" />
              <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-800/70" />
            </div>
          </li>
        ))}
      </ul>

      <p className="small-12 text-zinc-500">
        Episode listings arrive with the player.
      </p>
    </section>
  );
};

export default EpisodesSection;
