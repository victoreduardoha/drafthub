import { supabase } from "@/lib/supabase";
import { Lobby } from "@/types";

/**
 * Persist the entire lobby state to Supabase.
 * Uses upsert so it works for both creation and updates.
 */
export async function saveLobbyToDb(lobby: Lobby): Promise<void> {
  const { error } = await supabase
    .from("lobbies")
    .upsert({ id: lobby.id, data: lobby });

  if (error) console.error("[lobby-api] saveLobbyToDb:", error.message);
}

/**
 * Fetch a lobby snapshot from Supabase.
 * Returns null if the lobby doesn't exist yet.
 */
export async function fetchLobbyFromDb(id: string): Promise<Lobby | null> {
  const { data, error } = await supabase
    .from("lobbies")
    .select("data")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data.data as Lobby;
}
