"use client";

import { useEffect, useRef, useCallback } from "react";
import { Lobby } from "@/types";
import { useLobbyStore } from "@/store/lobbyStore";

interface SyncMessage {
  type: "lobby_update";
  lobby: Lobby;
}

/**
 * Opens a BroadcastChannel for the given lobby so all tabs stay in sync.
 * Returns a `broadcast(lobby)` function — call it after any store mutation
 * to push the updated snapshot to other tabs.
 *
 * Structured for a future Supabase Realtime migration: replace the
 * BroadcastChannel subscription with a Supabase channel without changing
 * the public API of this hook.
 */
export function useLobbySync(lobbyId: string) {
  const updateLobby = useLobbyStore((s) => s.updateLobby);
  const channelRef = useRef<BroadcastChannel | null>(null);
  // Guard against echoing messages we just received
  const isApplyingRemote = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;

    const ch = new BroadcastChannel(`valolobby_${lobbyId}`);
    channelRef.current = ch;

    ch.onmessage = (event: MessageEvent<SyncMessage>) => {
      if (event.data?.type === "lobby_update") {
        isApplyingRemote.current = true;
        updateLobby(event.data.lobby);
        isApplyingRemote.current = false;
      }
    };

    return () => {
      ch.close();
      channelRef.current = null;
    };
  }, [lobbyId, updateLobby]);

  const broadcast = useCallback(
    (lobby: Lobby) => {
      if (channelRef.current && !isApplyingRemote.current) {
        const msg: SyncMessage = { type: "lobby_update", lobby };
        channelRef.current.postMessage(msg);
      }
    },
    []
  );

  return { broadcast };
}
