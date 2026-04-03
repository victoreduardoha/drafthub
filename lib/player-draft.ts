import { Player, Team, TeamId, PlayerDraftPick, PlayerDraftState } from "@/types";

// ─── Coin flip ────────────────────────────────────────────────────────────────

export function randomFirstPick(): TeamId {
  return Math.random() < 0.5 ? "A" : "B";
}

// ─── Pick order ───────────────────────────────────────────────────────────────
// Simple alternating: A B A B A B A B  (or B A … if B goes first)

export function buildPickOrder(firstPick: TeamId, totalPicks: number): TeamId[] {
  const other: TeamId = firstPick === "A" ? "B" : "A";
  return Array.from({ length: totalPicks }, (_, i) => (i % 2 === 0 ? firstPick : other));
}

// ─── Initialise ───────────────────────────────────────────────────────────────

export function initPlayerDraft(undraftedCount: number): PlayerDraftState {
  const firstPick = randomFirstPick();
  const pickOrder = buildPickOrder(firstPick, undraftedCount);
  return {
    picks: [],
    currentPickIndex: 0,
    firstPick,
    pickOrder,
    totalPicks: undraftedCount,
    completed: false,
  };
}

// ─── Process a pick ───────────────────────────────────────────────────────────

export function processDraftPick(
  state: PlayerDraftState,
  player: Player
): PlayerDraftState {
  if (state.completed || state.currentPickIndex >= state.totalPicks) return state;

  const teamId = state.pickOrder[state.currentPickIndex];
  const pick: PlayerDraftPick = {
    pickIndex: state.currentPickIndex,
    teamId,
    player: { ...player, teamId },
  };

  const picks = [...state.picks, pick];
  const nextIndex = state.currentPickIndex + 1;
  return {
    ...state,
    picks,
    currentPickIndex: nextIndex,
    completed: nextIndex >= state.totalPicks,
  };
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function getCurrentPickTeam(state: PlayerDraftState): TeamId | null {
  if (state.completed) return null;
  return state.pickOrder[state.currentPickIndex] ?? null;
}

export function getDraftedPlayerIds(state: PlayerDraftState): Set<string> {
  return new Set(state.picks.map((p) => p.player.id));
}

// ─── Build final teams from a completed draft ─────────────────────────────────

export function buildTeamsFromDraft(
  captain1: Player,
  captain2: Player,
  draftState: PlayerDraftState
): { teamA: Team; teamB: Team } {
  const picksA = draftState.picks.filter((p) => p.teamId === "A").map((p) => p.player);
  const picksB = draftState.picks.filter((p) => p.teamId === "B").map((p) => p.player);

  const teamAPlayers: Player[] = [{ ...captain1, teamId: "A" }, ...picksA];
  const teamBPlayers: Player[] = [{ ...captain2, teamId: "B" }, ...picksB];

  return {
    teamA: { id: "A", name: "Time A", captain: captain1, players: teamAPlayers },
    teamB: { id: "B", name: "Time B", captain: captain2, players: teamBPlayers },
  };
}
