"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { PlusCircle, Users, Swords, Map, Trophy } from "lucide-react";

const steps = [
  {
    icon: PlusCircle,
    n: "01",
    title: "Crie o Lobby",
    desc: "Defina o nome, insira os capitães e gere um link único para compartilhar.",
    color: "text-orange-400",
    border: "border-orange-500/15",
    bg: "bg-orange-500/[0.07]",
    glow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.08)] hover:border-orange-500/25",
  },
  {
    icon: Users,
    n: "02",
    title: "Cadastre os Jogadores",
    desc: "Adicione os 8 jogadores com nickname, elo e K/D. Roster completo de 10.",
    color: "text-amber-400",
    border: "border-amber-500/15",
    bg: "bg-amber-500/[0.07]",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.08)] hover:border-amber-500/25",
  },
  {
    icon: Swords,
    n: "03",
    title: "Monte os Times",
    desc: "Os capitães dividem os jogadores. Cada time com 5 players.",
    color: "text-rose-400",
    border: "border-rose-500/15",
    bg: "bg-rose-500/[0.07]",
    glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.08)] hover:border-rose-500/25",
  },
  {
    icon: Map,
    n: "04",
    title: "Map Ban",
    desc: "Fluxo completo de veto passo a passo para MD1, MD3 ou MD5.",
    color: "text-violet-400",
    border: "border-violet-500/15",
    bg: "bg-violet-500/[0.07]",
    glow: "hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] hover:border-violet-500/25",
  },
  {
    icon: Trophy,
    n: "05",
    title: "Resultado Final",
    desc: "Tela premium com mapas, lados e histórico completo do veto.",
    color: "text-emerald-400",
    border: "border-emerald-500/15",
    bg: "bg-emerald-500/[0.07]",
    glow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.08)] hover:border-emerald-500/25",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="relative py-28 px-4 bg-[#030305]">
      {/* Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-500/70 mb-3">
            Como funciona
          </p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#f0ece3] leading-tight">
            DO LOBBY AO <span className="gradient-text">MAP BAN</span>
            <br />
            EM 5 ETAPAS
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.09 }}
              className={`group relative p-5 rounded-2xl border bg-[#0c0e13] transition-all duration-300 cursor-default ${s.border} ${s.glow}`}
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-[10px] font-mono text-[#2a2e3a]">{s.n}</span>

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${s.bg} ${s.border}`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} style={{ width: 18, height: 18 }} />
              </div>

              <h3 className="font-bold text-[#f0ece3] text-sm mb-1.5">{s.title}</h3>
              <p className="text-[12px] text-[#4a5060] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
