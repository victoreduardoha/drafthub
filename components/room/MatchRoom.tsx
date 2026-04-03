"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair, Copy, Map, Clock, Users, Swords, Check,
} from "lucide-react";
import { getActorTeam } from "@/lib/mapban-permissions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DraftPhase } from "@/components/lobby/PlayerDraft/DraftPhase";
import { MapBanPhase } from "@/components/mapban/MapBanPhase";
import { SeriesResult } from "@/components/result/SeriesResult";
import { useLobbyStore } from "@/store/lobbyStore";
import { useLobbySync } from "@/hooks/useLobbySync";
import { useToast } from "@/components/ui/Toast";
import { copyToClipboard } from "@/lib/utils";
import { getCaptain2Link } from "@/hooks/useLobbyRole";
import { Lobby, CaptainRole, Side } from "@/types";

interface MatchRoomProps {
  lobby: Lobby;
  role: CaptainRole;
}

export function MatchRoom({ lobby: init, role }: MatchRoomProps) {
  const router = useRouter();
  const { toast } = useToast();
  const {
    getLobby,
    captain2Joined,
    startDraft,
    performDraftPick,
    finaliseDraft,
    startMapBan,
    performBan,
    performPick,
    performSideChoice,
    setLobbyStatus,
  } = useLobbyStore();

  const lobby = getLobby(init.id) ?? init;
  const { broadcast } = useLobbySync(lobby.id);

  // ── Actor team derived from role ─────────────────────────────────────────────
  const actorTeam = getActorTeam(role);

  // ── Generic sync helper for non-mapban actions ────────────────────────────────
  const withSync = <T extends unknown[]>(fn: (...args: T) => void) =>
    (...args: T) => {
      fn(...args);
      const updated = getLobby(lobby.id);
      if (updated) broadcast(updated);
    };

  // ── Map ban action handlers (validate actor at both layers) ───────────────────
  const handleBan = (mapId: string) => {
    if (!actorTeam) return; // spectator — UI layer guard
    performBan(lobby.id, mapId, actorTeam);
    const updated = getLobby(lobby.id);
    if (updated) broadcast(updated);
  };

  const handlePick = (mapId: string) => {
    if (!actorTeam) return;
    performPick(lobby.id, mapId, actorTeam);
    const updated = getLobby(lobby.id);
    if (updated) broadcast(updated);
  };

  const handleSide = (side: Side) => {
    if (!actorTeam) return;
    performSideChoice(lobby.id, side, actorTeam);
    const updated = getLobby(lobby.id);
    if (updated) broadcast(updated);
  };

  const copyLink = async () => {
    await copyToClipboard(lobby.shareLink ?? window.location.href);
    toast("Link copiado!", "success");
  };

  const copyCaptain2Link = async () => {
    await copyToClipboard(getCaptain2Link(lobby.id));
    toast("Link do Capitão 2 copiado!", "success");
  };

  // ── Status label / badge ─────────────────────────────────────────────────────

  const statusLabel: Record<Lobby["status"], string> = {
    creating:          "Criando",
    waiting_captain:   "Aguardando",
    captain_2_joined:  "Capitão chegou",
    draft_ready:       "Draft pronto",
    draft_live:        "Draft",
    draft_completed:   "Draft concluído",
    map_ban_ready:     "Map Ban",
    map_ban_live:      "Veto",
    completed:         "Concluído",
  };

  const statusVariant: Record<Lobby["status"], "default" | "orange" | "amber" | "purple" | "green"> = {
    creating:          "default",
    waiting_captain:   "orange",
    captain_2_joined:  "orange",
    draft_ready:       "purple",
    draft_live:        "purple",
    draft_completed:   "purple",
    map_ban_ready:     "amber",
    map_ban_live:      "amber",
    completed:         "green",
  };

  return (
    <div className="min-h-screen bg-[#030305] flex flex-col">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[160px] bg-orange-500/[0.06] blur-[70px] rounded-full pointer-events-none z-0" />
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none z-0" />

      {/* Nav */}
      <div className="relative z-20 border-b border-white/[0.04] backdrop-blur-sm bg-[#030305]/80 sticky top-0">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#3d4154] hover:text-[#f0ece3] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
              <Crosshair className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <span className="font-black text-sm text-[#f0ece3] hidden sm:block">DraftHub</span>
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-bold text-[#f0ece3] truncate">{lobby.matchName}</h1>
            <Badge variant={statusVariant[lobby.status]}>{statusLabel[lobby.status]}</Badge>
          </div>

          <Button variant="secondary" size="sm" onClick={copyLink}>
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Link</span>
          </Button>
        </div>
      </div>

      {/* Role chip */}
      {role !== "spectator" && (
        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 pt-4">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
              role === "captain_1"
                ? "bg-orange-500/[0.08] border-orange-500/20 text-orange-400"
                : "bg-amber-500/[0.08] border-amber-500/20 text-amber-400"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                role === "captain_1" ? "bg-orange-400" : "bg-amber-400"
              }`}
            />
            {role === "captain_1"
              ? `Você é ${lobby.captain1.nickname} (Time A)`
              : `Você é ${lobby.captain2.nickname} (Time B)`}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 py-6 space-y-5">
        {/* Overview strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: "Capitão A", value: lobby.captain1.nickname, color: "text-orange-400" },
            { label: "Capitão B", value: lobby.captain2.nickname, color: "text-amber-400" },
            { label: "Formato",   value: lobby.format,             color: "text-violet-400" },
            { label: "Mapas",     value: `${lobby.mapPool.length} no pool`, color: "text-emerald-400" },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-[#0c0e13] border border-white/[0.05]">
              <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${item.color}`}>
                {item.label}
              </p>
              <p className="text-xs font-bold text-[#f0ece3] truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Phase panels */}
        <AnimatePresence mode="wait">

          {/* ── Waiting for captain 2 ── */}
          {lobby.status === "waiting_captain" && (
            <PhasePanel key="waiting">
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-[#f0ece3]">Aguardando Capitão 2</h2>
                  <p className="text-sm text-[#3d4154] mt-1">
                    Compartilhe o link com{" "}
                    <strong className="text-[#8a8f9e]">{lobby.captain2.nickname}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full max-w-sm px-3 py-2.5 rounded-xl bg-[#07080c] border border-white/[0.05]">
                  <code className="flex-1 text-[11px] text-orange-400 truncate font-mono">
                    {getCaptain2Link(lobby.id)}
                  </code>
                  <button
                    onClick={copyCaptain2Link}
                    className="text-[#3d4154] hover:text-orange-400 transition-colors shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Manual override for testing / local play */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={withSync(() => captain2Joined(lobby.id))}
                >
                  Simular chegada do Capitão 2
                </Button>
              </div>
            </PhasePanel>
          )}

          {/* ── Captain 2 joined — start draft ── */}
          {lobby.status === "captain_2_joined" && (
            <PhasePanel key="c2joined">
              <div className="flex flex-col items-center gap-4 py-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-[#f0ece3]">
                    {lobby.captain2.nickname} entrou no lobby!
                  </h2>
                  <p className="text-sm text-[#3d4154] mt-1">
                    Ambos os capitães estão presentes. Hora do draft.
                  </p>
                </div>
                {(role === "captain_1" || role === "spectator") && (
                  <Button
                    size="lg"
                    onClick={withSync(() => startDraft(lobby.id))}
                  >
                    <Users className="w-4 h-4" /> Iniciar Draft
                  </Button>
                )}
                {role === "captain_2" && (
                  <p className="text-xs text-[#3d4154]">
                    Aguardando {lobby.captain1.nickname} iniciar o draft…
                  </p>
                )}
              </div>
            </PhasePanel>
          )}

          {/* ── Draft live / completed ── */}
          {(lobby.status === "draft_live" || lobby.status === "draft_completed") && (
            <PhasePanel key="draft">
              <DraftPhase
                lobby={lobby}
                role={role}
                onPick={withSync((id) => performDraftPick(lobby.id, id))}
                onFinaliseDraft={withSync(() => finaliseDraft(lobby.id))}
              />
            </PhasePanel>
          )}

          {/* ── Map ban ready — show teams, start veto ── */}
          {lobby.status === "map_ban_ready" && (
            <PhasePanel key="startban">
              <div className="flex flex-col items-center gap-5 py-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
                  <Map className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg font-bold text-[#f0ece3]">Times Prontos!</h2>
                  <p className="text-sm text-[#3d4154] mt-1">
                    Pronto para iniciar o veto ({lobby.format})
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                  {[lobby.teamA, lobby.teamB].filter(Boolean).map((t) => (
                    <div
                      key={t!.id}
                      className={`p-3 rounded-xl border ${
                        t!.id === "A"
                          ? "border-orange-500/15 bg-orange-500/[0.04]"
                          : "border-amber-500/15 bg-amber-500/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                            t!.id === "A" ? "bg-orange-500 text-white" : "bg-amber-500 text-black"
                          }`}
                        >
                          {t!.id}
                        </div>
                        <span className="text-[11px] font-bold text-[#f0ece3]">Time {t!.id}</span>
                      </div>
                      {t!.players.map((p) => (
                        <p key={p.id} className="text-[10px] text-[#3d4154] truncate">
                          {p.isCaptain ? "⭐ " : "• "}
                          {p.nickname}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
                {(role === "captain_1" || role === "spectator") && (
                  <Button
                    size="lg"
                    onClick={withSync(() => startMapBan(lobby.id))}
                  >
                    <Swords className="w-4 h-4" /> Iniciar Map Ban
                  </Button>
                )}
              </div>
            </PhasePanel>
          )}

          {/* ── Map ban live ── */}
          {lobby.status === "map_ban_live" && lobby.mapBanState && !lobby.mapBanState.completed && (
            <PhasePanel key="banphase">
              <MapBanPhase
                lobby={lobby}
                role={role}
                onBan={handleBan}
                onPick={handlePick}
                onSide={handleSide}
              />
            </PhasePanel>
          )}

          {/* ── Completed ── */}
          {lobby.status === "completed" && (
            <PhasePanel key="result" gold>
              <SeriesResult
                lobby={lobby}
                onRestart={() => setLobbyStatus(lobby.id, "draft_live")}
              />
            </PhasePanel>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function PhasePanel({
  children,
  gold = false,
}: {
  children: React.ReactNode;
  gold?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`relative rounded-2xl border bg-[#0c0e13] overflow-hidden p-6 ${
        gold ? "border-amber-500/20" : "border-white/[0.06]"
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
          gold ? "via-amber-500/40" : "via-orange-500/25"
        } to-transparent`}
      />
      {gold && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_30%_at_50%_0%,rgba(245,158,11,0.04),transparent)] pointer-events-none" />
      )}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
