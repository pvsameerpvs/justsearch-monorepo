"use client";

import { useEffect } from "react";
import { useRestaurantQuery } from "@/lib/hooks/use-restaurant-query";

const PWA_META = [
  { name: "apple-mobile-web-app-capable", content: "yes" },
  { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
  { name: "mobile-web-app-capable", content: "yes" },
];

function injectMeta(name: string, content: string) {
  try {
    let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement("meta");
      el.name = name;
      document.head.appendChild(el);
    }
    el.content = content;
  } catch {
    // ignore
  }
}

function injectAppleIcon(href: string) {
  try {
    let el = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
    if (!el) {
      el = document.createElement("link");
      el.rel = "apple-touch-icon";
      document.head.appendChild(el);
    }
    if (el.href !== href) el.href = href;
  } catch {
    // ignore
  }
}

export function PwaMetaInjector() {
  const { restaurant } = useRestaurantQuery();

  useEffect(() => {
    const name = restaurant?.name || "Delivery";
    const logoUrl = restaurant?.settings?.logoUrl as string | undefined;

    for (const m of PWA_META) {
      injectMeta(m.name, m.content);
    }
    injectMeta("apple-mobile-web-app-title", name);

    if (logoUrl) injectAppleIcon(logoUrl);
  }, [restaurant]);

  return null;
}
