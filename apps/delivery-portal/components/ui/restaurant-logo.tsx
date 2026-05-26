"use client";

import { useState } from "react";
import { getRestaurantColor, getRestaurantInitial } from "@/lib/restaurant-avatar";

interface RestaurantLogoProps {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-10 w-10 text-base",
  md: "h-14 w-14 text-xl",
  lg: "h-20 w-20 text-3xl",
};

export function RestaurantLogo({ name, logoUrl, size = "md", className = "" }: RestaurantLogoProps) {
  const [error, setError] = useState(false);
  const initial = getRestaurantInitial(name);
  const color = getRestaurantColor(name);
  const sizeClass = SIZE_MAP[size];

  if (!logoUrl || error) {
    return (
      <div className={`flex shrink-0 items-center justify-center rounded-xl ${color.bg} ${sizeClass} ${className}`}>
        <span className={`font-bold ${color.text}`}>{initial}</span>
      </div>
    );
  }

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-xl bg-white overflow-hidden ${sizeClass} ${className}`}>
      <img
        src={logoUrl}
        alt={name}
        className="h-full w-full object-contain p-0.5"
        onError={() => setError(true)}
      />
    </div>
  );
}
