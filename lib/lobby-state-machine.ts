import { LobbyStatus } from "@/types";

// ─── Allowed transitions ──────────────────────────────────────────────────────

const TRANSITIONS: Readonly<[LobbyStatus, LobbyStatus][]> = [
  ["waiting_captain",  "captain_2_joined"],
  ["captain_2_joined", "draft_ready"],
  ["draft_ready",      "draft_live"],
  ["draft_live",       "draft_completed"],
  ["draft_completed",  "map_ban_ready"],
  ["map_ban_ready",    "map_ban_live"],
  ["map_ban_live",     "completed"],
];

export function canTransition(from: LobbyStatus, to: LobbyStatus): boolean {
  return TRANSITIONS.some(([f, t]) => f === from && t === to);
}

export function getNextStatus(from: LobbyStatus): LobbyStatus | null {
  return TRANSITIONS.find(([f]) => f === from)?.[1] ?? null;
}

// Statuses where the draft is active or relevant
export const DRAFT_STATUSES: LobbyStatus[] = [
  "captain_2_joined",
  "draft_ready",
  "draft_live",
  "draft_completed",
];

// Statuses where map ban is active or relevant
export const MAP_BAN_STATUSES: LobbyStatus[] = ["map_ban_ready", "map_ban_live"];
