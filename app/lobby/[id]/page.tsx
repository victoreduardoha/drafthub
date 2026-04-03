"use client";

import { use, useEffect, useRef, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ToastProvider } from "@/components/ui/Toast";
import { MatchRoom } from "@/components/room/MatchRoom";
import { useLobbyStore } from "@/store/lobbyStore";
import { useLobbyRole } from "@/hooks/useLobbyRole";
import { useSearchParams } from "next/navigation";
import { saveLobbyToDb, fetchLobbyFromDb } from "@/lib/lobby-api";
import { Lobby, LobbyStatus } from "@/types";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Numeric order used to prevent downgrading lobby status on stale Supabase responses
const STATUS_ORDER: Record<LobbyStatus, number> = {
  creating: 0,
  waiting_captain: 1,
  captain_2_joined: 2,
  draft_ready: 3,
  draft_live: 4,
  draft_completed: 5,
  map_ban_ready: 6,
  map_ban_live: 7,
  completed: 8,
};

type LoadState = "loading" | "loaded" | "not_found" | "error";

// ── Inner component (needs useSearchParams via Suspense) ─────────────────────

function LobbyPageInner({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getLobby       = useLobbyStore((s) => s.getLobby);
  const updateLobby    = useLobbyStore((s) => s.updateLobby);
  const captain2Joined = useLobbyStore((s) => s.captain2Joined);

  const [mounted,   setMounted]   = useState(false);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  // Prevent double-execution of the join side-effect across re-renders
  const joinedRef = useRef(false);

  const role = useLobbyRole(id);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Phase 1: Resolve lobby ─────────────────────────────────────────────────
  // Order of priority:
  //   1. Local Zustand store (Captain 1 on their own device / returning visitor)
  //   2. URL ?state= snapshot (instant hydration for Captain 2, encoded in share link)
  //   3. Supabase (authoritative, most up-to-date)
  useEffect(() => {
    if (!mounted) return;

    // Already in local store — nothing to fetch
    if (getLobby(id)) {
      setLoadState("loaded");
      return;
    }

    // Fast path: decode lobby snapshot embedded in the share URL.
    // The snapshot lets the page render immediately while Supabase loads.
    const stateParam = searchParams.get("state");
    if (stateParam) {
      try {
        const lobby = JSON.parse(decodeURIComponent(atob(stateParam))) as Lobby;
        updateLobby(lobby);
      } catch { /* malformed param — ignore, Supabase will be the fallback */ }
    }

    // Authoritative fetch — Supabase always has the canonical state
    fetchLobbyFromDb(id)
      .then((fetchedLobby) => {
        if (fetchedLobby) {
          // Smart merge: never downgrade if the local state is already more advanced.
          // This prevents a race where captain2Joined fires before the fetch returns,
          // and then the stale Supabase record (still "waiting_captain") overwrites it.
          const current      = getLobby(id);
          const currentOrder = current ? (STATUS_ORDER[current.status] ?? 0) : -1;
          const fetchedOrder = STATUS_ORDER[fetchedLobby.status] ?? 0;
          if (fetchedOrder >= currentOrder) {
            updateLobby(fetchedLobby);
          }
          setLoadState("loaded");
        } else {
          // No record in Supabase — accept URL snapshot if it succeeded, else not found
          setLoadState(getLobby(id) ? "loaded" : "not_found");
        }
      })
      .catch(() => setLoadState("error"));
  }, [mounted, id, searchParams, getLobby, updateLobby]);

  // ── Phase 2: Captain 2 join — fires ONLY after lobby is confirmed loaded ───
  // This prevents the false-positive where Captain 1 sees "Captain 2 joined"
  // but Captain 2's page still shows "Lobby não encontrado".
  useEffect(() => {
    if (loadState !== "loaded") return;
    if (role !== "captain_2") return;
    if (joinedRef.current) return;

    const lobby = getLobby(id);
    if (!lobby || lobby.status !== "waiting_captain") return;

    joinedRef.current = true;
    captain2Joined(id);

    // Small delay so Zustand persists the update before broadcasting to Supabase
    setTimeout(() => {
      const updated = getLobby(id);
      if (updated) saveLobbyToDb(updated);
    }, 50);
  }, [loadState, role, id, getLobby, captain2Joined]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!mounted || loadState === "loading") {
    const message =
      role === "captain_2" ? "Conectando como Capitão 2..." : "Carregando lobby...";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-[#4a5568]">{message}</p>
      </div>
    );
  }

  if (loadState === "not_found" || loadState === "error") {
    const isError = loadState === "error";
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
            <h2 className="text-xl font-bold text-[#e8eaf0]">
              {isError ? "Erro ao carregar lobby" : "Lobby não encontrado"}
            </h2>
            <p className="text-sm text-[#4a5568] mt-1">
              {isError
                ? "Não foi possível conectar ao servidor. Tente novamente."
                : <>O lobby <code className="text-orange-400 font-mono">{id}</code> não existe ou foi removido.</>}
            </p>
          </div>
          {isError ? (
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          ) : (
            <Button onClick={() => router.push("/create")}>Criar Novo Lobby</Button>
          )}
          <br />
          <Button variant="ghost" onClick={() => router.push("/")}>
            ← Voltar ao início
          </Button>
        </motion.div>
      </div>
    );
  }

  const lobby = getLobby(id);

  // Transient state: loadState is "loaded" but Zustand hasn't propagated yet
  if (!lobby) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
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
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-500/40 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm text-[#4a5568]">Carregando lobby...</p>
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
