const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

function readAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("justsearch:accessToken") ||
    window.sessionStorage.getItem("justsearch:accessToken")
  );
}

function readRestaurantSlug(): string | null {
  if (typeof window === "undefined") return null;

  const saved = window.localStorage.getItem("restaurant-slug");
  if (saved) return saved;

  const host = window.location.host.replace(/:\d+$/, "").toLowerCase();
  if (host === "localhost") return null;

  let first = host.split(".")[0] || "";
  if (first.endsWith("-delivery")) first = first.slice(0, -9);
  if (first.endsWith("-admin")) first = first.slice(0, -6);
  return first || null;
}

function getSocketBaseUrl(): URL {
  const url = new URL(API_BASE);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws/delivery";
  url.search = "";
  return url;
}

export function buildDeliveryRealtimeUrl(): string | null {
  const token = readAccessToken();
  const restaurantSlug = readRestaurantSlug();
  if (!token || !restaurantSlug) return null;

  const url = getSocketBaseUrl();
  url.searchParams.set("token", token);
  url.searchParams.set("restaurantSlug", restaurantSlug);
  return url.toString();
}
