"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/** How far one chevron press travels. Roughly two cards at desktop widths. */
const SCROLL_STEP = 600;

/**
 * How close to the end still counts as "the end". Scroll positions are
 * fractional once a row has been dragged, so an exact comparison would leave
 * the right chevron showing with nothing left to reveal.
 */
const EDGE_TOLERANCE = 10;

interface ScrollRowProps {
  title: string;
  children: React.ReactNode;
}

/**
 * A titled horizontal strip with scroll chevrons.
 *
 * Extracted from `ContentRow` so the Top 10 row can reuse the scrolling
 * without inheriting `VideoCard` along with it: the chevron state, the scroll
 * listener and the resize handling are the fiddly part, and they are identical
 * whatever the cards turn out to be. The cards come in as children, so this
 * stays the only client component in the chain.
 */
const ScrollRow: React.FC<ScrollRowProps> = ({ title, children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - EDGE_TOLERANCE);
  }, []);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });

    // Both affordances are derived from `clientWidth`, so a viewport change
    // can leave a chevron claiming there is more to scroll when there isn't.
    // The old scroll-only listener never caught that.
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  return (
    <div className="space-y-4 px-4 md:px-12 relative group/row">
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>

      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            aria-label={`Scroll ${title} left`}
            // `focus-within` as well as hover: the chevrons are the only way to
            // reach the far end of the row, and a keyboard user tabbing into it
            // would otherwise never see that they exist.
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-black/80 flex items-center justify-center opacity-0 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-scroll no-scrollbar scroll-smooth"
        >
          {children}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            aria-label={`Scroll ${title} right`}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-black/80 flex items-center justify-center opacity-0 transition-opacity group-hover/row:opacity-100 group-focus-within/row:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ScrollRow;
