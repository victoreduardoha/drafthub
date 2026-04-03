"use client";

import { motion } from "framer-motion";
import { Swords } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { MatchFormat } from "@/types";

const formats = [
  { id: "MD1" as MatchFormat, label: "Melhor de 1", desc: "Uma única partida decide o vencedor.", maps: 7, details: "5 bans · 1 pick pelo Time B" },
  { id: "MD3" as MatchFormat, label: "Melhor de 3", desc: "Série de até 3 mapas. Quem vencer 2 vence.", maps: 7, details: "2 bans · 2 picks · 1 decider" },
  { id: "MD5" as MatchFormat, label: "Melhor de 5", desc: "Série completa de até 5 mapas.", maps: 7, details: "2 bans · 4 picks · 1 decider" },
];

interface Step3Props {
  format: MatchFormat | null;
  onChange: (f: MatchFormat) => void;
  onNext: () => void; onBack: () => void;
}

export function Step3Format({ format, onChange, onNext, onBack }: Step3Props) {
  return (
    <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-16 }} className="space-y-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center shrink-0">
          <Swords className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#f0ece3]">Formato da Série</h2>
          <p className="text-[12px] text-[#3d4154]">Escolha como a série vai funcionar</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {formats.map((f) => {
          const sel = format === f.id;
          return (
            <motion.button key={f.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => onChange(f.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-200",
                sel
                  ? "border-orange-500/30 bg-orange-500/[0.05] shadow-[0_0_20px_rgba(249,115,22,0.08)]"
                  : "border-white/[0.05] bg-[#07080c] hover:border-orange-500/15 hover:bg-orange-500/[0.02]"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Radio */}
                <div className={cn("w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  sel ? "border-orange-500 bg-orange-500" : "border-white/[0.12]"
                )} style={{ width: 18, height: 18 }}>
                  {sel && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-baseline gap-2.5">
                    <span className={cn("text-xl font-black", sel ? "text-orange-400" : "text-[#f0ece3]")}>{f.id}</span>
                    <span className="text-xs font-semibold text-[#8a8f9e]">{f.label}</span>
                  </div>
                  <p className="text-[12px] text-[#3d4154] mt-0.5">{f.desc}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10px] text-[#2a2e3a]">{f.maps} mapas no pool</p>
                  <p className="text-[10px] text-[#2a2e3a] mt-0.5">{f.details}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button variant="secondary" size="lg" onClick={onBack}>← Voltar</Button>
        <Button size="lg" onClick={onNext} disabled={!format}>Próximo →</Button>
      </div>
    </motion.div>
  );
}
