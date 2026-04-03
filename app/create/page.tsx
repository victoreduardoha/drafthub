"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { LobbyCreator } from "@/components/lobby/LobbyCreator";

export default function CreatePage() {
  return (
    <ToastProvider>
      <LobbyCreator />
    </ToastProvider>
  );
}
