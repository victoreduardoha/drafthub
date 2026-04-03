import { Crosshair } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] py-10 px-4 bg-[#030305]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/15 flex items-center justify-center">
            <Crosshair className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <span className="font-black text-[#f0ece3] text-sm tracking-tight">DraftHub</span>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-[#2a2e3a] text-center">
          Não afiliado com a Riot Games. Valorant® é marca registrada da Riot Games.
        </p>

        {/* Credit */}
        {/* To add a link in the future: wrap the span in <a href="..."> */}
        <p className="text-[11px] text-[#2a2e3a]">
          Created by{" "}
          <span className="text-[#3d4154] font-medium">Haylander</span>
        </p>
      </div>
    </footer>
  );
}
