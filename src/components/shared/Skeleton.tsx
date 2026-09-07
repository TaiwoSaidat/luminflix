import React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "onSurface";

/**
 * Skeletons sit on two different grounds: the page/modal body (zinc-900) and
 * the raised cards inside "More Like This" (zinc-800). One tone can't read
 * correctly on both, so it's a prop rather than a `className` override — `cn`
 * wraps `clsx` only, so two competing `bg-*` classes wouldn't dedupe.
 */
const TONES: Record<Tone, string> = {
  default: "bg-zinc-800",
  onSurface: "bg-zinc-700/60",
};

/** Same reasoning as `tone`: a passed-in radius would collide with the base one. */
const RADII = {
  default: "rounded",
  none: "rounded-none",
};

interface SkeletonProps {
  /** Size and position — `h-3 w-1/2`, `absolute inset-0`, and so on. */
  className?: string;
  tone?: Tone;
  radius?: keyof typeof RADII;
}

/**
 * One pulsing placeholder bar. Always decorative: it carries no text, so it is
 * hidden from assistive tech and the surrounding container owns `aria-busy`.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  tone = "default",
  radius = "default",
}) => (
  <div
    aria-hidden="true"
    className={cn("animate-pulse", TONES[tone], RADII[radius], className)}
  />
);

/** Staggered widths, so a run of lines reads as a paragraph rather than as bars. */
const LINE_WIDTHS = ["w-full", "w-4/5", "w-2/3"];

interface SkeletonTextProps {
  lines?: number;
  tone?: Tone;
  className?: string;
}

/** A block of body copy waiting to load — a synopsis, a cast list. */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 2,
  tone = "default",
  className,
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }, (_, index) => (
      <Skeleton
        key={index}
        tone={tone}
        className={cn("h-3", LINE_WIDTHS[index % LINE_WIDTHS.length])}
      />
    ))}
  </div>
);

export default Skeleton;
