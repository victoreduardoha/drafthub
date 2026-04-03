"use client";

import { useEffect, useRef, useCallback } from "react";
import { Lobby } from "@/types";
import { useLobbyStore } from "@/store/lobbyStore";
import { supabase } from "@/lib/supabase";
import { saveLobbyToDb } from "@/lib/lobby-api";

/**
 * Subscribes to Supabase Realtime for the given lobby.
 * Any INSERT or UPDATE on the lobbies table (for this lobby ID) is applied
 * directly to the local Zustand store — keeping every connected device in sync.
 *
 * Returns a `broadcast(lobby)` function that persists the updated lobby to
 * Supabase, which in turn triggers the Realtime event on all other devices.
 */
export function useLobbySync(lobbyId: string) {
  const updateLobby = useLobbyStore((s) => s.updateLobby);
  // Prevents applying a Realtime event that we ourselves just triggered
  const isSaving = useRef(false);

  useEffect(() => {
    const channel = supabase
      .channel(`lobby-${lobbyId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT + UPDATE
          schema: "public",
          table: "lobbies",
          filter: `id=eq.${lobbyId}`,
        },
        (payload) => {
          // Ignore echo from our own write
          if (isSaving.current) return;
          const incoming = (payload.new as { data: Lobby }).data;
          if (incoming) updateLobby(incoming);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobbyId, updateLobby]);

  /**
   * Call this after every store mutation to persist + broadcast to other devices.
   * Fire-and-forget — errors are logged but never block the UI.
   */
  const broadcast = useCallback(async (lobby: Lobby) => {
    isSaving.current = true;
    await saveLobbyToDb(lobby);
    // Small delay so our own Realtime echo arrives while the flag is still set
    setTimeout(() => { isSaving.current = false; }, 300);
  }, []);

  return { broadcast };
}
