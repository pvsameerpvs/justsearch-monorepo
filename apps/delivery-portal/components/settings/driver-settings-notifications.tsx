"use client";

import { motion } from "framer-motion";
import { Bell, Volume2, VolumeX, Vibrate, Smartphone, Zap } from "lucide-react";
import { DriverSettingsToggle } from "./driver-settings-toggle";
import { useEnhancedNotification } from "@/lib/hooks/use-enhanced-notification";

interface DriverSettingsNotificationsProps {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onToggleSound: () => void;
  onToggleVibration: () => void;
}

export function DriverSettingsNotifications({
  soundEnabled,
  vibrationEnabled,
  onToggleSound,
  onToggleVibration,
}: DriverSettingsNotificationsProps) {
  const { playSirenOnce, doVibrate } = useEnhancedNotification();

  const testAlarm = () => {
    if (soundEnabled) playSirenOnce();
    if (vibrationEnabled) doVibrate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 }}
      className="rounded-[20px] border border-slate-200 bg-white overflow-hidden"
    >
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          <Bell className="h-3.5 w-3.5" /> Notifications
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        <DriverSettingsToggle
          icon={<VolumeX className="h-4 w-4 text-slate-500" />}
          activeIcon={<Volume2 className="h-4 w-4 text-emerald-600" />}
          label="Order Sound"
          description={soundEnabled ? "Loud siren enabled" : "Silent mode"}
          enabled={soundEnabled}
          onToggle={onToggleSound}
        />
        <DriverSettingsToggle
          icon={<Smartphone className="h-4 w-4 text-slate-500" />}
          activeIcon={<Vibrate className="h-4 w-4 text-emerald-600" />}
          label="Vibration"
          description={vibrationEnabled ? "Strong buzz on new order" : "No vibration"}
          enabled={vibrationEnabled}
          onToggle={onToggleVibration}
        />

        <button
          type="button"
          onClick={testAlarm}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 p-3 text-amber-700 active:bg-amber-100 transition"
        >
          <Zap className="h-4 w-4" />
          <span className="text-sm font-semibold">Test Alarm</span>
        </button>
      </div>
    </motion.div>
  );
}
