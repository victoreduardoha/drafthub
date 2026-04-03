"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { getAvailableMaps } from "@/config/maps";

export function MapShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const maps = getAvailableMaps();

  return (
    <section className="relative py-28 px-4 bg-[#030305] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-orange-600/[0.04] blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-500/70 mb-3">
            Map Pool
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-[#f0ece3] tracking-tight">
            12 MAPAS DISPONÍVEIS
          </h2>
          <p className="text-[#3d4154] mt-2 text-sm">Competitivo atual — selecione 7 para montar seu pool</p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {maps.map((map, i) => (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.07] cursor-default hover:border-orange-500/25 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              {/* Real image — no color overlays */}
              <Image
                src={map.image}
                alt={map.name}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                className="object-cover brightness-75 group-hover:brightness-90 group-hover:scale-[1.06] transition-all duration-600"
                onError={() => {}}
              />

              {/* Bottom gradient for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Hover: inner glow ring */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ring-1 ring-inset ring-orange-500/15" />

              {/* Map name */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-2.5 text-center">
                <p
                  className="text-[10px] font-black uppercase tracking-[0.12em] text-white/95 group-hover:text-orange-200 transition-colors"
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
                >
                  {map.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
