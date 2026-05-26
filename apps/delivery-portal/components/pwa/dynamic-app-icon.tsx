"use client";

import { useEffect } from "react";
import { useRestaurantQuery } from "@/lib/hooks/use-restaurant-query";

export function DynamicAppIcon() {
  const { logoUrl } = useRestaurantQuery();

  useEffect(() => {
    if (!logoUrl) return;

    // Update or create apple-touch-icon link
    let link = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "apple-touch-icon";
      document.head.appendChild(link);
    }
    link.href = logoUrl;

    // Also update shortcut icon if present
    let shortcut = document.querySelector('link[rel="shortcut icon"]') as HTMLLinkElement | null;
    if (!shortcut) {
      shortcut = document.createElement("link");
      shortcut.rel = "shortcut icon";
      document.head.appendChild(shortcut);
    }
    shortcut.href = logoUrl;
  }, [logoUrl]);

  return null;
}
