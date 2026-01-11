import React from "react";
import { cn } from "@/data/mockCategories";


interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className,
  icon,
}) => {
  const baseStyles =
    "font-semibold rounded transition-all duration-200 flex items-center gap-2 justify-center";

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

  return (
    <button
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
