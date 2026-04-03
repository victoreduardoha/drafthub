import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateLobbyId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getLobbyShareLink(lobbyId: string): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/lobby/${lobbyId}`;
  }
  return `/lobby/${lobbyId}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export const ELO_COLORS: Record<string, string> = {
  Iron: "text-gray-400",
  Bronze: "text-amber-700",
  Silver: "text-gray-300",
  Gold: "text-yellow-400",
  Platinum: "text-cyan-400",
  Diamond: "text-blue-400",
  Ascendant: "text-green-400",
  Immortal: "text-red-400",
  Radiant: "text-yellow-300",
};

export const ELO_BG_COLORS: Record<string, string> = {
  Iron: "bg-gray-700/50 text-gray-300",
  Bronze: "bg-amber-900/50 text-amber-400",
  Silver: "bg-gray-600/50 text-gray-200",
  Gold: "bg-yellow-900/50 text-yellow-400",
  Platinum: "bg-cyan-900/50 text-cyan-400",
  Diamond: "bg-blue-900/50 text-blue-400",
  Ascendant: "bg-green-900/50 text-green-400",
  Immortal: "bg-red-900/50 text-red-400",
  Radiant: "bg-yellow-900/50 text-yellow-300",
};

export function formatKD(kd: number): string {
  return kd.toFixed(2);
}
