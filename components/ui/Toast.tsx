"use client";

import { useState, useCallback, createContext, useContext, useRef } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";
interface Toast { id: string; message: string; type: ToastType; }
interface ToastContextValue { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });
export function useToast() { return useContext(ToastContext); }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = `t${++counter.current}`;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const remove = useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error:   <XCircle     className="w-4 h-4 text-red-400 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />,
    info:    <Info        className="w-4 h-4 text-orange-400 shrink-0" />,
  };

  const styles = {
    success: "border-emerald-500/20 bg-emerald-950/50",
    error:   "border-red-500/20 bg-red-950/50",
    warning: "border-amber-500/20 bg-amber-950/50",
    info:    "border-orange-500/20 bg-orange-950/30",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl border min-w-[260px] max-w-[340px] pointer-events-auto",
              "bg-[#0c0e13] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]",
              styles[t.type]
            )}
          >
            {icons[t.type]}
            <p className="text-sm text-[#f0ece3] flex-1 leading-snug">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-[#3d4154] hover:text-[#f0ece3] transition-colors ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
