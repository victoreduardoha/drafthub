"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step { number: number; label: string; }

export function StepIndicator({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, i) => {
        const done   = step.number < current;
        const active = step.number === current;
        const last   = i === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              {/* Circle */}
              <motion.div
                animate={{ scale: active ? [1, 1.06, 1] : 1 }}
                transition={{ duration: 0.6, repeat: active ? Infinity : 0, repeatDelay: 2.5 }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  done
                    ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                    : active
                    ? "bg-orange-500/10 border-orange-500 text-orange-400 shadow-[0_0_14px_rgba(249,115,22,0.25)]"
                    : "bg-[#0c0e13] border-white/[0.08] text-[#2a2e3a]"
                )}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step.number}
              </motion.div>

              {/* Label */}
              <span className={cn(
                "text-[10px] font-medium hidden sm:block whitespace-nowrap",
                active ? "text-[#f0ece3]" : done ? "text-orange-500" : "text-[#2a2e3a]"
              )}>
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {!last && (
              <div className="relative h-px w-10 sm:w-14 mx-1 -mt-[18px] sm:-mt-[26px]">
                <div className="absolute inset-0 bg-[#111318]" />
                <motion.div
                  className="absolute inset-0 bg-orange-500 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
