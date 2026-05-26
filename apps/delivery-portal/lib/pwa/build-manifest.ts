import type { MetadataRoute } from "next";

interface RestaurantData {
  name: string;
  logoUrl?: string;
  themeColor?: string;
}

export function buildDeliveryManifest(restaurant: RestaurantData | null): MetadataRoute.Manifest {
  const name = restaurant?.name || "Delivery Portal";
  const shortName = restaurant?.name || "Delivery";
  const logoUrl = restaurant?.logoUrl;
  const themeColor = restaurant?.themeColor || "#059669";

  const icons = [
    { src: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
    { src: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
  ];

  if (logoUrl) {
    icons.unshift(
      { src: logoUrl, sizes: "192x192", type: "image/png" },
      { src: logoUrl, sizes: "512x512", type: "image/png" }
    );
  }

  return {
    name,
    short_name: shortName,
    description: `Delivery portal for ${restaurant?.name || "restaurant"} drivers.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: themeColor,
    orientation: "portrait",
    scope: "/",
    id: "/",
    icons,
    categories: ["food", "business", "navigation"],
    lang: "en",
    dir: "ltr",
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Current Delivery",
        short_name: "Delivery",
        description: "View your active delivery",
        url: "/",
        icons: [{ src: logoUrl || "/icons/icon-192x192.svg", sizes: "192x192" }],
      },
      {
        name: "Earnings",
        short_name: "Earnings",
        description: "View your earnings",
        url: "/earnings",
        icons: [{ src: logoUrl || "/icons/icon-192x192.svg", sizes: "192x192" }],
      },
      {
        name: "Settings",
        short_name: "Settings",
        description: "App settings and notifications",
        url: "/settings",
        icons: [{ src: logoUrl || "/icons/icon-192x192.svg", sizes: "192x192" }],
      },
    ],
  };
}
