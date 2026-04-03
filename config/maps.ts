import { MapInfo } from "@/types";

// ============================================================
// VALORANT MAP POOL — 12 mapas competitivos atuais
// Para adicionar/remover mapas, edite apenas este array.
// Para trocar imagens, substitua os arquivos em /public/maps/
// ============================================================

export const VALORANT_MAPS: MapInfo[] = [
  {
    id: "ascent",
    name: "Ascent",
    slug: "ascent",
    image: "/maps/ascent.jpg",
    callout: "Open battlefield in Italy",
    available: true,
  },
  {
    id: "bind",
    name: "Bind",
    slug: "bind",
    image: "/maps/bind.jpg",
    callout: "Two portals, zero excuses",
    available: true,
  },
  {
    id: "haven",
    name: "Haven",
    slug: "haven",
    image: "/maps/haven.jpg",
    callout: "Three sites, one chaos",
    available: true,
  },
  {
    id: "split",
    name: "Split",
    slug: "split",
    image: "/maps/split.jpg",
    callout: "Divided skyline",
    available: true,
  },
  {
    id: "icebox",
    name: "Icebox",
    slug: "icebox",
    image: "/maps/icebox.jpg",
    callout: "Frozen battleground",
    available: true,
  },
  {
    id: "breeze",
    name: "Breeze",
    slug: "breeze",
    image: "/maps/breeze.jpg",
    callout: "Wide open tropical ruins",
    available: true,
  },
  {
    id: "fracture",
    name: "Fracture",
    slug: "fracture",
    image: "/maps/fracture.jpg",
    callout: "Attack from both sides",
    available: true,
  },
  {
    id: "pearl",
    name: "Pearl",
    slug: "pearl",
    image: "/maps/pearl.jpg",
    callout: "Underwater city vibes",
    available: true,
  },
  {
    id: "lotus",
    name: "Lotus",
    slug: "lotus",
    image: "/maps/lotus.jpg",
    callout: "Ancient ruins, three sites",
    available: true,
  },
  {
    id: "sunset",
    name: "Sunset",
    slug: "sunset",
    image: "/maps/sunset.jpg",
    callout: "Golden hour combat",
    available: true,
  },
  {
    id: "abyss",
    name: "Abyss",
    slug: "abyss",
    image: "/maps/abyss.jpg",
    callout: "No ropes to hold you",
    available: true,
  },
  {
    id: "corrode",
    name: "Corrode",
    slug: "corrode",
    image: "/maps/corrode.jpg",
    callout: "Industrial wasteland",
    available: true,
  },
];

// Requisitos de pool por formato (todos usam 7 mapas no pool — padrão competitivo Valorant)
// MD1: 5 bans + 1 pick + side = 7 mapas no pool
// MD3: 2 bans + 2 picks + 2 bans + 1 decider = 7 mapas no pool
// MD5: 2 bans + 4 picks + 1 decider = 7 mapas no pool
export const MAP_POOL_REQUIREMENTS: Record<string, number> = {
  MD1: 7,
  MD3: 7,
  MD5: 7,
};

export function getMapById(id: string): MapInfo | undefined {
  return VALORANT_MAPS.find((m) => m.id === id);
}

export function getAvailableMaps(): MapInfo[] {
  return VALORANT_MAPS.filter((m) => m.available);
}

export function getMapGradient(mapId: string): string {
  const gradients: Record<string, string> = {
    ascent:   "from-amber-900/80 to-yellow-950/80",
    bind:     "from-amber-900/80 to-orange-950/80",
    haven:    "from-green-900/80 to-emerald-950/80",
    split:    "from-purple-900/80 to-violet-950/80",
    icebox:   "from-sky-900/80 to-blue-950/80",
    breeze:   "from-teal-900/80 to-cyan-950/80",
    fracture: "from-rose-900/80 to-red-950/80",
    pearl:    "from-blue-900/80 to-cyan-950/80",
    lotus:    "from-pink-900/80 to-rose-950/80",
    sunset:   "from-orange-900/80 to-red-950/80",
    abyss:    "from-red-900/80 to-orange-950/80",
    corrode:  "from-lime-900/80 to-green-950/80",
  };
  return gradients[mapId] || "from-gray-900/80 to-gray-950/80";
}
