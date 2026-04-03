"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Ban, Check, Swords } from "lucide-react";
import { MapBanStep } from "@/types";
import { getMapById } from "@/config/maps";
import { cn } from "@/lib/utils";

export function BanTimeline({ steps }: { steps: MapBanStep[] }) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#07080c] p-4 space-y-3">
      <h3 className="text-xs font-bold text-[#f0ece3]">Histórico do Veto</h3>
      <div className="space-y-1 max-h-[260px] overflow-y-auto pr-0.5">
        <AnimatePresence mode="popLayout">
          {steps.map(s => (
            <motion.div key={s.step} initial={s.completed?{opacity:0,x:-8}:false} animate={{opacity:1,x:0}}
              className={cn("flex items-center gap-2 p-2 rounded-lg transition-colors", s.completed?"bg-[#0c0e13]":"opacity-30")}>
              {/* Icon */}
              <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                s.completed
                  ? s.actionType==="ban" ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : s.actionType==="side" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-[#111318] text-[#2a2e3a] border border-white/[0.05]"
              )}>
                {s.completed
                  ? s.actionType==="ban" ? <Ban className="w-2.5 h-2.5" />
                    : s.actionType==="side" ? <Swords className="w-2.5 h-2.5" />
                    : <Check className="w-2.5 h-2.5" />
                  : <span>{s.step}</span>
                }
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={cn("text-[10px] font-bold", s.teamId==="A"?"text-orange-400":"text-amber-400")}>
                    Time {s.teamId}
                  </span>
                  <span className={cn("text-[9px] uppercase font-semibold",
                    s.actionType==="ban"?"text-red-400/60":s.actionType==="side"?"text-sky-400/60":"text-emerald-400/60")}>
                    {s.actionType==="ban"?"ban":s.actionType==="side"?"lado":"pick"}
                  </span>
                </div>
                {s.completed && (
                  <p className="text-[10px] text-[#8a8f9e] truncate">
                    {s.mapId ? getMapById(s.mapId)?.name||s.mapId : s.side ? `→ ${s.side}` : "—"}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
