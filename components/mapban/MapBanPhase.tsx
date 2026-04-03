"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Ban, Map, Swords, Clock } from "lucide-react";
import { MapBanState, Lobby, Side, CaptainRole } from "@/types";
import { MapGrid } from "./MapGrid";
import { BanTimeline } from "./BanTimeline";
import { SideSelector } from "./SideSelector";
import { getMapById } from "@/config/maps";
import { isMyMapBanTurn, getWaitingMessage, getActionTypeLabel } from "@/lib/mapban-permissions";
import { cn } from "@/lib/utils";

interface Props {
  lobby: Lobby;
  role: CaptainRole;
  onBan: (id: string) => void;
  onPick: (id: string) => void;
  onSide: (s: Side) => void;
}

export function MapBanPhase({ lobby, role, onBan, onPick, onSide }: Props) {
  const state = lobby.mapBanState!;
  const cur = state.currentAction;
  if (state.completed) return null;

  const myTurn = isMyMapBanTurn(role, state);
  const waitMsg = !myTurn
    ? getWaitingMessage(role, state, lobby.captain1.nickname, lobby.captain2.nickname)
    : null;

  const teamName = (t: "A" | "B") =>
    t === "A" ? (lobby.teamA?.name ?? "Time A") : (lobby.teamB?.name ?? "Time B");
  const teamColor = (t: "A" | "B") => (t === "A" ? "text-orange-400" : "text-amber-400");

  const actionIcon =
    cur?.actionType === "ban"  ? <Ban   className="w-5 h-5 text-red-400" /> :
    cur?.actionType === "pick" ? <Map   className="w-5 h-5 text-emerald-400" /> :
                                 <Swords className="w-5 h-5 text-sky-400" />;

  const actionColor =
    cur?.actionType === "ban"  ? "text-red-400" :
    cur?.actionType === "pick" ? "text-emerald-400" : "text-sky-400";

  const completed = state.steps.filter((s) => s.completed).length;

  return (
    <div className="space-y-5">
      {/* ── Current action card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state.currentStep}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="relative rounded-2xl border border-white/[0.06] bg-[#07080c] overflow-hidden p-5"
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-orange-500/[0.04] blur-[30px] rounded-full pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#111318] border border-white/[0.06] flex items-center justify-center shrink-0">
                {actionIcon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-mono text-[#2a2e3a]">PASSO {state.currentStep}</span>
                  {cur && (
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${actionColor}`}>
                      {getActionTypeLabel(cur.actionType)}
                    </span>
                  )}
                </div>
                <p className="text-base font-bold text-[#f0ece3]">
                  {cur && (
                    <span className={teamColor(cur.teamId)}>{teamName(cur.teamId)}</span>
                  )}
                  <span className="text-[#8a8f9e] font-normal text-sm ml-1.5">
                    {cur?.description.replace(`Time ${cur?.teamId}`, "").trim()}
                  </span>
                </p>
              </div>
            </div>
            <div className="ml-auto text-right hidden sm:block shrink-0">
              <p className="text-[10px] text-[#2a2e3a]">Progresso</p>
              <p className="text-sm font-mono font-bold text-[#8a8f9e]">{completed}/{state.steps.length}</p>
            </div>
          </div>

          {/* Step progress bar */}
          <div className="flex gap-1 mt-4">
            {state.steps.map((s) => (
              <div
                key={s.step}
                className={cn(
                  "h-0.5 flex-1 rounded-full transition-all duration-400",
                  s.completed
                    ? "bg-orange-500"
                    : s.step === state.currentStep
                    ? "bg-orange-500/30 animate-pulse"
                    : "bg-[#1a1c20]"
                )}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Waiting banner when it's not the user's turn ── */}
      <AnimatePresence>
        {!myTurn && waitMsg && (
          <motion.div
            key="waiting-banner"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.05] bg-[#07080c]"
          >
            <div className="w-7 h-7 rounded-lg bg-[#111318] border border-white/[0.06] flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#3d4154]" />
            </div>
            <p className="text-sm text-[#8a8f9e]">{waitMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Action area ── */}
      {cur?.actionType === "side" ? (
        <SideSelector
          teamId={cur.teamId}
          teamName={teamName(cur.teamId)}
          lastPickedMap={state.pickedMaps.find((pm) => !pm.side)}
          canAct={myTurn}
          onSelect={onSide}
        />
      ) : cur ? (
        <MapGrid
          banState={state}
          currentStep={cur}
          mapPool={lobby.mapPool}
          canAct={myTurn}
          onBan={onBan}
          onPick={onPick}
        />
      ) : null}

      {/* ── Bottom panels ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BanTimeline steps={state.steps} />
        <PickedSummary state={state} format={lobby.format} />
      </div>
    </div>
  );
}

function PickedSummary({ state, format }: { state: MapBanState; format: string }) {
  const total = format === "MD1" ? 1 : format === "MD3" ? 3 : 5;
  return (
    <div className="rounded-xl border border-white/[0.05] bg-[#07080c] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-[#f0ece3]">Série</h3>
        <span className="text-[10px] font-mono text-[#3d4154]">
          {state.pickedMaps.length}/{total}
        </span>
      </div>
      <div className="space-y-1.5">
        {state.pickedMaps.length === 0 && (
          <p className="text-[11px] text-[#2a2e3a]">Nenhum mapa escolhido ainda.</p>
        )}
        <AnimatePresence mode="popLayout">
          {state.pickedMaps.map((pm, i) => {
            const map = getMapById(pm.mapId);
            return (
              <motion.div
                key={pm.mapId}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0c0e13] border border-white/[0.04]"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[9px] font-bold text-emerald-400 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[#f0ece3]">{map?.name ?? pm.mapId}</p>
                  <p className="text-[9px] text-[#3d4154]">
                    {pm.pickedBy === "decider" ? "Decider automático" : `Pick — Time ${pm.pickedBy}`}
                  </p>
                </div>
                {pm.side ? (
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                      pm.side === "Attack"
                        ? "border-orange-500/20 bg-orange-500/[0.07] text-orange-400"
                        : "border-blue-500/20 bg-blue-500/[0.07] text-blue-400"
                    }`}
                  >
                    {pm.side}
                  </span>
                ) : (
                  <span className="text-[9px] text-[#2a2e3a] italic">lado...</span>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
