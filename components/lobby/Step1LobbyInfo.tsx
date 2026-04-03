"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, User, Users } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface Step1Props {
  matchName: string; captain1Name: string; captain2Name: string;
  onChange: (f: string, v: string) => void; onNext: () => void;
}

export function Step1LobbyInfo({ matchName, captain1Name, captain2Name, onChange, onNext }: Step1Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!matchName.trim()) e.matchName = "Obrigatório";
    if (!captain1Name.trim()) e.captain1Name = "Obrigatório";
    if (!captain2Name.trim()) e.captain2Name = "Obrigatório";
    if (captain1Name.trim() && captain2Name.trim() &&
        captain1Name.trim().toLowerCase() === captain2Name.trim().toLowerCase())
      e.captain2Name = "Nicknames devem ser diferentes";
    setErrors(e);
    return !Object.keys(e).length;
  };

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-7">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center shrink-0">
          <Crosshair className="w-4 h-4 text-orange-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#f0ece3]">Dados do Lobby</h2>
          <p className="text-[12px] text-[#3d4154]">Configure o nome e os capitães da partida</p>
        </div>
      </div>

      {/* Match name */}
      <div>
        <Input label="Nome da Partida" placeholder="ex: Champions Scrimmage #1"
          value={matchName} onChange={(e) => onChange("matchName", e.target.value)}
          error={errors.matchName} icon={<Crosshair className="w-3.5 h-3.5" />} maxLength={40} />
        <div className="flex justify-end mt-1">
          <span className="text-[10px] text-[#2a2e3a]">{matchName.length}/40</span>
        </div>
      </div>

      {/* Captains */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Team A */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-orange-500/15 bg-orange-500/[0.05]">
            <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center text-[8px] font-black text-white">A</div>
            <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-wider">Time A</span>
          </div>
          <Input label="Capitão 1" placeholder="Nickname#TAG" value={captain1Name}
            onChange={(e) => onChange("captain1Name", e.target.value)}
            error={errors.captain1Name} icon={<User className="w-3.5 h-3.5" />} maxLength={24} />
        </div>
        {/* Team B */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-500/15 bg-amber-500/[0.05]">
            <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[8px] font-black text-black">B</div>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Time B</span>
          </div>
          <Input label="Capitão 2" placeholder="Nickname#TAG" value={captain2Name}
            onChange={(e) => onChange("captain2Name", e.target.value)}
            error={errors.captain2Name} icon={<User className="w-3.5 h-3.5" />} maxLength={24} />
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-white/[0.05] bg-[#07080c]">
        <Users className="w-4 h-4 text-[#3d4154] mt-0.5 shrink-0" />
        <p className="text-[12px] text-[#4a5060] leading-relaxed">
          Os capitães fazem parte do time. Você cadastrará os outros{" "}
          <span className="text-[#8a8f9e] font-medium">8 jogadores</span> na próxima etapa.
        </p>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={() => validate() && onNext()}>Próximo →</Button>
      </div>
    </motion.div>
  );
}
