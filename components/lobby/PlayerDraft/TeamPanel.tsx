"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Player, TeamId, PlayerDraftPick } from "@/types";
import { ELO_BG_COLORS } from "@/lib/utils";
import { Crown } from "lucide-react";

interface TeamPanelProps {
  teamId: TeamId;
  captain: Player;
  picks: PlayerDraftPick[];
  totalSlots: number; // excluding captain
}

export function TeamPanel({ teamId, captain, picks, totalSlots }: TeamPanelProps) {
  const isA = teamId === "A";
  const teamPicks = picks.filter((p) => p.teamId === teamId);
  const filledSlots = teamPicks.length;

  return (
    <div
      className={`rounded-xl border p-3.5 space-y-2 ${
        isA
          ? "border-orange-500/15 bg-orange-500/[0.03]"
          : "border-amber-500/15 bg-amber-500/[0.03]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              isA ? "bg-orange-500 text-white" : "bg-amber-500 text-black"
            }`}
          >
            {teamId}
          </div>
          <span className="text-xs font-bold text-[#f0ece3]">Time {teamId}</span>
        </div>
        <span
          className={`text-[10px] font-mono font-bold ${
            isA ? "text-orange-400" : "text-amber-400"
          }`}
        >
          {filledSlots + 1}/{totalSlots + 1}
        </span>
      </div>

      <div className="space-y-1.5">
        {/* Captain (fixed) */}
        <div
          className={`flex items-center gap-2 p-2 rounded-lg ${
            isA ? "bg-orange-500/[0.08]" : "bg-amber-500/[0.08]"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
              isA ? "bg-orange-500/30 text-orange-300" : "bg-amber-500/30 text-amber-300"
            }`}
          >
            {captain.nickname.charAt(0).toUpperCase()}
          </div>
          <p className="flex-1 text-[11px] font-medium text-[#f0ece3] truncate">
            {captain.nickname}
          </p>
          <Crown className={`w-3 h-3 shrink-0 ${isA ? "text-orange-400" : "text-amber-400"}`} />
        </div>

        {/* Drafted players */}
        <AnimatePresence mode="popLayout">
          {teamPicks.map((pick) => (
            <motion.div
              key={pick.player.id}
              initial={{ opacity: 0, x: isA ? -10 : 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#07080c]/60"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                  isA ? "bg-orange-500/15 text-orange-400" : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {pick.player.nickname.charAt(0).toUpperCase()}
              </div>
              <p className="flex-1 text-[11px] font-medium text-[#f0ece3] truncate">
                {pick.player.nickname}
              </p>
              {pick.player.elo && (
                <span
                  className={`text-[9px] px-1 py-0.5 rounded font-medium ${ELO_BG_COLORS[pick.player.elo] ?? ""}`}
                >
                  {pick.player.elo}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty slots */}
        {Array.from({ length: totalSlots - filledSlots }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className={`h-8 rounded-lg border border-dashed opacity-10 ${
              isA ? "border-orange-500" : "border-amber-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
