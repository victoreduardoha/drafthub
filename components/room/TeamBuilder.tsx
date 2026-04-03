"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ELO_BG_COLORS } from "@/lib/utils";
import { Player, Team } from "@/types";

interface TeamBuilderProps {
  captain1: Player; captain2: Player; otherPlayers: Player[];
  onConfirm: (a: Team, b: Team) => void;
}

export function TeamBuilder({ captain1, captain2, otherPlayers, onConfirm }: TeamBuilderProps) {
  const [teamA, setTeamA] = useState<Player[]>([captain1]);
  const [teamB, setTeamB] = useState<Player[]>([captain2]);
  const [pool, setPool] = useState<Player[]>(otherPlayers);

  const addTo = (p: Player, t: "A"|"B") => {
    if (t==="A"&&teamA.length>=5||t==="B"&&teamB.length>=5) return;
    setPool(prev=>prev.filter(x=>x.id!==p.id));
    t==="A" ? setTeamA(prev=>[...prev,{...p,teamId:"A"}]) : setTeamB(prev=>[...prev,{...p,teamId:"B"}]);
  };
  const removeFrom = (p: Player, t: "A"|"B") => {
    if (p.isCaptain) return;
    t==="A" ? setTeamA(prev=>prev.filter(x=>x.id!==p.id)) : setTeamB(prev=>prev.filter(x=>x.id!==p.id));
    setPool(prev=>[...prev,p]);
  };

  const ready = teamA.length===5 && teamB.length===5;

  const confirm = () => {
    if (!ready) return;
    onConfirm(
      { id:"A", name:"Time A", captain:captain1, players:teamA.map(p=>({...p,teamId:"A" as const})) },
      { id:"B", name:"Time B", captain:captain2, players:teamB.map(p=>({...p,teamId:"B" as const})) }
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/[0.06] border border-violet-500/15">
          <Users className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400">Montagem dos Times</span>
        </div>
        <p className="text-[12px] text-[#3d4154]">Distribua os jogadores. Cada time precisa de 5.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Team A */}
        <TeamCol id="A" players={teamA} onRemove={p=>removeFrom(p,"A")} />

        {/* Pool */}
        <div className="space-y-2">
          <p className="text-center text-[11px] font-semibold text-[#8a8f9e] uppercase tracking-wider">
            Disponíveis ({pool.length})
          </p>
          <div className="min-h-[180px] space-y-1.5">
            <AnimatePresence mode="popLayout">
              {pool.map(p=>(
                <motion.div key={p.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.9 }}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-white/[0.05] bg-[#07080c]">
                  <div className="w-7 h-7 rounded-full bg-[#111318] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-[#3d4154] shrink-0">
                    {p.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#f0ece3] truncate">{p.nickname}</p>
                    {p.elo && <span className={`text-[9px] px-1 py-0.5 rounded font-medium ${ELO_BG_COLORS[p.elo]||""}`}>{p.elo}</span>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={()=>addTo(p,"A")} disabled={teamA.length>=5}
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      A
                    </button>
                    <button onClick={()=>addTo(p,"B")} disabled={teamB.length>=5}
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      B
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {pool.length===0 && <p className="text-center text-[11px] text-[#2a2e3a] pt-8">Todos distribuídos</p>}
          </div>
        </div>

        {/* Team B */}
        <TeamCol id="B" players={teamB} onRemove={p=>removeFrom(p,"B")} />
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={confirm} disabled={!ready}>
          {ready ? <><Check className="w-4 h-4" /> Confirmar Times</> : `${10-teamA.length-teamB.length} jogador(es) sem time`}
        </Button>
      </div>
    </div>
  );
}

function TeamCol({ id, players, onRemove }: { id:"A"|"B"; players:Player[]; onRemove:(p:Player)=>void }) {
  const isA = id==="A";
  return (
    <div className={`rounded-xl border p-3.5 space-y-2 ${isA?"border-orange-500/15 bg-orange-500/[0.03]":"border-amber-500/15 bg-amber-500/[0.03]"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${isA?"bg-orange-500 text-white":"bg-amber-500 text-black"}`}>{id}</div>
          <span className="text-xs font-bold text-[#f0ece3]">Time {id}</span>
        </div>
        <span className={`text-[10px] font-mono font-bold ${isA?"text-orange-400":"text-amber-400"}`}>{players.length}/5</span>
      </div>

      <div className="space-y-1.5 min-h-[160px]">
        <AnimatePresence mode="popLayout">
          {players.map(p=>(
            <motion.div key={p.id} initial={{ opacity:0, x: isA?-8:8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x: isA?-8:8 }}
              className="flex items-center gap-2 p-2 rounded-lg bg-[#07080c]/60">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${isA?"bg-orange-500/15 text-orange-400":"bg-amber-500/15 text-amber-400"}`}>
                {p.nickname.charAt(0).toUpperCase()}
              </div>
              <p className="flex-1 text-[11px] font-medium text-[#f0ece3] truncate">{p.nickname}</p>
              {p.isCaptain
                ? <Badge variant={isA?"orange":"amber"} size="sm">CAP</Badge>
                : <button onClick={()=>onRemove(p)} className="text-[#2a2e3a] hover:text-red-400 text-xs transition-colors">✕</button>
              }
            </motion.div>
          ))}
        </AnimatePresence>
        {Array.from({length:5-players.length}).map((_,i)=>(
          <div key={i} className={`h-8 rounded-lg border border-dashed opacity-15 ${isA?"border-orange-500":"border-amber-500"}`} />
        ))}
      </div>
    </div>
  );
}
