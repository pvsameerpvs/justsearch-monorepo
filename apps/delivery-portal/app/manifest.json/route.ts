import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { buildDeliveryManifest } from "@/lib/pwa/build-manifest";

function formatSlugName(slug: string) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function GET(): Promise<NextResponse> {
  const slug = (await headers()).get("x-restaurant-slug") || "default";
  const name = slug === "default" ? "Delivery Portal" : formatSlugName(slug);

  const manifest = buildDeliveryManifest({
    name,
  });

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Content-Type": "application/manifest+json",
    },
  });
}
