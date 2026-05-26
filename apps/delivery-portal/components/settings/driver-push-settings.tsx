"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, BellOff, BellRing, AlertTriangle, CheckCircle, Loader2, XCircle, Info } from "lucide-react";
import { DriverSettingsToggle } from "./driver-settings-toggle";

interface DriverPushSettingsProps {
  supported: boolean;
  permission: string;
  pushEnabled: boolean;
  subscribed: boolean;
  syncStatus: "idle" | "syncing" | "synced" | "failed";
  isToggling: boolean;
  lastError: string | null;
  onTogglePush: () => Promise<{ success: boolean; error?: string }>;
}

export function DriverPushSettings({
  supported,
  permission,
  pushEnabled,
  syncStatus,
  isToggling,
  lastError,
  onTogglePush,
}: DriverPushSettingsProps) {
  const [showError, setShowError] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;
    setShowError(false);
    const result = await onTogglePush();
    if (!result.success) {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }
  };

  const isOn = pushEnabled && supported && permission === "granted";

  const description = !supported
    ? "Not supported on this device"
    : permission === "denied"
    ? "Blocked in browser settings"
    : isToggling
    ? "Please wait..."
    : pushEnabled
    ? syncStatus === "syncing"
      ? "Syncing with server..."
      : syncStatus === "failed"
      ? "Subscribed — backend sync pending"
      : "Push alerts active"
    : "Receive push notifications when closed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-[20px] border border-slate-200 bg-white overflow-hidden"
    >
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          <Radio className="h-3.5 w-3.5" /> Push Notifications
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <DriverSettingsToggle
          icon={<BellOff className="h-4 w-4 text-slate-500" />}
          activeIcon={isToggling ? <Loader2 className="h-4 w-4 animate-spin text-emerald-600" /> : <BellRing className="h-4 w-4 text-emerald-600" />}
          label="Push Alerts"
          description={description}
          enabled={isOn}
          onToggle={handleToggle}
        />

        <AnimatePresence>
          {isToggling && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-lg bg-blue-50 p-2.5"
            >
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
              <p className="text-[11px] text-blue-700 leading-relaxed">
                {pushEnabled ? "Disabling..." : "Requesting permission..."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showError && lastError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 rounded-lg bg-red-50 p-2.5"
            >
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p className="text-[11px] text-red-700 leading-relaxed">{lastError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {pushEnabled && syncStatus !== "idle" && (
          <div className={`flex items-center gap-2 rounded-lg ${syncStatus === "failed" ? "bg-amber-50" : "bg-emerald-50"} p-2.5`}>
            {syncStatus === "syncing" && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-emerald-600" />}
            {syncStatus === "synced" && <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />}
            {syncStatus === "failed" && <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />}
            <p className={`text-[11px] leading-relaxed ${syncStatus === "failed" ? "text-amber-700" : "text-emerald-700"}`}>
              {syncStatus === "syncing" && "Sending subscription to server..."}
              {syncStatus === "synced" && "Server will notify you of new orders"}
              {syncStatus === "failed" && "Server sync pending — backend not ready"}
            </p>
          </div>
        )}

        {!supported && (
          <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Push requires Web Push support. Keep the app open for sound + vibration alerts.
            </p>
          </div>
        )}

        {permission === "denied" && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Notifications blocked. iPhone: Settings → Safari → Notifications → Allow.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
