"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">

      {/* Deep background */}
      <div className="absolute inset-0 bg-[#030305]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-100" />

      {/* Radial fade over grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_30%,#030305_100%)]" />

      {/* Orange atmospheric glow — top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-orange-500/10 blur-[90px] rounded-full pointer-events-none" />

      {/* Subtle side flares */}
      <div className="absolute top-1/3 -left-32 w-[300px] h-[500px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[300px] h-[500px] bg-amber-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Top edge line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      {/* NAV */}
      <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 sm:px-10 py-5 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Crosshair className="w-4 h-4 text-orange-400" />
          </div>
          <span className="font-black text-[#f0ece3] tracking-tight text-sm">DraftHub</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push("/create")}>
          Criar Lobby
        </Button>
      </nav>

      {/* HERO CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/[0.06] text-orange-400 text-[11px] font-semibold uppercase tracking-[0.14em] mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Custom Match Organizer · Valorant
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(44px,9vw,96px)] font-black leading-[0.88] tracking-[-0.03em] mb-6"
        >
          <span className="block text-[#f0ece3]">ORGANIZE</span>
          <span className="block gradient-text text-glow-orange">SUA PARTIDA</span>
          <span className="block text-[#f0ece3]">EM MINUTOS</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-[#8a8f9e] text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          Crie lobbies, monte times, execute o map ban completo e gere partidas
          personalizadas com uma experiência de plataforma premium.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button size="xl" onClick={() => router.push("/create")} className="group animate-pulse-glow">
            Criar Lobby Agora
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="secondary" size="xl" onClick={() =>
            document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
          }>
            Ver como funciona
          </Button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-16 flex items-center justify-center gap-8 sm:gap-14"
        >
          {[
            { value: "10", label: "Jogadores" },
            { value: "MD1·3·5", label: "Formatos" },
            { value: "12", label: "Mapas" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-lg sm:text-2xl font-black text-[#f0ece3] tracking-tight">{s.value}</p>
              <p className="text-[11px] text-[#3d4154] uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030305] to-transparent pointer-events-none" />

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-orange-500/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
