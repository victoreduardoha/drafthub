"use client";

import { motion } from "framer-motion";
import { Shield, Sword, Clock } from "lucide-react";
import { Side, PickedMap } from "@/types";
import { getMapById } from "@/config/maps";
import { cn } from "@/lib/utils";

interface Props {
  teamId: "A" | "B";
  teamName: string;
  lastPickedMap: PickedMap | undefined;
  canAct: boolean;
  onSelect: (s: Side) => void;
}

export function SideSelector({ teamId, teamName, lastPickedMap, canAct, onSelect }: Props) {
  const map = lastPickedMap ? getMapById(lastPickedMap.mapId) : null;
  const teamColor = teamId === "A" ? "text-orange-400" : "text-amber-400";

  return (
    <div className="space-y-4">
      {/* Context hint */}
      <div
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border",
          canAct
            ? "border-sky-500/20 bg-sky-500/[0.05] text-sky-400"
            : "border-white/[0.05] bg-[#07080c] text-[#3d4154]"
        )}
      >
        {canAct ? (
          <>
            <Shield className="w-3.5 h-3.5" />
            Escolha o lado para{" "}
            {map ? <strong className="text-[#f0ece3] ml-1">{map.name}</strong> : "este mapa"}
          </>
        ) : (
          <>
            <Clock className="w-3.5 h-3.5" />
            Aguardando{" "}
            <span className={cn("ml-1 font-semibold", teamColor)}>{teamName}</span>{" "}
            escolher o lado…
          </>
        )}
      </div>

      {/* Side buttons */}
      <div className={cn("grid grid-cols-2 gap-4", !canAct && "pointer-events-none")}>
        {(["Attack", "Defense"] as Side[]).map((side) => (
          <motion.button
            key={side}
            whileHover={canAct ? { scale: 1.02, y: -2 } : {}}
            whileTap={canAct ? { scale: 0.98 } : {}}
            onClick={() => canAct && onSelect(side)}
            disabled={!canAct}
            className={cn(
              "relative p-6 rounded-2xl border group overflow-hidden transition-all duration-200",
              canAct
                ? side === "Attack"
                  ? "border-orange-900/30 bg-[#0c0e13] hover:border-orange-500/30 hover:shadow-[0_0_24px_rgba(249,115,22,0.08)] cursor-pointer"
                  : "border-blue-900/30 bg-[#0c0e13] hover:border-blue-500/30 hover:shadow-[0_0_24px_rgba(59,130,246,0.08)] cursor-pointer"
                : "border-white/[0.04] bg-[#07080c] cursor-default opacity-40"
            )}
          >
            {/* Inner glow (only when canAct) */}
            {canAct && (
              <div
                className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  side === "Attack"
                    ? "bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(249,115,22,0.05),transparent)]"
                    : "bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(59,130,246,0.05),transparent)]"
                )}
              />
            )}

            <div className="relative flex flex-col items-center gap-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl border-2 flex items-center justify-center",
                  side === "Attack"
                    ? "border-orange-500/20 bg-orange-500/[0.07]"
                    : "border-blue-500/20 bg-blue-500/[0.07]"
                )}
              >
                {side === "Attack"
                  ? <Sword  className="w-5 h-5 text-orange-400" />
                  : <Shield className="w-5 h-5 text-blue-400" />}
              </div>
              <div className="text-center">
                <p
                  className={cn(
                    "text-lg font-black uppercase tracking-wider",
                    side === "Attack" ? "text-orange-400" : "text-blue-400"
                  )}
                >
                  {side}
                </p>
                <p className="text-[11px] text-[#3d4154] mt-0.5">
                  {side === "Attack" ? "Ataque primeiro" : "Defesa primeiro"}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-[11px] text-[#2a2e3a]">
        <span className={teamColor}>{teamName}</span>{" "}
        {canAct ? "está escolhendo o lado" : "deve escolher o lado"}
      </p>
    </div>
  );
}
