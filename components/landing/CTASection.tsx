"use client";

import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  const router = useRouter();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 px-4 bg-[#030305]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />

      <div className="max-w-3xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl border border-orange-500/10 bg-[#0c0e13] overflow-hidden p-12 text-center"
        >
          {/* Orange top line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

          {/* Central glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(249,115,22,0.06),transparent)]" />

          {/* Corner marks */}
          {["top-4 left-4 border-l border-t", "top-4 right-4 border-r border-t", "bottom-4 left-4 border-l border-b", "bottom-4 right-4 border-r border-b"].map((c, i) => (
            <div key={i} className={`absolute ${c} border-orange-500/15 w-5 h-5 rounded-sm`} />
          ))}

          <div className="relative space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-500/70">
              Pronto para jogar
            </p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#f0ece3] leading-tight">
              COMECE SUA<br />
              <span className="gradient-text">PARTIDA AGORA</span>
            </h2>
            <p className="text-[#4a5060] max-w-sm mx-auto text-sm">
              Sem cadastro. Sem complicação. Crie um lobby completo em menos de 2 minutos.
            </p>
            <div className="pt-2">
              <Button size="xl" onClick={() => router.push("/create")} className="group">
                Criar Lobby
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
