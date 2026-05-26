import { headers } from "next/headers";
import { LoginContainer } from "./login-container";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function fetchRestaurantProfile(slug: string) {
  try {
    const res = await fetch(`${API_BASE}/restaurants/current`, {
      headers: { "x-restaurant-slug": slug },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    const settings = (data.settings as Record<string, unknown> | null) ?? {};
    return {
      name: String(data.name ?? ""),
      logoUrl: String(settings.logoUrl ?? ""),
      subdomain: String(data.subdomain ?? ""),
    };
  } catch {
    return null;
  }
}

export default async function LoginPage() {
  const headersList = await headers();
  const slug = headersList.get("x-restaurant-slug") || "";
  const restaurant = slug ? await fetchRestaurantProfile(slug) : null;

  return (
    <LoginContainer
      restaurantName={restaurant?.name}
      logoUrl={restaurant?.logoUrl}
      subdomain={restaurant?.subdomain}
    />
  );
}
