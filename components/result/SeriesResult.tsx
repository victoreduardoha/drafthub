"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Trophy, Copy, RefreshCw, Plus, Shield, Sword,
  User, Ban, Check, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ELO_BG_COLORS, copyToClipboard } from "@/lib/utils";
import { getMapById } from "@/config/maps";
import { Lobby, PickedMap, Side } from "@/types";
import { useToast } from "@/components/ui/Toast";

// ── Helper: derive both teams' starting sides from a PickedMap ───────────────
function resolveTeamSides(pm: PickedMap): { teamA: Side; teamB: Side } | null {
  if (!pm.side || !pm.sideChosenBy) return null;
  const teamASide: Side =
    pm.sideChosenBy === "A" ? pm.side : pm.side === "Attack" ? "Defense" : "Attack";
  return { teamA: teamASide, teamB: teamASide === "Attack" ? "Defense" : "Attack" };
}

// ── Small helper row: "Time A  ·  Ataque" ────────────────────────────────────
function SideRow({ teamId, side }: { teamId: "A" | "B"; side: Side }) {
  const isA    = teamId === "A";
  const isAtk  = side === "Attack";
  return (
    <div className="flex items-center gap-2">
      {/* Team badge */}
      <div
        className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-black shrink-0 ${
          isA ? "bg-orange-500 text-white" : "bg-amber-500 text-black"
        }`}
      >
        {teamId}
      </div>
      {/* Side icon */}
      {isAtk
        ? <Sword  className="w-3 h-3 text-orange-400 shrink-0" />
        : <Shield className="w-3 h-3 text-blue-400   shrink-0" />}
      {/* Label */}
      <span className={`text-[11px] font-semibold ${isAtk ? "text-orange-400" : "text-blue-400"}`}>
        {isAtk ? "Ataque" : "Defesa"}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SeriesResult({ lobby, onRestart }: { lobby: Lobby; onRestart?: () => void }) {
  const router  = useRouter();
  const { toast } = useToast();
  const state   = lobby.mapBanState!;
  const teamA   = lobby.teamA!;
  const teamB   = lobby.teamB!;
  const bans    = state.history.filter((h) => h.actionType === "ban");

  const copy = async () => {
    const lines = [
      `=== ${lobby.matchName} ===`,
      `Formato: ${lobby.format}`,
      "",
      `Time A — ${teamA.captain.nickname} (CAP)`,
      ...teamA.players.map((p) => `  • ${p.nickname}${p.elo ? ` [${p.elo}]` : ""}`),
      "",
      `Time B — ${teamB.captain.nickname} (CAP)`,
      ...teamB.players.map((p) => `  • ${p.nickname}${p.elo ? ` [${p.elo}]` : ""}`),
      "",
      "Mapas:",
      ...state.pickedMaps.map((pm, i) => {
        const m    = getMapById(pm.mapId);
        const who  = pm.pickedBy === "decider" ? "Decider automático" : `Pick Time ${pm.pickedBy}`;
        const sides = resolveTeamSides(pm);
        const sideStr = sides
          ? ` | Time A: ${sides.teamA} · Time B: ${sides.teamB}`
          : "";
        return `  ${i + 1}. ${m?.name ?? pm.mapId} — ${who}${sideStr}`;
      }),
      "",
      "Bans:",
      ...bans.map((b) => {
        const m = getMapById(b.mapId ?? "");
        return `  Time ${b.teamId} baniu ${m?.name ?? b.mapId}`;
      }),
    ];
    await copyToClipboard(lines.join("\n"));
    toast("Resultado copiado!", "success");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

      {/* ── Header ── */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto"
        >
          <Trophy className="w-7 h-7 text-amber-400" />
        </motion.div>
        <h2 className="text-2xl font-black text-[#f0ece3] tracking-tight">{lobby.matchName}</h2>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="amber">{lobby.format}</Badge>
          <span className="text-[10px] text-[#2a2e3a]">·</span>
          <span className="text-[11px] text-[#3d4154]">{state.pickedMaps.length} mapas</span>
        </div>
      </div>

      {/* ── Teams ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[teamA, teamB].map((team, idx) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, x: idx === 0 ? -16 : 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + idx * 0.08 }}
            className={`rounded-2xl border p-5 ${
              team.id === "A"
                ? "border-orange-500/15 bg-orange-500/[0.03]"
                : "border-amber-500/15 bg-amber-500/[0.03]"
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                  team.id === "A" ? "bg-orange-500 text-white" : "bg-amber-500 text-black"
                }`}
              >
                {team.id}
              </div>
              <h3 className="font-bold text-[#f0ece3] text-sm">{team.name}</h3>
            </div>
            <div className="space-y-1.5">
              {team.players.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#111318] border border-white/[0.05] flex items-center justify-center shrink-0">
                    <User className="w-2.5 h-2.5 text-[#3d4154]" />
                  </div>
                  <p className="flex-1 text-[11px] font-medium text-[#f0ece3] truncate">{p.nickname}</p>
                  <div className="flex items-center gap-1 shrink-0">
                    {p.elo && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${ELO_BG_COLORS[p.elo] ?? ""}`}>
                        {p.elo}
                      </span>
                    )}
                    {p.isCaptain && (
                      <Badge variant={team.id === "A" ? "orange" : "amber"} size="sm">CAP</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Map series ── */}
      <div>
        <h3 className="text-xs font-bold text-[#f0ece3] uppercase tracking-widest mb-4">Série de Mapas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.pickedMaps.map((pm, i) => {
            const map       = getMapById(pm.mapId);
            const sides     = resolveTeamSides(pm);
            const isDecider = pm.pickedBy === "decider";

            return (
              <motion.div
                key={pm.mapId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                className="rounded-xl overflow-hidden border border-white/[0.06] flex flex-col"
              >
                {/* ── Image strip with map number + name ── */}
                <div className="relative h-28 shrink-0">
                  <Image
                    src={map?.image ?? ""}
                    alt={map?.name ?? ""}
                    fill
                    className="object-cover brightness-[0.72]"
                    onError={() => {}}
                  />
                  {/* strong bottom scrim for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
                    <p className="text-[9px] font-mono text-white/35 uppercase tracking-widest leading-none mb-0.5">
                      Mapa {i + 1}
                    </p>
                    <p
                      className="text-base font-black text-white uppercase tracking-wide leading-tight"
                      style={{ textShadow: "0 1px 8px rgba(0,0,0,1)" }}
                    >
                      {map?.name ?? pm.mapId}
                    </p>
                  </div>
                </div>

                {/* ── Info panel ── */}
                <div className="bg-[#0c0e13] flex-1 px-3 py-3 space-y-3">

                  {/* How the map was determined */}
                  <div className="flex items-center gap-2">
                    {isDecider ? (
                      <>
                        <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                          <Lock className="w-3 h-3 text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-amber-400 leading-none">Decider</p>
                          <p className="text-[9px] text-[#3d4154] mt-0.5">Mapa restante automático</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black shrink-0 ${
                            pm.pickedBy === "A" ? "bg-orange-500 text-white" : "bg-amber-500 text-black"
                          }`}
                        >
                          {pm.pickedBy}
                        </div>
                        <p className="text-[11px] font-bold text-[#f0ece3]">
                          Pick do Time {pm.pickedBy}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-white/[0.04]" />

                  {/* Sides — one explicit row per team */}
                  {sides ? (
                    <div className="space-y-1.5">
                      <SideRow teamId="A" side={sides.teamA} />
                      <SideRow teamId="B" side={sides.teamB} />
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#2a2e3a] italic">Lado não definido</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Veto history ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bans */}
        <div className="rounded-xl border border-white/[0.05] bg-[#07080c] p-4 space-y-3">
          <h3 className="text-xs font-bold text-[#f0ece3] flex items-center gap-2">
            <Ban className="w-3.5 h-3.5 text-red-400" /> Bans
          </h3>
          <div className="space-y-1.5">
            {bans.length === 0 ? (
              <p className="text-[11px] text-[#2a2e3a]">Nenhum ban registrado.</p>
            ) : (
              <AnimatePresence>
                {bans.map((b, i) => {
                  const map = getMapById(b.mapId ?? "");
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0c0e13] border border-white/[0.04]"
                    >
                      <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0">
                        <Ban className="w-2.5 h-2.5 text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#f0ece3] truncate">{map?.name ?? b.mapId}</p>
                        <p className="text-[9px] text-[#3d4154]">Passo {b.step}</p>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          b.teamId === "A"
                            ? "bg-orange-500/10 text-orange-400"
                            : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        Time {b.teamId}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Picks + decider */}
        <div className="rounded-xl border border-white/[0.05] bg-[#07080c] p-4 space-y-3">
          <h3 className="text-xs font-bold text-[#f0ece3] flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Picks
          </h3>
          <div className="space-y-1.5">
            {state.pickedMaps.length === 0 ? (
              <p className="text-[11px] text-[#2a2e3a]">Nenhum pick registrado.</p>
            ) : (
              <AnimatePresence>
                {state.pickedMaps.map((pm, i) => {
                  const map       = getMapById(pm.mapId);
                  const isDecider = pm.pickedBy === "decider";
                  const sides     = resolveTeamSides(pm);
                  return (
                    <motion.div
                      key={pm.mapId}
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0c0e13] border border-white/[0.04]"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isDecider
                            ? "bg-amber-500/10 border border-amber-500/15"
                            : "bg-emerald-500/10 border border-emerald-500/15"
                        }`}
                      >
                        {isDecider
                          ? <Lock  className="w-2.5 h-2.5 text-amber-400" />
                          : <Check className="w-2.5 h-2.5 text-emerald-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#f0ece3] truncate">{map?.name ?? pm.mapId}</p>
                        <p className="text-[9px] text-[#3d4154]">
                          {isDecider ? "Decider automático" : `Pick Time ${pm.pickedBy}`}
                          {sides && ` · A: ${sides.teamA} · B: ${sides.teamB}`}
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-[#2a2e3a] shrink-0">#{i + 1}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
      >
        <Button variant="secondary" size="lg" onClick={copy}>
          <Copy className="w-4 h-4" /> Copiar Resumo
        </Button>
        {onRestart && (
          <Button variant="outline" size="lg" onClick={onRestart}>
            <RefreshCw className="w-4 h-4" /> Reiniciar
          </Button>
        )}
        <Button size="lg" onClick={() => router.push("/create")}>
          <Plus className="w-4 h-4" /> Novo Lobby
        </Button>
      </motion.div>
    </motion.div>
  );
}
