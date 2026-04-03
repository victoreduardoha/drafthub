// ============================================================
// MAP BAN PERMISSIONS — Pure helpers, no UI dependencies
// ============================================================

import { CaptainRole, MapBanState } from "@/types";

/** Maps a CaptainRole to a team ID, or null for spectators */
export function getActorTeam(role: CaptainRole): "A" | "B" | null {
  if (role === "captain_1") return "A";
  if (role === "captain_2") return "B";
  return null;
}

/** True if the current step's actor matches the user's role */
export function isMyMapBanTurn(role: CaptainRole, state: MapBanState): boolean {
  if (state.completed || !state.currentAction) return false;
  const actorTeam = getActorTeam(role);
  return actorTeam !== null && actorTeam === state.currentAction.teamId;
}

/** Human-readable message for the waiting captain / spectator */
export function getWaitingMessage(
  role: CaptainRole,
  state: MapBanState,
  captain1Name: string,
  captain2Name: string
): string {
  if (!state.currentAction || state.completed) return "";
  const { teamId, actionType } = state.currentAction;
  const name = teamId === "A" ? captain1Name : captain2Name;
  const verb =
    actionType === "ban"  ? "banir um mapa" :
    actionType === "pick" ? "escolher um mapa" :
                            "escolher o lado";
  if (role === "spectator") return `Aguardando ${name} ${verb}…`;
  // The other captain
  return `Aguardando ${name} ${verb}…`;
}

/** Label for the current action type */
export function getActionTypeLabel(
  actionType: "ban" | "pick" | "side" | "decider"
): string {
  switch (actionType) {
    case "ban":     return "BAN";
    case "pick":    return "PICK";
    case "side":    return "LADO";
    case "decider": return "DECIDER";
  }
}
