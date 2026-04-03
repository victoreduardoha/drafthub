"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Ban, Check, Lock } from "lucide-react";
import { MapBanState, MapBanStep } from "@/types";
import { getMapById } from "@/config/maps";
import { cn } from "@/lib/utils";

interface Props {
  banState: MapBanState;
  currentStep: MapBanStep;
  mapPool: string[];
  canAct: boolean;
  onBan: (id: string) => void;
  onPick: (id: string) => void;
}

export function MapGrid({ banState, currentStep, mapPool, canAct, onBan, onPick }: Props) {
  const isBan  = currentStep.actionType === "ban";
  const isPick = currentStep.actionType === "pick";

  const status = (id: string): "remaining" | "banned" | "picked" | "decider" => {
    if (banState.bannedMaps.includes(id)) return "banned";
    const p = banState.pickedMaps.find((m) => m.mapId === id);
    if (p?.pickedBy === "decider") return "decider";
    if (p) return "picked";
    return "remaining";
  };

  const handleClick = (id: string) => {
    // UI layer guard — engine has its own actor guard too
    if (!canAct) return;
    if (!banState.remainingMaps.includes(id)) return;
    if (isBan) onBan(id);
    else if (isPick) onPick(id);
  };

  return (
    <div className="space-y-3">
      {/* Action hint */}
      <div
        className={cn(
          "flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border",
          !canAct
            ? "bg-[#07080c] border-white/[0.05] text-[#3d4154]"
            : isBan
            ? "bg-red-950/30 border-red-900/30 text-red-400"
            : "bg-emerald-950/30 border-emerald-900/30 text-emerald-400"
        )}
      >
        {!canAct ? (
          "Aguardando o outro capitão…"
        ) : isBan ? (
          <><Ban className="w-3.5 h-3.5" /> Clique para banir um mapa</>
        ) : (
          <><Check className="w-3.5 h-3.5" /> Clique para escolher um mapa</>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {mapPool.map((id, i) => {
          const map = getMapById(id);
          if (!map) return null;
          const s = status(id);
          const interactive = canAct && s === "remaining";

          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={interactive ? { scale: 1.03, y: -2 } : {}}
              whileTap={interactive ? { scale: 0.97 } : {}}
              onClick={() => handleClick(id)}
              disabled={!interactive}
              className={cn(
                "relative aspect-[4/5] rounded-2xl overflow-hidden border transition-all duration-250 group",
                interactive
                  ? isBan
                    ? "border-white/[0.07] hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.12)] cursor-pointer"
                    : "border-white/[0.07] hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.12)] cursor-pointer"
                  : s === "banned"
                  ? "border-red-900/20 cursor-default"
                  : s === "picked"
                  ? "border-emerald-500/30 cursor-default"
                  : s === "decider"
                  ? "border-amber-500/25 cursor-default"
                  : "border-white/[0.04] cursor-default opacity-60"
              )}
            >
              {/* Map image */}
              <Image
                src={map.image}
                alt={map.name}
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-all duration-500",
                  interactive
                    ? "brightness-70 group-hover:brightness-85 group-hover:scale-[1.05]"
                    : s === "banned"
                    ? "brightness-25 grayscale"
                    : s === "picked"
                    ? "brightness-60"
                    : s === "decider"
                    ? "brightness-50"
                    : "brightness-40 grayscale-[50%]" // remaining but not your turn
                )}
                onError={() => {}}
              />

              {/* Bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/15 to-transparent" />

              {/* ── State overlays ── */}

              {s === "banned" && (
                <div className="absolute inset-0 bg-red-950/55 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-red-900/60 border border-red-500/30 flex items-center justify-center">
                    <Ban className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Banido</p>
                </div>
              )}

              {s === "picked" && (
                <div className="absolute inset-0 bg-emerald-950/35 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Escolhido</p>
                </div>
              )}

              {s === "decider" && (
                <div className="absolute inset-0 bg-amber-950/35 flex flex-col items-center justify-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-amber-900/60 border border-amber-500/30 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">Decider</p>
                </div>
              )}

              {/* Hover: action chip — only when it's your turn */}
              {interactive && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border backdrop-blur-sm",
                      isBan
                        ? "bg-red-950/70 text-red-300 border-red-500/35"
                        : "bg-emerald-950/70 text-emerald-300 border-emerald-500/35"
                    )}
                  >
                    {isBan ? <><Ban className="w-3 h-3" /> Banir</> : <><Check className="w-3 h-3" /> Pick</>}
                  </div>
                </div>
              )}

              {/* Top color bar for picked/decider */}
              {s === "picked" && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500/70 via-emerald-400 to-emerald-500/70" />
              )}
              {s === "decider" && (
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500/70 via-amber-400 to-amber-500/70" />
              )}

              {/* Map name */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-2.5 text-center">
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-[0.1em]",
                    s === "banned"  ? "text-red-400/60" :
                    s === "picked"  ? "text-emerald-300" :
                    s === "decider" ? "text-amber-300" :
                    "text-white/90"
                  )}
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
                >
                  {map.name}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
