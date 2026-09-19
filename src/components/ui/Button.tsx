import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";


interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  /** "pill" is the fully-rounded hero treatment; everything else stays square. */
  shape?: "default" | "pill";
  onClick?: () => void;
  /** Renders a next/link with the same styling — same pattern as IconButton. */
  href?: string;
  className?: string;
  icon?: React.ReactNode;
  // Defaults to "button" so existing call sites keep behaving as they do today;
  // the login form opts into "submit" explicitly.
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  shape = "default",
  onClick,
  href,
  className,
  icon,
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}) => {
  const baseStyles =
    "focusRing font-semibold transition-all duration-200 flex items-center gap-2 justify-center disabled:opacity-60 disabled:cursor-not-allowed";

  const shapes = {
    default: "rounded",
    pill: "rounded-full",
  };

  const variants = {
    primary: "bg-white text-black hover:bg-white/90",
    secondary: "bg-gray-500/70 text-white hover:bg-gray-500/50",
    ghost: "bg-transparent text-white hover:bg-white/10 border border-white/30",
  };

  const sizes = {
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
      <Link href={href} aria-label={ariaLabel} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classes}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
