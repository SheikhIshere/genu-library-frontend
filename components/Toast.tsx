"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}
interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });
const MAX_TOASTS = 3;
const DISMISS_MS = 3000;

const iconMap: Record<ToastType, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
};

const borderMap: Record<ToastType, string> = {
  success: "border-status-success",
  error: "border-status-error",
  info: "border-status-info",
};

const iconColorMap: Record<ToastType, string> = {
  success: "text-status-success",
  error: "text-status-error",
  info: "text-status-info",
};

let nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = ++nextId;
      setToasts((prev) => {
        const next = [...prev, { id, message, type }];
        return next.length > MAX_TOASTS ? next.slice(next.length - MAX_TOASTS) : next;
      });
      const timer = setTimeout(() => dismiss(id), DISMISS_MS);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface border ${borderMap[t.type]} shadow-[0_8px_30px_rgba(0,0,0,0.5)] text-sm text-text-primary cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-top-2`}
          >
            <span className={`material-symbols-outlined text-[18px] ${iconColorMap[t.type]}`}>
              {iconMap[t.type]}
            </span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
