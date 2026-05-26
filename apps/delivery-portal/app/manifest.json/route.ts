import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { buildDeliveryManifest } from "@/lib/pwa/build-manifest";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

interface RestaurantCurrentResponse {
  id: string;
  slug: string;
  name: string;
  settings?: {
    logoUrl?: string;
    themeColor?: string;
    [key: string]: unknown;
  };
}

async function fetchRestaurant(slug: string): Promise<RestaurantCurrentResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/restaurants/current`, {
      headers: { "x-restaurant-slug": slug },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function GET(): Promise<NextResponse> {
  const slug = (await headers()).get("x-restaurant-slug") || "default";
  const data = await fetchRestaurant(slug);

  const manifest = buildDeliveryManifest({
    name: data?.name || "",
    logoUrl: data?.settings?.logoUrl,
    themeColor: data?.settings?.themeColor,
  });

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "application/manifest+json",
    },
  });
}
