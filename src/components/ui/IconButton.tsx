import React from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "overlay";
type Size = "sm" | "md" | "lg" | "xl";

const VARIANTS: Record<Variant, string> = {
  /** The Play control — white disc, dark glyph. */
  solid: "bg-white text-black hover:bg-white/80",
  /** The default: a ring on top of artwork. */
  outline:
    "border-white/40 text-white hover:border-white hover:bg-white/10 disabled:border-white/40 disabled:text-white/50 disabled:hover:bg-transparent",
  /** Sits directly on an image, where a border would compete with the art. */
  overlay: "bg-black/70 text-white hover:bg-black",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
  xl: "h-12 w-12",
};

const ICON_SIZES: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-5 w-5",
};

/** A heavier ring reads better at the larger sizes; thinner would look frail. */
const BORDER_WIDTHS: Record<Size, string> = {
  sm: "border",
  md: "border",
  lg: "border-2",
  xl: "border-2",
};

interface IconButtonProps {
  /** The lucide component itself, not an element — sizing is applied here. */
  icon: LucideIcon;
  /**
   * Accessible name. Required: every one of these is icon-only, so without it
   * the control is unlabelled.
   */
  label: string;
  variant?: Variant;
  size?: Size;
  /** Renders a next/link instead of a button. */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Hover text — used to explain why a control is disabled. */
  title?: string;
  /**
   * Renders a non-interactive span. For decoration, and for the cases nested
   * inside a link, where a real button would be invalid markup.
   */
  decorative?: boolean;
  /** e.g. `fill-current` on a play triangle. */
  iconClassName?: string;
  className?: string;
  /** React 19 passes `ref` as an ordinary prop — the modal focuses its close button. */
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * The circular icon control used across the preview card, the detail modal and
 * the recommendation grid — play, add to list, rate, mute, close, expand.
 *
 * Several of these are deliberately `disabled`: My List, ratings and preview
 * audio have nothing behind them yet, and a control that looks live but does
 * nothing is worse than one that is visibly inert. When those land, this is
 * the one place their styling is defined.
 */
const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  variant = "outline",
  size = "md",
  href,
  onClick,
  disabled = false,
  title,
  decorative = false,
  iconClassName,
  className,
  ref,
}) => {
  const classes = cn(
    "flexCenter shrink-0 rounded-full transition",
    VARIANTS[variant],
    SIZES[size],
    variant === "outline" && BORDER_WIDTHS[size],
    !decorative &&
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
    disabled && "cursor-not-allowed",
    className
  );

  const glyph = <Icon className={cn(ICON_SIZES[size], iconClassName)} />;

  if (decorative) {
    return (
      <span aria-hidden="true" title={title} className={classes}>
        {glyph}
      </span>
    );
  }

  if (href) {
    return (
      <Link href={href} aria-label={label} title={title} className={classes}>
        {glyph}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title}
      className={classes}
    >
      {glyph}
    </button>
  );
};

export default IconButton;
