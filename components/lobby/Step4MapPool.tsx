"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Map, Check, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAvailableMaps, MAP_POOL_REQUIREMENTS } from "@/config/maps";
import { MatchFormat } from "@/types";

interface Step4Props {
  format: MatchFormat;
  mapPool: string[];
  onChange: (m: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4MapPool({ format, mapPool, onChange, onNext, onBack }: Step4Props) {
  const required = MAP_POOL_REQUIREMENTS[format];
  const sel = mapPool.length;
  const ready = sel === required;
  const pct = Math.min((sel / required) * 100, 100);

  const toggle = (id: string) => {
    if (mapPool.includes(id)) {
      onChange(mapPool.filter(m => m !== id));
      return;
    }
    if (sel < required) onChange([...mapPool, id]);
  };

  const selectionOrder = (id: string) => mapPool.indexOf(id) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.25 }}
      className="space-y-0"
    >
      {/* ── HEADER ─────────────────────────────────── */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center shrink-0">
            <Map className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#f0ece3] leading-tight">Map Pool</h2>
            <p className="text-[12px] text-[#3d4154]">
              Formato <span className="text-[#8a8f9e] font-semibold">{format}</span>
              {" · "}selecione <span className="text-[#f0ece3] font-semibold">{required}</span> mapas
            </p>
          </div>

          {/* Counter pill */}
          <div className={cn(
            "ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold font-mono transition-all duration-300",
            ready
              ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
              : "bg-[#111318] border-white/[0.06] text-[#8a8f9e]"
          )}>
            {ready && <CheckCircle2 className="w-3.5 h-3.5" />}
            <span>{sel}</span>
            <span className="text-[#3d4154]">/</span>
            <span>{required}</span>
          </div>
        </div>

        {/* ── SLOT INDICATORS ── */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: required }).map((_, i) => {
            const filled = i < sel;
            const mapId = mapPool[i];
            const map = filled ? getAvailableMaps().find(m => m.id === mapId) : null;
            return (
              <motion.div
                key={i}
                className={cn(
                  "relative flex-1 h-8 rounded-lg border overflow-hidden transition-all duration-300",
                  filled
                    ? "border-orange-500/40 bg-[#0c0e13]"
                    : "border-white/[0.05] bg-[#07080c]"
                )}
              >
                {/* Map image thumbnail when filled */}
                {filled && map && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={map.image}
                      alt={map.name}
                      fill
                      className="object-cover brightness-50"
                    />
                    <div className="absolute inset-0 bg-orange-500/10" />
                  </motion.div>
                )}

                {/* Fill bar for empty slots */}
                {!filled && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#2a2e3a]" />
                  </div>
                )}

                {/* Slot number */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn(
                    "text-[9px] font-black",
                    filled ? "text-orange-300/80" : "text-[#2a2e3a]"
                  )}>
                    {filled ? (map?.name.slice(0, 3).toUpperCase() ?? (i + 1)) : i + 1}
                  </span>
                </div>

                {/* Active slot pulse */}
                {i === sel && !ready && (
                  <motion.div
                    className="absolute inset-0 border border-orange-500/30 rounded-lg"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── PROGRESS BAR ── */}
        <div className="relative h-1 bg-[#111318] rounded-full overflow-hidden">
          <motion.div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              ready ? "bg-emerald-400" : "bg-gradient-to-r from-orange-600 to-orange-400"
            )}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {/* Glow on progress bar */}
          {!ready && sel > 0 && (
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-orange-300/40 blur-sm"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          )}
        </div>
      </div>

      {/* ── MAP GRID ───────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {getAvailableMaps().map((map, i) => {
          const isSel = mapPool.includes(map.id);
          const disabled = !isSel && sel >= required;
          const order = selectionOrder(map.id);

          return (
            <motion.button
              key={map.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.035, duration: 0.3 }}
              whileHover={!disabled ? { y: -4, scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.97 } : {}}
              onClick={() => toggle(map.id)}
              disabled={disabled}
              className={cn(
                "relative aspect-[3/4] rounded-2xl overflow-hidden group focus:outline-none",
                "transition-shadow duration-300",
                isSel
                  ? "shadow-[0_0_0_2px_rgba(249,115,22,0.7),0_0_24px_rgba(249,115,22,0.25),0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer"
                  : disabled
                  ? "opacity-35 cursor-not-allowed shadow-none"
                  : "shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_0_1px_rgba(249,115,22,0.35),0_0_20px_rgba(249,115,22,0.12),0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer"
              )}
            >
              {/* ── MAP IMAGE ── */}
              <Image
                src={map.image}
                alt={map.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                priority={i < 6}
                className={cn(
                  "object-cover transition-all duration-500",
                  isSel
                    ? "brightness-[0.85] scale-[1.06]"
                    : disabled
                    ? "brightness-[0.3] saturate-0"
                    : "brightness-[0.72] group-hover:brightness-[0.88] group-hover:scale-[1.05]"
                )}
                onError={() => {}}
              />

              {/* ── SCRIM — text legibility only ── */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* ── SELECTED: top glow line ── */}
              <AnimatePresence>
                {isSel && (
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-orange-400 to-transparent origin-center"
                  />
                )}
              </AnimatePresence>

              {/* ── SELECTED: check badge ── */}
              <AnimatePresence>
                {isSel && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-orange-500 border-2 border-white/25 flex items-center justify-center"
                    style={{ boxShadow: "0 0 14px rgba(249,115,22,0.7), 0 2px 6px rgba(0,0,0,0.5)" }}
                  >
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── SELECTED: order number badge ── */}
              <AnimatePresence>
                {isSel && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                    className="absolute top-2 left-2 w-5 h-5 rounded-md bg-black/60 border border-orange-500/40 flex items-center justify-center backdrop-blur-sm"
                  >
                    <span className="text-[9px] font-black text-orange-300">{order}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── HOVER: action label ── */}
              {!isSel && !disabled && (
                <div className="absolute inset-0 flex items-end justify-center pb-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/25 backdrop-blur-sm">
                    <span className="text-[10px] font-bold text-orange-300 uppercase tracking-wider">Selecionar</span>
                  </div>
                </div>
              )}

              {/* ── MAP NAME ── */}
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-6">
                <p
                  className={cn(
                    "text-[11px] font-black uppercase tracking-[0.12em] text-center leading-none transition-colors duration-200",
                    isSel ? "text-orange-300" : "text-white/95 group-hover:text-white"
                  )}
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)" }}
                >
                  {map.name}
                </p>
              </div>

              {/* ── DISABLED: dim overlay ── */}
              {disabled && (
                <div className="absolute inset-0 bg-[#030305]/40" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── STATUS MESSAGE ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {!ready && (
          <motion.div
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center justify-center gap-2 py-2 mb-5"
          >
            <span className="w-1 h-1 rounded-full bg-orange-500/60" />
            <p className="text-[11px] text-[#4a5060]">
              {sel === 0
                ? `Selecione ${required} mapas para continuar`
                : sel > required
                ? "Remova alguns mapas"
                : `Mais ${required - sel} mapa${required - sel > 1 ? "s" : ""} para completar`}
            </p>
            <span className="w-1 h-1 rounded-full bg-orange-500/60" />
          </motion.div>
        )}
        {ready && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 py-2 mb-5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <p className="text-[12px] font-semibold text-emerald-400">
              Pool completo — pronto para iniciar!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NAVIGATION ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.07] bg-[#07080c] text-[#8a8f9e] hover:text-[#f0ece3] hover:border-white/[0.12] text-sm font-semibold transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <motion.button
          onClick={onNext}
          disabled={!ready}
          whileHover={ready ? { scale: 1.02 } : {}}
          whileTap={ready ? { scale: 0.98 } : {}}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
            ready
              ? "bg-orange-500 hover:bg-orange-400 text-white shadow-[0_0_20px_rgba(249,115,22,0.30)] hover:shadow-[0_0_28px_rgba(249,115,22,0.45)]"
              : "bg-[#0c0e13] border border-white/[0.05] text-[#3d4154] cursor-not-allowed"
          )}
        >
          {ready ? (
            <>
              Iniciar Lobby
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Selecione {required - sel} mais
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
