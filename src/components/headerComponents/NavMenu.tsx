"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

import Button from "../ui/Button";

export interface NavItem {
  label: string;
  href: string;
}

/** Must match the `gap-2` on the visible row — the maths can't read it back. */
const PILL_GAP = 8;

/**
 * The first measurement has to land before the browser paints, or a narrow
 * viewport shows all seven items spilling across the header for a frame. On the
 * server there is nothing to measure and `useLayoutEffect` would warn, so the
 * effect degrades to the passive one there.
 */
const useMeasureEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

interface NavMenuViewProps {
  items: NavItem[];
  /** The item standing for the page on screen, if any. */
  activeHref?: string;
}

/**
 * The header's primary navigation.
 *
 * Breakpoints can't answer "does this fit": the label set is translated-length
 * dependent and the space left over depends on the logo, the icon strip and the
 * viewport all at once. So the widths are measured instead. An invisible copy of
 * every pill is laid out off to the side, its children are measured once, and a
 * ResizeObserver recomputes how many fit whenever the row changes size.
 * Whatever doesn't fit moves into the overflow menu.
 *
 * Measuring a copy rather than the row itself is what makes this stable: the
 * copy never changes, so `available` and the widths are the same on every pass
 * and the count can't oscillate between two states that each invalidate the
 * other.
 */
export function NavMenuView({ items, activeHref }: NavMenuViewProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(items.length);
  const [open, setOpen] = useState(false);

  const recompute = useCallback(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;

    const children = Array.from(measure.children) as HTMLElement[];
    // The measuring copy renders every item plus the overflow trigger last.
    const widths = children.slice(0, items.length).map((el) => el.offsetWidth);
    const moreWidth = children[children.length - 1]?.offsetWidth ?? 0;
    const available = row.clientWidth;

    // Widths are zero while fonts load or the header is display:none — leave the
    // current count alone rather than collapsing everything into the menu.
    if (available === 0 || widths.some((width) => width === 0)) return;

    let used = 0;
    let count = 0;
    for (let i = 0; i < widths.length; i++) {
      const next = used + (i === 0 ? 0 : PILL_GAP) + widths[i];
      if (next > available) break;
      used = next;
      count++;
    }

    // Anything hidden needs a trigger to reach it, and the trigger needs room of
    // its own — so give items back until it fits.
    if (count < widths.length) {
      while (count > 0 && used + PILL_GAP + moreWidth > available) {
        count--;
        used -= widths[count] + (count > 0 ? PILL_GAP : 0);
      }
    }

    setVisibleCount(count);
  }, [items.length]);

  useMeasureEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(row);
    // Re-measure once webfonts settle, since label widths shift when they do.
    document.fonts?.ready.then(recompute).catch(() => {});

    return () => observer.disconnect();
  }, [recompute]);

  // An open menu that can't be dismissed is a trap on touch, where there is no
  // Escape key and nothing else to click.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rowRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // When nothing fits, the menu holds the whole nav rather than an overflow of
  // it — which is the header's original "Browse" dropdown, under its old name.
  const overflow = items.slice(visibleCount);
  const label = visibleCount === 0 ? "Browse" : "More";
  const holdsActive = overflow.some((item) => item.href === activeHref);

  const pill = (item: NavItem) => (
    <Button
      key={item.label}
      href={item.href}
      variant="nav"
      size="xs"
      shape="pill"
      active={item.href === activeHref}
      aria-current={item.href === activeHref ? "page" : undefined}
    >
      {item.label}
    </Button>
  );

  return (
    <div ref={rowRef} className="relative min-w-0 flex-1">
      {/*
        The measuring copy. `invisible` keeps it out of the tab order and the
        accessibility tree while still giving it a real layout to measure, which
        is the whole point — `hidden` would report zero.
      */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 flex gap-2 whitespace-nowrap"
      >
        {items.map((item) => (
          <Button key={item.label} variant="nav" size="xs" shape="pill">
            {item.label}
          </Button>
        ))}
        <Button
          variant="nav"
          size="xs"
          shape="pill"
          icon={<ChevronDown className="h-4 w-4" />}
          iconPosition="right"
        >
          {/* Measured against the longer of the two labels this can carry. */}
          Browse
        </Button>
      </div>

      {/* No `overflow-hidden` here: it would clip the dropdown this row opens.
          Wrapping is already impossible — a flex row doesn't wrap unless told
          to — and the measurement below runs before paint, so the row is never
          seen overflowing. */}
      <div className="flex items-center justify-center gap-2 whitespace-nowrap">
        {items.slice(0, visibleCount).map(pill)}

        {/* Absent entirely when every item is on the bar — there is nothing
            behind it to reach. */}
        {overflow.length > 0 && (
          <div className="relative">
            <Button
              variant="nav"
              size="xs"
              shape="pill"
              // Open, or collapsed over the current page — either way this pill
              // is the one standing in for what the user is looking at.
              active={open || holdsActive}
              onClick={() => setOpen((wasOpen) => !wasOpen)}
              aria-expanded={open}
              aria-haspopup
              iconPosition="right"
              icon={
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                />
              }
            >
              {label}
            </Button>

            {/* The header's original dropdown panel, unchanged and now shared:
                it is what "Browse" drops at phone widths and what "More" drops
                everywhere else. */}
            {open && (
              <div className="absolute top-10 left-0 z-30 w-56 bg-black border border-b-black border-x-black flex flex-col py-2 shadow-xl">
                {overflow.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={item.href === activeHref ? "page" : undefined}
                    className="px-4 py-3 text-sm text-gray-200 hover:bg-zinc-800 transition text-center"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Resolves which item is current. Three of the nav items point at `/browse` and
 * differ only by query string, so the pathname alone can't tell them apart.
 */
function ActiveNavMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.toString();
  const current = query ? `${pathname}?${query}` : pathname;

  return <NavMenuView items={items} activeHref={current} />;
}

/**
 * `useSearchParams` opts a route into client rendering unless it sits behind a
 * Suspense boundary, and the header renders on statically-rendered routes too.
 * The fallback is the same nav without its selected state, so the boundary costs
 * a highlight for one frame rather than the navigation itself.
 */
const NavMenu: React.FC<{ items: NavItem[] }> = ({ items }) => (
  <Suspense fallback={<NavMenuView items={items} />}>
    <ActiveNavMenu items={items} />
  </Suspense>
);

export default NavMenu;
