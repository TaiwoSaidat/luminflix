import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ChipProps {
  href: string;
  children: React.ReactNode;
  /**
   * Marks the chip as the current filter. Also sets `aria-current`, so the
   * selection isn't communicated by colour alone.
   */
  active?: boolean;
  className?: string;
}

/**
 * A pill-shaped navigation link — genre filters on `/browse`, suggested queries
 * on `/search`.
 *
 * Always a link, never a button: every one of these changes the URL, which is
 * where filter and query state lives. That keeps both surfaces free of client
 * JS for filtering.
 */
const Chip: React.FC<ChipProps> = ({
  href,
  children,
  active = false,
  className,
}) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    className={cn(
      "focusRing block whitespace-nowrap rounded-full border px-4 py-2 small-14 transition",
      active
        ? "border-white bg-white font-semibold text-black"
        : "border-white/30 text-white hover:border-white hover:bg-white/10",
      className
    )}
  >
    {children}
  </Link>
);

export default Chip;
