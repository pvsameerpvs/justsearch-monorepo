"use client";

import { useEffect, useState } from "react";
import { getRestaurantColor, getRestaurantInitial } from "@/lib/restaurant-avatar";

interface RestaurantLogoProps {
  name: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "nav";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-10 w-10 text-base",
  md: "h-14 w-14 text-xl",
  lg: "h-20 w-20 text-3xl",
  nav: "h-11 w-28 text-lg",
};

export function RestaurantLogo({ name, logoUrl, size = "md", className = "" }: RestaurantLogoProps) {
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const displayName = mounted ? name : "Restaurant";
  const initial = getRestaurantInitial(displayName);
  const color = getRestaurantColor(displayName);
  const sizeClass = SIZE_MAP[size];
  const isNavLogo = size === "nav";
  const fallbackSizeClass = isNavLogo ? "h-11 w-11 text-xl" : sizeClass;
  const fallbackFrameClass = isNavLogo ? "bg-transparent rounded-none" : `rounded-xl ${color.bg}`;
  const fallbackTextClass = isNavLogo ? "text-emerald-700" : color.text;
  const imageClass = size === "nav"
    ? "max-h-11 max-w-[6.5rem] object-contain"
    : "h-full w-full object-contain p-0.5";
  const frameClass = size === "nav"
    ? "bg-transparent rounded-none"
    : "rounded-xl bg-white overflow-hidden";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!logoUrl || error) {
    return (
      <div className={`flex shrink-0 items-center justify-center ${fallbackFrameClass} ${fallbackSizeClass} ${className}`}>
        <span className={`font-bold ${fallbackTextClass}`}>{initial}</span>
      </div>
    );
  }

  return (
    <div className={`flex shrink-0 items-center justify-center ${frameClass} ${sizeClass} ${className}`}>
      <img
        src={logoUrl}
        alt={name}
        className={imageClass}
        onError={() => setError(true)}
      />
    </div>
  );
}
