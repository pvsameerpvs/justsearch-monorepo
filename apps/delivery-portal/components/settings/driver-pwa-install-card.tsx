"use client";

import { motion } from "framer-motion";
import { Download, CheckCircle, Smartphone } from "lucide-react";

interface DriverPwaInstallCardProps {
  canInstall: boolean;
  isInstalled: boolean;
  onInstall: () => Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function DriverPwaInstallCard({ canInstall, isInstalled, onInstall }: DriverPwaInstallCardProps) {
  const handleInstall = async () => {
    await onInstall();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="rounded-[20px] border border-slate-200 bg-white overflow-hidden"
    >
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          <Smartphone className="h-3.5 w-3.5" /> App
        </div>
      </div>

      <div className="px-4 pb-4">
        {isInstalled ? (
          <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-emerald-700">App Installed</p>
              <p className="text-[11px] text-emerald-600">Running as standalone app</p>
            </div>
          </div>
        ) : canInstall ? (
          <button
            type="button"
            onClick={handleInstall}
            className="flex w-full items-center gap-3 rounded-xl bg-slate-900 p-3 text-white active:bg-slate-800 transition"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Download className="h-4 w-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Install App</p>
              <p className="text-[11px] text-slate-300">Add to home screen for quick access</p>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200">
              <Smartphone className="h-4 w-4 text-slate-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-700">Web App Ready</p>
              <p className="text-[11px] text-slate-500">Use browser menu to install</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
