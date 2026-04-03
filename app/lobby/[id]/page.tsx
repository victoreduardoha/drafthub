"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToastProvider } from "@/components/ui/Toast";
import { MatchRoom } from "@/components/room/MatchRoom";
import { useLobbyStore } from "@/store/lobbyStore";
import { useLobbyRole } from "@/hooks/useLobbyRole";
import { useSearchParams } from "next/navigation";
import { saveLobbyToDb, fetchLobbyFromDb } from "@/lib/lobby-api";
import { Lobby } from "@/types";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

// ── Inner component (needs useSearchParams via useLobbyRole) ─────────────────

function LobbyPageInner({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getLobby    = useLobbyStore((s) => s.getLobby);
  const updateLobby = useLobbyStore((s) => s.updateLobby);
  const captain2Joined = useLobbyStore((s) => s.captain2Joined);
  const [mounted, setMounted] = useState(false);

  const role = useLobbyRole(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydrate lobby when it's missing from localStorage (Captain 2 on a different device).
  // Priority: 1) Supabase (authoritative, latest state)
  //           2) URL ?state= param (instant fallback while Supabase loads)
  useEffect(() => {
    if (!mounted) return;
    if (getLobby(id)) return; // already in local store

    // Fast fallback: decode lobby snapshot embedded in the share URL
    const stateParam = searchParams.get("state");
    if (stateParam) {
      try {
        const lobby = JSON.parse(decodeURIComponent(atob(stateParam))) as Lobby;
        updateLobby(lobby);
      } catch { /* malformed — ignore */ }
    }

    // Authoritative fetch: Supabase has the most up-to-date state
    fetchLobbyFromDb(id).then((lobby) => {
      if (lobby) updateLobby(lobby);
    });
  }, [mounted, id, searchParams, getLobby, updateLobby]);

  // When captain 2 opens the link, advance the lobby status and broadcast to captain 1
  useEffect(() => {
    if (!mounted || role !== "captain_2") return;
    const lobby = getLobby(id);
    if (!lobby || lobby.status !== "waiting_captain") return;

    captain2Joined(id);

    // Small delay to let Zustand persist the update before broadcasting
    setTimeout(() => {
      const updated = getLobby(id);
      if (updated) saveLobbyToDb(updated);
    }, 50);
  }, [mounted, role, id, getLobby, captain2Joined, broadcast]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const lobby = getLobby(id);

  if (!lobby) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-900/20 border border-red-900/30 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#e8eaf0]">Lobby não encontrado</h2>
            <p className="text-sm text-[#4a5568] mt-1">
              O lobby{" "}
              <code className="text-orange-400 font-mono">{id}</code> não existe ou foi removido.
            </p>
          </div>
          <Button onClick={() => router.push("/create")}>Criar Novo Lobby</Button>
          <br />
          <Button variant="ghost" onClick={() => router.push("/")}>
            ← Voltar ao início
          </Button>
        </motion.div>
      </div>
    );
  }

  return <MatchRoom lobby={lobby} role={role} />;
}

// ── Suspense wrapper required by useSearchParams ─────────────────────────────

function LobbyPageSuspended({ id }: { id: string }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
        </div>
      }
    >
      <LobbyPageInner id={id} />
    </Suspense>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LobbyPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <ToastProvider>
      <LobbyPageSuspended id={id} />
    </ToastProvider>
  );
}
