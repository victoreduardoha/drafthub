"use client";

import { motion } from "framer-motion";
import { Player, CaptainRole, TeamId } from "@/types";
import { ELO_BG_COLORS } from "@/lib/utils";

interface PlayerCardProps {
  player: Player;
  currentTeam: TeamId | null;
  role: CaptainRole;
  onPick: (playerId: string) => void;
}

export function PlayerCard({ player, currentTeam, role, onPick }: PlayerCardProps) {
  const canPick =
    currentTeam !== null &&
    ((role === "captain_1" && currentTeam === "A") ||
      (role === "captain_2" && currentTeam === "B"));

  const isA = currentTeam === "A";

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, y: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      onClick={() => canPick && onPick(player.id)}
      disabled={!canPick}
      className={`
        w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left
        border transition-all duration-200 group
        ${
          canPick
            ? isA
              ? "border-orange-500/20 bg-[#0c0e13] hover:border-orange-500/50 hover:bg-orange-500/[0.06] cursor-pointer"
              : "border-amber-500/20 bg-[#0c0e13] hover:border-amber-500/50 hover:bg-amber-500/[0.06] cursor-pointer"
            : "border-white/[0.04] bg-[#0c0e13] cursor-default"
        }
      `}
    >
      {/* Avatar */}
      <div
        className={`
          w-8 h-8 rounded-full border flex items-center justify-center
          text-[11px] font-black shrink-0 transition-colors duration-200
          ${
            canPick
              ? isA
                ? "bg-orange-500/10 border-orange-500/20 text-orange-400 group-hover:bg-orange-500/20"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:bg-amber-500/20"
              : "bg-[#111318] border-white/[0.06] text-[#3d4154]"
          }
        `}
      >
        {player.nickname.charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-semibold truncate transition-colors duration-200 ${
            canPick ? "text-[#f0ece3] group-hover:text-white" : "text-[#8a8f9e]"
          }`}
        >
          {player.nickname}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {player.elo && (
            <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${ELO_BG_COLORS[player.elo] ?? ""}`}>
              {player.elo}
            </span>
          )}
          {player.kd !== undefined && (
            <span className="text-[9px] text-[#3d4154]">KD {player.kd.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Pick hint */}
      {canPick && (
        <div
          className={`
            text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0
            opacity-0 group-hover:opacity-100 transition-opacity duration-150
            ${isA ? "bg-orange-500/15 text-orange-400" : "bg-amber-500/15 text-amber-400"}
          `}
        >
          PICK
        </div>
      )}
    </motion.button>
  );
}
