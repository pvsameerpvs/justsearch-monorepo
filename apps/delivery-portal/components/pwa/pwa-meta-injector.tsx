"use client";

import { useEffect } from "react";
import { useRestaurantQuery } from "@/lib/hooks/use-restaurant-query";

const META_NAMES = [
  "apple-mobile-web-app-capable",
  "apple-mobile-web-app-status-bar-style",
  "apple-mobile-web-app-title",
  "mobile-web-app-capable",
  "theme-color",
];

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setAppleTouchIcon(href: string) {
  let el = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = "apple-touch-icon";
    document.head.appendChild(el);
  }
  if (el.href !== href) el.href = href;
}

export function PwaMetaInjector() {
  const { restaurant } = useRestaurantQuery();

  useEffect(() => {
    const name = restaurant?.name || "Delivery";
    const themeColor = (restaurant?.theme as string | undefined) || "#059669";
    const logoUrl = restaurant?.settings?.logoUrl as string | undefined;

    // iOS standalone mode — critical meta tags
    setMeta("apple-mobile-web-app-capable", "yes");
    setMeta("apple-mobile-web-app-status-bar-style", "black-translucent");
    setMeta("apple-mobile-web-app-title", name);

    // Android legacy + cross-browser
    setMeta("mobile-web-app-capable", "yes");
    setMeta("theme-color", themeColor);

    // Apple touch icon — must be PNG, never SVG
    if (logoUrl) {
      setAppleTouchIcon(logoUrl);
    }

    // Cleanup on unmount: remove tags we created
    return () => {
      META_NAMES.forEach((n) => {
        const el = document.querySelector(`meta[name="${n}"]`);
        if (el) el.remove();
      });
      const icon = document.querySelector('link[rel="apple-touch-icon"]');
      if (icon) icon.remove();
    };
  }, [restaurant]);

  return null;
}
