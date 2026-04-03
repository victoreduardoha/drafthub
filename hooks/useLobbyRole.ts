"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CaptainRole } from "@/types";
import { useLobbyStore } from "@/store/lobbyStore";

const roleKey = (lobbyId: string) => `valolobby_role_${lobbyId}`;

export function useLobbyRole(lobbyId: string): CaptainRole {
  const searchParams = useSearchParams();
  const activeLobbyId = useLobbyStore((s) => s.activeLobbyId);
  const [role, setRole] = useState<CaptainRole>("spectator");

  useEffect(() => {
    const joinParam = searchParams.get("join");

    // Explicit URL param takes priority — saves to localStorage for future visits
    if (joinParam === "captain_2") {
      localStorage.setItem(roleKey(lobbyId), "captain_2");
      setRole("captain_2");
      return;
    }

    if (joinParam === "captain_1") {
      localStorage.setItem(roleKey(lobbyId), "captain_1");
      setRole("captain_1");
      return;
    }

    // Check persisted role
    const stored = localStorage.getItem(roleKey(lobbyId));
    if (stored === "captain_1" || stored === "captain_2") {
      setRole(stored);
      return;
    }

    // If this tab created the lobby (activeLobbyId matches), they are captain 1
    if (activeLobbyId === lobbyId) {
      localStorage.setItem(roleKey(lobbyId), "captain_1");
      setRole("captain_1");
      return;
    }

    setRole("spectator");
  }, [lobbyId, searchParams, activeLobbyId]);

  return role;
}

// Helper: build the captain-2 share URL, embedding a lobby snapshot so the
// recipient can hydrate their localStorage even on a different device.
export function getCaptain2Link(lobbyId: string, lobbySnapshot?: object): string {
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}/lobby/${lobbyId}?join=captain_2`
      : `/lobby/${lobbyId}?join=captain_2`;

  if (!lobbySnapshot) return base;

  try {
    // encodeURIComponent handles Unicode characters in nicknames / map names
    const encoded = btoa(encodeURIComponent(JSON.stringify(lobbySnapshot)));
    // encodeURIComponent is required: btoa output contains '+' which URLSearchParams
    // treats as a space, corrupting the base64 before atob() can decode it.
    return `${base}&state=${encodeURIComponent(encoded)}`;
  } catch {
    return base;
  }
}
