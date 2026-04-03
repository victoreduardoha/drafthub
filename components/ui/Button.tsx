"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "amber";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]";

    const variants = {
      primary:
        "bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.25)] hover:shadow-[0_0_30px_rgba(249,115,22,0.40)] border border-orange-500/30",
      secondary:
        "bg-[#111318] hover:bg-[#161820] text-[#f0ece3] border border-white/[0.07] hover:border-orange-500/20",
      ghost:
        "bg-transparent hover:bg-white/[0.04] text-[#8a8f9e] hover:text-[#f0ece3] border border-transparent",
      danger:
        "bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-900/40 hover:border-red-500/40",
      outline:
        "bg-transparent border border-white/10 hover:border-orange-500/30 text-[#f0ece3] hover:bg-orange-500/[0.04]",
      amber:
        "bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] border border-amber-400/30",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs h-8",
      md: "px-4 py-2 text-sm h-9",
      lg: "px-5 py-2.5 text-sm h-10",
      xl: "px-7 py-3 text-[15px] h-12",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
