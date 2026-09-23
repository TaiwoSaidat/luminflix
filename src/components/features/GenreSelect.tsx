import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface GenreOption {
  id: number;
  name: string;
}

interface GenreSelectProps {
  options: GenreOption[];
  /** Undefined means "All" — no genre filter applied. */
  activeId?: number;
  /** Builds the destination for one option. Ownership stays with the parent. */
  hrefFor: (genreId?: number) => string;
}

/**
 * The genre filter on `/browse`, as a dropdown pill.
 *
 * Built on <details>/<summary> rather than a state hook, which is what keeps
 * `/browse` free of client JS the way CLAUDE.md describes: the disclosure is a
 * native element, so the open state, the keyboard handling and the screen
 * reader semantics all come for free, and every option underneath is still an
 * ordinary Link that rewrites the search params.
 *
 * The trade-off is that clicking elsewhere on the page doesn't dismiss it —
 * native disclosure has no light-dismiss. Choosing an option navigates, which
 * unmounts the whole thing, so the open state never outlives the page it was
 * opened on.
 */
const GenreSelect: React.FC<GenreSelectProps> = ({
  options,
  activeId,
  hrefFor,
}) => {
  const activeName = options.find((option) => option.id === activeId)?.name;

  return (
    <details className="group relative w-24">
      <summary
        // `list-none` plus the WebKit pseudo-element: between them they remove
        // the default disclosure triangle in every engine.
        className={cn(
          "focusRing flexBetween cursor-pointer list-none gap-2 rounded-full border px-3 py-1.5 small-14 transition [&::-webkit-details-marker]:hidden",
          activeName
            ? "border-white bg-white font-semibold text-black"
            : "border-white/30 text-white hover:border-white hover:bg-white/10"
        )}
      >
        <span className="truncate">{activeName ?? "Genres"}</span>
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
        />
      </summary>

      {/* Capped and scrollable: there are around nineteen genres, which is
          taller than a phone viewport if the list is allowed to run. */}
      <ul
        aria-label="Genres"
        // `no-scrollbar` hides the track, not the overflow — the list still
        // scrolls, it just doesn't put a chrome scrollbar over the names.
        className="no-scrollbar absolute left-0 top-full z-30 mt-2 max-h-80 w-44 overflow-y-auto rounded-xl border border-white/15 bg-black/95 p-2 shadow-xl"
      >
        <li>
          <Link
            href={hrefFor()}
            aria-current={!activeId ? "page" : undefined}
            className={cn(
              "focusRing block rounded-lg px-3 py-2 small-14 transition",
              !activeId
                ? "bg-white/20 font-semibold text-white"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
            )}
          >
            All
          </Link>
        </li>

        {options.map((option) => (
          <li key={option.id}>
            <Link
              href={hrefFor(option.id)}
              aria-current={activeId === option.id ? "page" : undefined}
              className={cn(
                "focusRing block rounded-lg px-3 py-2 small-14 transition",
                activeId === option.id
                  ? "bg-white/20 font-semibold text-white"
                  : "text-gray-200 hover:bg-white/10 hover:text-white"
              )}
            >
              {option.name}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
};

export default GenreSelect;
