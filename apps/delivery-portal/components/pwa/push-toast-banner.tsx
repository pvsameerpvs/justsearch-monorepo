"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X } from "lucide-react";

interface PushToast {
  id: number;
  title: string;
  body: string;
  orderCode?: string;
}

/**
 * Shows a floating toast banner when a push notification arrives
 * while the app is open (foreground). Browsers suppress system
 * notifications when the PWA is visible, so we show this in-app.
 */
export function PushToastBanner() {
  const [toasts, setToasts] = useState<PushToast[]>([]);

  useEffect(() => {
    function onPushReceived(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;

      const toast: PushToast = {
        id: Date.now(),
        title: detail.title || "New Delivery",
        body: detail.body || "You have a new order assignment",
        orderCode: detail.orderCode,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after 8 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 8000);
    }

    window.addEventListener("driver:push-received", onPushReceived);
    return () => window.removeEventListener("driver:push-received", onPushReceived);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center gap-2 p-4 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="pointer-events-auto w-full max-w-sm rounded-2xl border border-emerald-200 bg-emerald-50 shadow-lg shadow-emerald-900/10 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <BellRing className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-emerald-900">{toast.title}</h3>
                <p className="mt-0.5 text-xs text-emerald-700 leading-relaxed">
                  {toast.body}
                </p>
                {toast.orderCode && (
                  <p className="mt-1 text-[11px] font-mono text-emerald-600 bg-emerald-100 rounded px-1.5 py-0.5 inline-block">
                    {toast.orderCode}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 -mr-1 -mt-1 p-1 rounded-full hover:bg-emerald-100 transition-colors"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4 text-emerald-500" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
