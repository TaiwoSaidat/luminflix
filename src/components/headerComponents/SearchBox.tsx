"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { debounce } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

/** Long enough that a typed word doesn't fire a request per keystroke. */
const TYPING_DELAY = 400;

function searchHref(query: string): string {
  const trimmed = query.trim();
  return trimmed
    ? `${ROUTES.SEARCH}?q=${encodeURIComponent(trimmed)}`
    : ROUTES.SEARCH;
}

/**
 * The header's search field.
 *
 * The query lives in the URL, never in component state — per CLAUDE.md's state
 * rules, that keeps a search shareable and lets the results page fetch straight
 * from `searchParams` as a Server Component. The local `value` here is only the
 * uncommitted keystrokes; `?q=` is the source of truth.
 *
 * The first keystroke `push`es (so Back returns to wherever the user came from)
 * and every later one `replace`s (so a five-letter word doesn't leave five
 * entries in history).
 */
const SearchBox: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(activeQuery);
  // Landing on /search?q=… should show the field already open and filled.
  const [open, setOpen] = useState(activeQuery.length > 0);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  /** Set only when the user closes the field, so focus isn't stolen on mount. */
  const focusToggle = useRef(false);

  // Keeps the field in step with the URL when it changes from outside — a Back
  // navigation, or one of the suggestion links on the empty results page.
  useEffect(() => setValue(activeQuery), [activeQuery]);

  // Opening the field commits the user to one of two destinations: the results
  // page, or home when they close it again. Neither is a <Link>, so nothing
  // would be prefetched otherwise — and `/` is dynamic and expensive to render,
  // which is what made closing the field feel slow.
  useEffect(() => {
    if (!open) return;
    router.prefetch(ROUTES.HOME);
    router.prefetch(ROUTES.SEARCH);
  }, [open, router]);

  /**
   * The debounced callback has to be created once, or every keystroke would
   * build a new timer and none would ever be cancelled. It therefore can't
   * close over `pathname`/`value` directly — a ref carries the current
   * navigation behaviour into the stable callback.
   */
  const navigateRef = useRef<(query: string) => void>(() => {});

  useEffect(() => {
    navigateRef.current = (query: string) => {
      const href = searchHref(query);
      if (pathname === ROUTES.SEARCH) {
        router.replace(href);
      } else {
        router.push(href);
      }
    };
  }, [pathname, router]);

  const navigateDebounced = useMemo(
    () => debounce((query: string) => navigateRef.current(query), TYPING_DELAY),
    []
  );

  const onChange = (next: string) => {
    setValue(next);
    navigateDebounced(next);
  };

  // Closing unmounts the X that was clicked, which would otherwise drop focus
  // to <body> and leave a keyboard user tabbing in from the top of the page.
  useEffect(() => {
    if (open || !focusToggle.current) return;
    focusToggle.current = false;
    toggleRef.current?.focus();
  }, [open]);

  const close = () => {
    // A keystroke from the last few hundred milliseconds is still queued; left
    // alone it would navigate back to ?q=… and re-open the field it just shut.
    navigateDebounced.cancel();
    focusToggle.current = true;
    setOpen(false);
    setValue("");
    // Closing the field means leaving search, so the results page goes back to
    // home rather than sitting on its own empty state. `push`, not `replace`,
    // so Back still returns to the results the user was looking at. On any
    // other route there is nothing to leave — the field just shuts.
    if (pathname === ROUTES.SEARCH) router.push(ROUTES.HOME);
  };

  if (!open) {
    return (
      <button
        ref={toggleRef}
        type="button"
        onClick={() => {
          setOpen(true);
          // The field mounts on the next paint, so focus waits for it.
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        aria-label="Open search"
        aria-expanded={false}
        className="focusRing rounded-full p-1 text-white transition hover:text-gray-300"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        // Enter commits immediately rather than waiting out the debounce — and
        // drops the queued call, so the same query isn't navigated to twice.
        navigateDebounced.cancel();
        navigateRef.current(value);
        inputRef.current?.blur();
      }}
      /* Mobile-first: the field is too wide to sit beside the logo and nav on a
         phone, so it covers the header row instead. From `sm` up there is room
         for it inline, and it returns to the icon strip. */
      className="absolute inset-x-4 z-10 flex items-center gap-2 rounded-full border border-white bg-black/95 px-4 py-1.5 sm:static sm:inset-auto sm:bg-black/80"
    >
      {/* A real submit control, not decoration: tapping the magnifier is the
          obvious way to run a search, and on a phone it saves reaching for the
          keyboard's own Search key. */}
      <button
        type="submit"
        aria-label={value.trim() ? `Search for ${value.trim()}` : "Search"}
        className="focusRing shrink-0 rounded-full text-gray-400 transition hover:text-white"
      >
        <Search className="h-4 w-4" />
      </button>

      <input
        ref={inputRef}
        type="search"
        name="q"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Titles, people, genres"
        aria-label="Search titles, people and genres"
        autoComplete="off"
        className="no-searchCancel w-full min-w-0 bg-transparent small-14 text-white outline-none sm:w-48 md:w-64"
      />

      <button
        type="button"
        onClick={close}
        aria-label="Close search"
        className="focusRing shrink-0 rounded-full text-gray-400 transition hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </form>
  );
};

export default SearchBox;
