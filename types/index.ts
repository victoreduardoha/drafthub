// ============================================================
// VALORANT LOBBY — TYPE DEFINITIONS
// ============================================================

export type Elo =
  | "Iron"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Platinum"
  | "Diamond"
  | "Ascendant"
  | "Immortal"
  | "Radiant";

export interface Player {
  id: string;
  nickname: string;
  name?: string;
  elo?: Elo;
  kd?: number;
  isCaptain: boolean;
  captainOf?: "A" | "B";
  teamId?: "A" | "B";
  avatar?: string;
}

export type MatchFormat = "MD1" | "MD3" | "MD5";

export interface MapInfo {
  id: string;
  name: string;
  slug: string;
  image: string;
  callout?: string;
  available: boolean;
}

export type MapActionType = "ban" | "pick" | "decider";
export type Side = "Attack" | "Defense";

export interface MapBanAction {
  step: number;
  teamId: "A" | "B";
  actionType: "ban" | "pick" | "side" | "decider";
  mapId?: string;
  side?: Side;
  description: string;
}

export interface MapBanStep {
  step: number;
  teamId: "A" | "B";
  actionType: "ban" | "pick" | "side" | "decider";
  mapId?: string;
  side?: Side;
  completed: boolean;
  description: string;
}

export interface PickedMap {
  mapId: string;
  pickedBy: "A" | "B" | "decider";
  side?: Side;
  sideChosenBy?: "A" | "B";
  order: number;
}

export interface MapBanState {
  currentStep: number;
  steps: MapBanStep[];
  bannedMaps: string[];
  pickedMaps: PickedMap[];
  remainingMaps: string[];
  completed: boolean;
  currentAction?: MapBanStep;
  history: MapBanAction[];
}

export type LobbyStatus =
  | "creating"
  | "waiting_captain"
  | "captain_2_joined"
  | "draft_ready"
  | "draft_live"
  | "draft_completed"
  | "map_ban_ready"
  | "map_ban_live"
  | "completed";

export type CaptainRole = "captain_1" | "captain_2" | "spectator";
export type TeamId = "A" | "B";

export interface PlayerDraftPick {
  pickIndex: number;
  teamId: TeamId;
  player: Player;
}

export interface PlayerDraftState {
  picks: PlayerDraftPick[];
  currentPickIndex: number;
  firstPick: TeamId;
  pickOrder: TeamId[];
  totalPicks: number;
  completed: boolean;
}

export interface Team {
  id: "A" | "B";
  name: string;
  captain: Player;
  players: Player[];
}

export interface SeriesResult {
  format: MatchFormat;
  teamA: Team;
  teamB: Team;
  maps: PickedMap[];
  mapBanHistory: MapBanAction[];
  createdAt: string;
}

export interface Lobby {
  id: string;
  matchName: string;
  captain1: Player;
  captain2: Player;
  players: Player[];
  format: MatchFormat;
  mapPool: string[];
  status: LobbyStatus;
  teamA?: Team;
  teamB?: Team;
  draftState?: PlayerDraftState;
  mapBanState?: MapBanState;
  result?: SeriesResult;
  createdAt: string;
  shareLink: string;
}

export type CreateLobbyStep = 1 | 2 | 3 | 4 | 5;

export interface CreateLobbyState {
  step: CreateLobbyStep;
  matchName: string;
  captain1Name: string;
  captain2Name: string;
  players: Omit<Player, "id" | "isCaptain" | "captainOf">[];
  format: MatchFormat | null;
  mapPool: string[];
}
