"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { TeamId, CaptainRole } from "@/types";

interface TurnBannerProps {
  currentTeam: TeamId | null;
  captain1Name: string;
  captain2Name: string;
  pickIndex: number;
  totalPicks: number;
  role: CaptainRole;
}

export function TurnBanner({
  currentTeam,
  captain1Name,
  captain2Name,
  pickIndex,
  totalPicks,
  role,
}: TurnBannerProps) {
  const isA = currentTeam === "A";
  const captainName = isA ? captain1Name : captain2Name;
  const isYourTurn =
    (role === "captain_1" && currentTeam === "A") ||
    (role === "captain_2" && currentTeam === "B");

  const accentColor = isA ? "text-orange-400" : "text-amber-400";
  const borderColor = isA ? "border-orange-500/20" : "border-amber-500/20";
  const bgColor = isA ? "bg-orange-500/[0.06]" : "bg-amber-500/[0.06]";
  const glowColor = isA
    ? "bg-orange-500/[0.08] blur-[60px]"
    : "bg-amber-500/[0.08] blur-[60px]";

  return (
    <div className={`relative rounded-2xl border ${borderColor} ${bgColor} p-4 overflow-hidden`}>
      {/* ambient glow */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-72 h-20 ${glowColor} pointer-events-none`} />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Team badge */}
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
              isA ? "bg-orange-500 text-white" : "bg-amber-500 text-black"
            }`}
          >
            {currentTeam}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentTeam}-${pickIndex}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="min-w-0"
            >
              <p className="text-[11px] text-[#3d4154] uppercase tracking-wider font-semibold">
                Pick {pickIndex + 1} de {totalPicks}
              </p>
              <p className={`text-sm font-bold truncate ${accentColor}`}>
                {isYourTurn ? "Sua vez!" : `Vez de ${captainName}`}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 shrink-0">
          {isYourTurn && (
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              <Zap className={`w-4 h-4 ${accentColor}`} />
            </motion.div>
          )}
          <div className="flex gap-1">
            {Array.from({ length: totalPicks }).map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i < pickIndex
                    ? "bg-[#3d4154]"
                    : i === pickIndex
                    ? isA
                      ? "bg-orange-400"
                      : "bg-amber-400"
                    : "bg-[#1a1d24]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
