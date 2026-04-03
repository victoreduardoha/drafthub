import { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-[#8892a4] uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full bg-[#0d1117] border border-[#1e2530] rounded-lg px-3 py-2.5 text-sm text-[#e8eaf0]",
            "focus:outline-none focus:border-[#ff4655]/50 focus:ring-1 focus:ring-[#ff4655]/20",
            "transition-all duration-200 cursor-pointer",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
export { Select };
