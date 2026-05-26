"use client";

import { motion } from "framer-motion";
import { Volume2, Volume1, VolumeX } from "lucide-react";

interface DriverVolumeSliderProps {
  volumeLevel: number;
  onChange: (level: number) => void;
}

export function DriverVolumeSlider({ volumeLevel, onChange }: DriverVolumeSliderProps) {
  const VolumeIcon = volumeLevel === 0 ? VolumeX : volumeLevel < 50 ? Volume1 : Volume2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-[20px] border border-slate-200 bg-white overflow-hidden"
    >
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          <Volume2 className="h-3.5 w-3.5" /> Alarm Volume
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="flex items-center gap-3 mb-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${volumeLevel > 0 ? "bg-emerald-100" : "bg-slate-200"}`}>
              <VolumeIcon className={`h-4 w-4 ${volumeLevel > 0 ? "text-emerald-600" : "text-slate-500"}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-slate-900">{volumeLevel}%</p>
              <p className="text-[11px] text-slate-500">
                {volumeLevel === 0 ? "Muted" : volumeLevel < 50 ? "Low volume" : volumeLevel < 80 ? "Medium volume" : "Very loud"}
              </p>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={volumeLevel}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full accent-emerald-600 h-2 rounded-lg appearance-none bg-slate-200 cursor-pointer"
            style={{
              background: `linear-gradient(to right, #059669 0%, #059669 ${volumeLevel}%, #e2e8f0 ${volumeLevel}%, #e2e8f0 100%)`,
            }}
          />

          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-slate-400 font-medium">0%</span>
            <span className="text-[10px] text-slate-400 font-medium">50%</span>
            <span className="text-[10px] text-slate-400 font-medium">100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
