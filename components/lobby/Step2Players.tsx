"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, User, ChevronDown, Gamepad2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ELO_BG_COLORS } from "@/lib/utils";
import { Elo } from "@/types";

const ELO_LIST: Elo[] = ["Iron","Bronze","Silver","Gold","Platinum","Diamond","Ascendant","Immortal","Radiant"];
interface PlayerForm { nickname: string; name: string; elo: Elo | ""; kd: string; }
const blank = (): PlayerForm => ({ nickname: "", name: "", elo: "", kd: "" });

interface Step2Props {
  captain1Name: string; captain2Name: string; players: PlayerForm[];
  onChange: (p: PlayerForm[]) => void; onNext: () => void; onBack: () => void;
}

export function Step2Players({ captain1Name, captain2Name, players, onChange, onNext, onBack }: Step2Props) {
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const add = () => { if (players.length >= 8) return; onChange([...players, blank()]); setExpanded(players.length); };
  const remove = (i: number) => { onChange(players.filter((_,j)=>j!==i)); if (expanded===i) setExpanded(null); };
  const update = (i: number, f: keyof PlayerForm, v: string) => {
    const u=[...players]; u[i]={...u[i],[f]:v}; onChange(u);
  };

  const validate = () => {
    if (players.length<8) { setError(`Adicione mais ${8-players.length} jogador(es).`); return false; }
    if (players.some(p=>!p.nickname.trim())) { setError("Todos precisam de nickname."); return false; }
    const all=[captain1Name,captain2Name,...players.map(p=>p.nickname.trim())].map(s=>s.toLowerCase());
    if (new Set(all).size!==all.length) { setError("Nicknames devem ser únicos."); return false; }
    setError(""); return true;
  };

  const pct = (players.length/8)*100;

  return (
    <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center shrink-0">
          <Gamepad2 className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#f0ece3]">Jogadores</h2>
          <p className="text-[12px] text-[#3d4154]">Cadastre os {Math.max(0,8-players.length)} jogadores restantes</p>
        </div>
      </div>

      {/* Captain cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {[{n:captain1Name,t:"A",c:"orange"},{n:captain2Name,t:"B",c:"amber"}].map(cap=>(
          <div key={cap.t} className={`flex items-center gap-2.5 p-2.5 rounded-xl border ${
            cap.c==="orange" ? "border-orange-500/15 bg-orange-500/[0.05]" : "border-amber-500/15 bg-amber-500/[0.05]"}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${
              cap.c==="orange" ? "bg-orange-500 text-white" : "bg-amber-500 text-black"}`}>{cap.t}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#3d4154]">Capitão</p>
              <p className="text-xs font-semibold text-[#f0ece3] truncate">{cap.n}</p>
            </div>
            <Badge variant={cap.c==="orange"?"orange":"amber"}>CAP</Badge>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-[#111318] rounded-full overflow-hidden">
          <motion.div className="h-full bg-orange-500 rounded-full" animate={{ width:`${pct}%` }} transition={{ duration: 0.3 }} />
        </div>
        <span className="text-[10px] font-mono text-[#3d4154] shrink-0">{players.length}/8</span>
      </div>

      {/* Players */}
      <div className="space-y-1.5">
        <AnimatePresence mode="popLayout">
          {players.map((p,i)=>(
            <motion.div key={i} initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
              className="rounded-xl border border-white/[0.05] bg-[#07080c] overflow-hidden">
              {/* Row */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                onClick={()=>setExpanded(expanded===i?null:i)}>
                <div className="w-6 h-6 rounded-md bg-[#111318] border border-white/[0.05] flex items-center justify-center shrink-0">
                  <User className="w-3 h-3 text-[#3d4154]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#f0ece3] truncate">{p.nickname||`Jogador ${i+1}`}</p>
                  {p.elo && <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${ELO_BG_COLORS[p.elo]||""}`}>{p.elo}</span>}
                </div>
                <button onClick={(e)=>{e.stopPropagation();remove(i);}}
                  className="p-1 rounded-lg hover:bg-red-950/30 text-[#2a2e3a] hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <ChevronDown className={`w-3.5 h-3.5 text-[#2a2e3a] transition-transform ${expanded===i?"rotate-180":""}`} />
              </div>
              {/* Expanded */}
              <AnimatePresence>
                {expanded===i && (
                  <motion.div initial={{ height:0,opacity:0 }} animate={{ height:"auto",opacity:1 }} exit={{ height:0,opacity:0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-white/[0.04]">
                    <div className="p-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input label="Nickname *" placeholder="Nick#TAG" value={p.nickname} onChange={e=>update(i,"nickname",e.target.value)} maxLength={24} />
                        <Input label="Nome (opcional)" placeholder="Nome real" value={p.name} onChange={e=>update(i,"name",e.target.value)} maxLength={32} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-semibold text-[#8a8f9e] uppercase tracking-widest">Elo (opcional)</label>
                          <select value={p.elo} onChange={e=>update(i,"elo",e.target.value)}
                            className="w-full bg-[#07080c] border border-white/[0.06] rounded-xl px-3 py-2.5 text-xs text-[#f0ece3] focus:outline-none focus:border-orange-500/30">
                            <option value="">—</option>
                            {ELO_LIST.map(e=><option key={e} value={e}>{e}</option>)}
                          </select>
                        </div>
                        <Input label="K/D (opcional)" placeholder="1.25" type="number" step="0.01" min="0" max="99"
                          value={p.kd} onChange={e=>update(i,"kd",e.target.value)} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add */}
      {players.length<8 && (
        <button onClick={add}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/[0.06] hover:border-orange-500/25 hover:bg-orange-500/[0.03] text-[#3d4154] hover:text-orange-400 text-xs font-medium transition-all duration-200">
          <Plus className="w-3.5 h-3.5" /> Adicionar Jogador ({players.length}/8)
        </button>
      )}

      {error && (
        <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
          className="text-xs text-red-400 bg-red-950/20 border border-red-900/20 rounded-xl px-4 py-3">
          {error}
        </motion.p>
      )}

      <div className="flex justify-between pt-1">
        <Button variant="secondary" size="lg" onClick={onBack}>← Voltar</Button>
        <Button size="lg" onClick={()=>validate()&&onNext()}>Próximo →</Button>
      </div>
    </motion.div>
  );
}
