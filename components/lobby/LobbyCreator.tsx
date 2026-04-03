"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Crosshair } from "lucide-react";
import { StepIndicator } from "./StepIndicator";
import { Step1LobbyInfo } from "./Step1LobbyInfo";
import { Step2Players } from "./Step2Players";
import { Step3Format } from "./Step3Format";
import { Step4MapPool } from "./Step4MapPool";
import { useLobbyStore } from "@/store/lobbyStore";
import { useToast } from "@/components/ui/Toast";
import { CreateLobbyState, MatchFormat } from "@/types";

const STEPS = [
  { number: 1, label: "Lobby" },
  { number: 2, label: "Jogadores" },
  { number: 3, label: "Formato" },
  { number: 4, label: "Map Pool" },
];

const initial: CreateLobbyState = {
  step: 1, matchName: "", captain1Name: "", captain2Name: "",
  players: [], format: null, mapPool: [],
};

export function LobbyCreator() {
  const router = useRouter();
  const createLobby = useLobbyStore((s) => s.createLobby);
  const { toast } = useToast();
  const [state, setState] = useState<CreateLobbyState>(initial);
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: unknown) =>
    setState((p) => ({ ...p, [field]: value }));

  const handleCreate = () => {
    if (!state.format) return;
    setLoading(true);
    setTimeout(() => {
      const id = createLobby({
        matchName: state.matchName,
        captain1Name: state.captain1Name,
        captain2Name: state.captain2Name,
        players: (state.players as Array<{ nickname: string; name?: string; elo?: string; kd?: string }>).map((p) => ({
          nickname: p.nickname,
          name: p.name || undefined,
          elo: (p.elo as never) || undefined,
          kd: p.kd ? parseFloat(p.kd) : undefined,
        })),
        format: state.format!,
        mapPool: state.mapPool,
      });
      toast("Lobby criado!", "success");
      router.push(`/lobby/${id}`);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030305]">
      {/* Grid bg */}
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,transparent_40%,#030305_100%)] pointer-events-none" />

      {/* Nav */}
      <div className="relative z-20 border-b border-white/[0.04] px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#3d4154] hover:text-[#f0ece3] transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
              <Crosshair className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <span className="font-black text-sm text-[#f0ece3]">DraftHub</span>
          </button>
          <span className="text-[11px] text-[#2a2e3a] uppercase tracking-widest">Criar Lobby</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 px-4 py-10">
        <div className="max-w-xl mx-auto space-y-8">
          <StepIndicator steps={STEPS} current={state.step} />

          {/* Panel */}
          <div className="relative rounded-2xl border border-white/[0.06] bg-[#0c0e13] overflow-hidden">
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/35 to-transparent" />
            {/* Radial inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-orange-500/[0.04] blur-[40px] rounded-full pointer-events-none" />

            <div className="relative p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {state.step === 1 && (
                  <Step1LobbyInfo key="s1"
                    matchName={state.matchName} captain1Name={state.captain1Name} captain2Name={state.captain2Name}
                    onChange={update} onNext={() => update("step", 2)} />
                )}
                {state.step === 2 && (
                  <Step2Players key="s2"
                    captain1Name={state.captain1Name} captain2Name={state.captain2Name}
                    players={state.players as never}
                    onChange={(p) => update("players", p)}
                    onNext={() => update("step", 3)} onBack={() => update("step", 1)} />
                )}
                {state.step === 3 && (
                  <Step3Format key="s3"
                    format={state.format}
                    onChange={(f: MatchFormat) => update("format", f)}
                    onNext={() => update("step", 4)} onBack={() => update("step", 2)} />
                )}
                {state.step === 4 && state.format && (
                  <Step4MapPool key="s4"
                    format={state.format} mapPool={state.mapPool}
                    onChange={(m) => update("mapPool", m)}
                    onNext={handleCreate} onBack={() => update("step", 3)} />
                )}
              </AnimatePresence>
            </div>

            {/* Loading overlay */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 bg-[#0c0e13]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#8a8f9e]">Criando lobby...</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
