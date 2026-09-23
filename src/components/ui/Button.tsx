import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";


interface ButtonProps {
  children: React.ReactNode;
  /**
   * "nav" is the header pill — transparent at rest, filled on hover/active.
   * "brand" is the red call-to-action used on the landing and sign-in pages.
   */
  variant?: "primary" | "secondary" | "ghost" | "nav" | "brand";
  size?: "xs" | "sm" | "md" | "lg";
  /** "pill" is the fully-rounded hero treatment; everything else stays square. */
  shape?: "default" | "pill";
  /**
   * Selected state for `variant="nav"` — the current route, or an open menu.
   *
   * It swaps the variant's background rather than layering a second one on top:
   * `cn` wraps clsx with no class merging, so two competing `bg-*` utilities in
   * one list would resolve by Tailwind's emit order, not by which was passed.
   */
  active?: boolean;
  onClick?: () => void;
  /** Renders a next/link with the same styling — same pattern as IconButton. */
  href?: string;
  className?: string;
  icon?: React.ReactNode;
  /** A trailing chevron reads as "this opens"; a leading one reads as a glyph. */
  iconPosition?: "left" | "right";
  // Defaults to "button" so existing call sites keep behaving as they do today;
  // the login form opts into "submit" explicitly.
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
  /** Marks the nav pill standing for the page currently on screen. */
  "aria-current"?: "page";
  /** Both set by the header's overflow menu trigger. */
  "aria-expanded"?: boolean;
  "aria-haspopup"?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  shape = "default",
  active = false,
  onClick,
  href,
  className,
  icon,
  iconPosition = "left",
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
  "aria-expanded": ariaExpanded,
  "aria-haspopup": ariaHasPopup,
}) => {
  // Weight lives on the variant, not here: the nav pill keeps the header's
  // original regular-weight labels, while every other variant stays semibold.
  const baseStyles =
    "focusRing transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-60 disabled:cursor-not-allowed";

  const shapes = {
    default: "rounded",
    pill: "rounded-full",
  };

  const variants = {
    primary: "font-semibold bg-white text-black hover:bg-white/90",
    secondary: "font-semibold bg-gray-500/70 text-white hover:bg-gray-500/50",
    ghost:
      "font-semibold bg-transparent text-white hover:bg-white/10 border border-white/30",
    nav: active
      ? "bg-white/25 text-white"
      : "bg-transparent text-gray-200 hover:bg-white/10 hover:text-white",
    brand:
      "font-semibold bg-luminflix-red text-white hover:bg-luminflix-red/90",
  };

  const sizes = {
    xs: "px-3 py-1.5 text-sm",
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    shapes[shape],
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-current={ariaCurrent}
        className={classes}
      >
        {iconPosition === "left" && icon}
        {children}
        {iconPosition === "right" && icon}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      className={classes}
    >
      {iconPosition === "left" && icon}
      {children}
      {iconPosition === "right" && icon}
    </button>
  );
};

export default Button;
