"use client";

import { Bike } from "lucide-react";
import { motion } from "framer-motion";
import { RestaurantLogo } from "@/components/ui/restaurant-logo";

interface LoginLogoProps {
  subdomain?: string;
  logoUrl?: string;
}

export function LoginLogo({ subdomain, logoUrl }: LoginLogoProps) {
  const name = subdomain?.trim() || "Restaurant";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center mb-8"
    >
      {/* Real restaurant logo from API */}
      <div className="relative">
        <RestaurantLogo name={name} logoUrl={logoUrl} size="lg" />
        <div className="absolute -bottom-1 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow border border-slate-100">
          <Bike className="h-4 w-4 text-slate-700" />
        </div>
      </div>
      <h1 className="mt-4 text-xl font-black text-slate-900">{name}</h1>
      <p className="text-sm text-slate-500">Delivery Portal</p>
    </motion.div>
  );
}
