"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Users } from "lucide-react";
import { Lobby, CaptainRole } from "@/types";
import { getCurrentPickTeam, getDraftedPlayerIds } from "@/lib/player-draft";
import { TurnBanner } from "./TurnBanner";
import { PlayerCard } from "./PlayerCard";
import { TeamPanel } from "./TeamPanel";
import { Button } from "@/components/ui/Button";

interface DraftPhaseProps {
  lobby: Lobby;
  role: CaptainRole;
  onPick: (playerId: string) => void;
  onFinaliseDraft: () => void;
}

export function DraftPhase({ lobby, role, onPick, onFinaliseDraft }: DraftPhaseProps) {
  const { draftState, captain1, captain2, players } = lobby;

  // ── draft not yet initialised ────────────────────────────────────────────────
  if (!draftState) return null;

  const undraftedPlayers = players.filter(
    (p) => !p.isCaptain && !getDraftedPlayerIds(draftState).has(p.id)
  );
  const currentTeam = getCurrentPickTeam(draftState);
  const slotsPerTeam = Math.floor((players.length - 2) / 2); // non-captain players / 2

  // ── completed ────────────────────────────────────────────────────────────────
  if (draftState.completed) {
    return (
      <div className="space-y-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 py-2"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold text-[#f0ece3]">Draft concluído!</h3>
            <p className="text-xs text-[#3d4154] mt-1">Times formados. Pronto para o map ban.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <TeamPanel
            teamId="A"
            captain={captain1}
            picks={draftState.picks}
            totalSlots={slotsPerTeam}
          />
          <TeamPanel
            teamId="B"
            captain={captain2}
            picks={draftState.picks}
            totalSlots={slotsPerTeam}
          />
        </div>

        {(role === "captain_1" || role === "spectator") && (
          <div className="flex justify-center">
            <Button size="lg" onClick={onFinaliseDraft}>
              Confirmar Times e Ir para Map Ban
            </Button>
          </div>
        )}
      </div>
    );
  }

  // ── draft live ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/[0.06] border border-violet-500/15">
          <Users className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400">Draft de Jogadores</span>
        </div>
      </div>

      {/* Turn banner */}
      <TurnBanner
        currentTeam={currentTeam}
        captain1Name={captain1.nickname}
        captain2Name={captain2.nickname}
        pickIndex={draftState.currentPickIndex}
        totalPicks={draftState.totalPicks}
        role={role}
      />

      {/* 3-col layout: Team A | Pool | Team B */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-3">
        <TeamPanel
          teamId="A"
          captain={captain1}
          picks={draftState.picks}
          totalSlots={slotsPerTeam}
        />

        {/* Player pool */}
        <div className="space-y-2">
          <p className="text-center text-[11px] font-semibold text-[#8a8f9e] uppercase tracking-wider">
            Disponíveis ({undraftedPlayers.length})
          </p>
          <div className="space-y-1.5 min-h-[160px]">
            <AnimatePresence mode="popLayout">
              {undraftedPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  currentTeam={currentTeam}
                  role={role}
                  onPick={onPick}
                />
              ))}
            </AnimatePresence>
            {undraftedPlayers.length === 0 && (
              <p className="text-center text-[11px] text-[#2a2e3a] pt-8">
                Todos os jogadores foram draftados
              </p>
            )}
          </div>
        </div>

        <TeamPanel
          teamId="B"
          captain={captain2}
          picks={draftState.picks}
          totalSlots={slotsPerTeam}
        />
      </div>
    </div>
  );
}
