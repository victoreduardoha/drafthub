import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "orange" | "amber" | "green" | "red" | "cyan" | "yellow" | "purple";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", className }: BadgeProps) {
  const variants = {
    default: "bg-[#111318] text-[#8a8f9e] border border-white/[0.06]",
    orange:  "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    amber:   "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    green:   "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    red:     "bg-red-500/10 text-red-400 border border-red-500/20",
    cyan:    "bg-sky-500/10 text-sky-400 border border-sky-500/20",
    yellow:  "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    purple:  "bg-violet-500/10 text-violet-400 border border-violet-500/20",
  };
  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md font-semibold uppercase tracking-wide", variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
