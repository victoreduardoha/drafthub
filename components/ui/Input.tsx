import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[10px] font-semibold text-[#8a8f9e] uppercase tracking-widest">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d4154] group-focus-within:text-orange-500/60 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-[#07080c] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-[#f0ece3] placeholder:text-[#2a2e3a]",
              "focus:outline-none focus:border-orange-500/30 focus:shadow-[0_0_0_1px_rgba(249,115,22,0.12),0_0_12px_rgba(249,115,22,0.06)]",
              "transition-all duration-200",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              icon && "pl-9",
              error && "border-red-500/40 focus:border-red-500/50",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-red-400">{error}</p>}
        {hint && !error && <p className="text-[11px] text-[#3d4154]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
