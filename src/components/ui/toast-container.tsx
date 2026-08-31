"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, dismissToast } = useDashboard();

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case "error":
        return <XCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-indigo-400 shrink-0" />;
    }
  };

  const getBorderGlow = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]";
      case "warning":
        return "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]";
      case "error":
        return "border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]";
      default:
        return "border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "pointer-events-auto p-4 rounded-xl bg-zinc-900/95 backdrop-blur-xl border flex items-start gap-3 shadow-2xl text-zinc-100",
              getBorderGlow(toast.type)
            )}
          >
            {getIcon(toast.type)}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white tracking-tight">{toast.title}</p>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
