"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import {
  Lobby,
  Player,
  MatchFormat,
  Side,
  LobbyStatus,
  PlayerDraftState,
} from "@/types";
import {
  initMapBanState,
  processBan,
  processPick,
  processSideChoice,
} from "@/lib/mapban";
import {
  initPlayerDraft,
  processDraftPick,
  buildTeamsFromDraft,
} from "@/lib/player-draft";
import { generateLobbyId, getLobbyShareLink } from "@/lib/utils";

interface LobbyStore {
  lobbies: Record<string, Lobby>;
  activeLobbyId: string | null;

  createLobby: (params: {
    matchName: string;
    captain1Name: string;
    captain2Name: string;
    players: Omit<Player, "id" | "isCaptain" | "captainOf">[];
    format: MatchFormat;
    mapPool: string[];
  }) => string;

  getLobby: (id: string) => Lobby | undefined;

  updateLobby: (lobby: Lobby) => void;

  setLobbyStatus: (lobbyId: string, status: LobbyStatus) => void;

  captain2Joined: (lobbyId: string) => void;

  startDraft: (lobbyId: string) => void;

  performDraftPick: (lobbyId: string, playerId: string) => void;

  finaliseDraft: (lobbyId: string) => void;

  startMapBan: (lobbyId: string) => void;

  performBan: (lobbyId: string, mapId: string, actorTeam: "A" | "B") => void;

  performPick: (lobbyId: string, mapId: string, actorTeam: "A" | "B") => void;

  performSideChoice: (lobbyId: string, side: Side, actorTeam: "A" | "B") => void;

  setActiveLobby: (id: string) => void;
}

export const useLobbyStore = create<LobbyStore>()(
  persist(
    (set, get) => ({
      lobbies: {},
      activeLobbyId: null,

      // ── Create ──────────────────────────────────────────────────────────────

      createLobby: ({ matchName, captain1Name, captain2Name, players, format, mapPool }) => {
        const id = generateLobbyId();
        const shareLink = getLobbyShareLink(id);

        const captain1: Player = {
          id: uuidv4(),
          nickname: captain1Name,
          isCaptain: true,
          captainOf: "A",
          teamId: undefined,
        };

        const captain2: Player = {
          id: uuidv4(),
          nickname: captain2Name,
          isCaptain: true,
          captainOf: "B",
          teamId: undefined,
        };

        const otherPlayers: Player[] = players.map((p) => ({
          ...p,
          id: uuidv4(),
          isCaptain: false,
        }));

        const lobby: Lobby = {
          id,
          matchName,
          captain1,
          captain2,
          players: [captain1, captain2, ...otherPlayers],
          format,
          mapPool,
          status: "waiting_captain",
          createdAt: new Date().toISOString(),
          shareLink,
        };

        set((state) => ({
          lobbies: { ...state.lobbies, [id]: lobby },
          activeLobbyId: id,
        }));

        return id;
      },

      // ── Read ────────────────────────────────────────────────────────────────

      getLobby: (id) => get().lobbies[id],

      // ── Sync — accepts an external snapshot (BroadcastChannel / Supabase) ──

      updateLobby: (lobby) => {
        set((state) => ({
          lobbies: { ...state.lobbies, [lobby.id]: lobby },
        }));
      },

      // ── Status ──────────────────────────────────────────────────────────────

      setLobbyStatus: (lobbyId, status) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby) return state;
          return {
            lobbies: { ...state.lobbies, [lobbyId]: { ...lobby, status } },
          };
        });
      },

      // ── Draft: Captain 2 joins ───────────────────────────────────────────────

      captain2Joined: (lobbyId) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby || lobby.status !== "waiting_captain") return state;
          return {
            lobbies: {
              ...state.lobbies,
              [lobbyId]: { ...lobby, status: "captain_2_joined" as LobbyStatus },
            },
          };
        });
      },

      // ── Draft: Captain 1 starts the draft ────────────────────────────────────

      startDraft: (lobbyId) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby) return state;
          const undraftedCount = lobby.players.filter((p) => !p.isCaptain).length;
          const draftState: PlayerDraftState = initPlayerDraft(undraftedCount);
          return {
            lobbies: {
              ...state.lobbies,
              [lobbyId]: {
                ...lobby,
                draftState,
                status: "draft_live" as LobbyStatus,
              },
            },
          };
        });
      },

      // ── Draft: pick a player ─────────────────────────────────────────────────

      performDraftPick: (lobbyId, playerId) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby?.draftState || lobby.status !== "draft_live") return state;

          const player = lobby.players.find((p) => p.id === playerId);
          if (!player) return state;

          const newDraft = processDraftPick(lobby.draftState, player);
          const newStatus: LobbyStatus = newDraft.completed ? "draft_completed" : "draft_live";

          return {
            lobbies: {
              ...state.lobbies,
              [lobbyId]: { ...lobby, draftState: newDraft, status: newStatus },
            },
          };
        });
      },

      // ── Draft: build teams from completed draft ───────────────────────────────

      finaliseDraft: (lobbyId) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby?.draftState?.completed) return state;

          const { teamA, teamB } = buildTeamsFromDraft(
            lobby.captain1,
            lobby.captain2,
            lobby.draftState
          );

          return {
            lobbies: {
              ...state.lobbies,
              [lobbyId]: {
                ...lobby,
                teamA,
                teamB,
                status: "map_ban_ready" as LobbyStatus,
              },
            },
          };
        });
      },

      // ── Map ban ──────────────────────────────────────────────────────────────

      startMapBan: (lobbyId) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby) return state;
          const mapBanState = initMapBanState(lobby.format, lobby.mapPool);
          return {
            lobbies: {
              ...state.lobbies,
              [lobbyId]: {
                ...lobby,
                mapBanState,
                status: "map_ban_live" as LobbyStatus,
              },
            },
          };
        });
      },

      performBan: (lobbyId, mapId, actorTeam) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby?.mapBanState) return state;
          const newBanState = processBan(lobby.mapBanState, mapId, actorTeam);
          return {
            lobbies: {
              ...state.lobbies,
              [lobbyId]: { ...lobby, mapBanState: newBanState },
            },
          };
        });
      },

      performPick: (lobbyId, mapId, actorTeam) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby?.mapBanState) return state;
          const newBanState = processPick(lobby.mapBanState, mapId, actorTeam);
          const newStatus: LobbyStatus = newBanState.completed ? "completed" : lobby.status;
          return {
            lobbies: {
              ...state.lobbies,
              [lobbyId]: { ...lobby, mapBanState: newBanState, status: newStatus },
            },
          };
        });
      },

      performSideChoice: (lobbyId, side, actorTeam) => {
        set((state) => {
          const lobby = state.lobbies[lobbyId];
          if (!lobby?.mapBanState) return state;
          const newBanState = processSideChoice(lobby.mapBanState, side, actorTeam);
          const newStatus: LobbyStatus = newBanState.completed ? "completed" : lobby.status;
          return {
            lobbies: {
              ...state.lobbies,
              [lobbyId]: { ...lobby, mapBanState: newBanState, status: newStatus },
            },
          };
        });
      },

      setActiveLobby: (id) => set({ activeLobbyId: id }),
    }),
    { name: "valorant-lobby-store" }
  )
);
