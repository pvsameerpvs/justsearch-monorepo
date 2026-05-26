"use client";

import { motion } from "framer-motion";
import { RestaurantLogo } from "@/components/ui/restaurant-logo";

interface DriverSettingsRestaurantCardProps {
  name: string;
  zone: string;
  logoUrl?: string;
}

export function DriverSettingsRestaurantCard({ name, zone, logoUrl }: DriverSettingsRestaurantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[20px] border border-slate-200 bg-white p-4 flex items-center gap-3"
    >
      <RestaurantLogo name={name} logoUrl={logoUrl} size="md" />
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{name}</p>
        <p className="text-xs text-slate-500">{zone}</p>
      </div>
    </motion.div>
  );
}
