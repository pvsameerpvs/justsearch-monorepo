"use client";

import { useEffect } from "react";
import { useRestaurantQuery } from "@/lib/hooks/use-restaurant-query";

export function DynamicAppIcon() {
  const { logoUrl } = useRestaurantQuery();

  useEffect(() => {
    if (!logoUrl) return;
    try {
      let link = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "apple-touch-icon";
        document.head.appendChild(link);
      }
      if (link.href !== logoUrl) link.href = logoUrl;
    } catch {
      // ignore
    }
  }, [logoUrl]);

  return null;
}
