"use client";

import { motion } from "framer-motion";
import { Radio, BellOff, BellRing, AlertTriangle } from "lucide-react";
import { DriverSettingsToggle } from "./driver-settings-toggle";

interface DriverPushSettingsProps {
  supported: boolean;
  permission: string;
  pushEnabled: boolean;
  subscribed: boolean;
  onTogglePush: () => Promise<{ success: boolean; error?: string }>;
}

export function DriverPushSettings({ supported, permission, pushEnabled, onTogglePush }: DriverPushSettingsProps) {
  const handleToggle = async () => {
    await onTogglePush();
  };

  const description = !supported
    ? "Not supported on this device"
    : permission === "denied"
    ? "Blocked in browser settings"
    : pushEnabled
    ? "Push alerts active"
    : "Receive push notifications";

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
          activeIcon={<BellRing className="h-4 w-4 text-emerald-600" />}
          label="Push Alerts"
          description={description}
          enabled={pushEnabled && supported && permission === "granted"}
          onToggle={handleToggle}
        />

        {permission === "denied" && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Notifications are blocked. Enable them in your browser settings to receive order alerts.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
