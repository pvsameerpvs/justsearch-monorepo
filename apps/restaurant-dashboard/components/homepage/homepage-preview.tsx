import { Gamepad2, MessagesSquare, Share2, UtensilsCrossed } from "lucide-react";
import { FeatureCard } from "./feature-card";
import { PreviewHero } from "./preview-hero";
import type { RestaurantProfile } from "@/lib/hooks/use-restaurant-query";

function rgb(v: string) {
  return `rgb(${v})`;
}

export function HomepagePreview({ restaurant }: { restaurant: RestaurantProfile }) {
  const t = restaurant.theme;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer Preview</p>
      </div>

      <div className="mx-auto max-w-[420px] rounded-[32px] border-[6px] border-slate-900 bg-white shadow-2xl overflow-hidden">
        <PreviewHero restaurant={restaurant} />

        <div className="p-4 space-y-4 bg-[linear-gradient(180deg,rgba(${t.pageBackgroundFrom},0.5),rgba(${t.pageBackgroundTo},0.5))]">
          <FeatureCard title="Food Menu" eyebrow="Dining" description="See dishes, prices, and menu categories." icon={UtensilsCrossed} bg={`linear-gradient(160deg,rgba(${t.brandSoft},0.45),rgba(255,255,255,0.92))`} iconBg={`rgb(${t.brandSoft})`} brandColor={rgb(t.brandColor)} />
          <FeatureCard title="Eat, Play" eyebrow="Experience" description="Show the fun dining and play experience." icon={Gamepad2} bg={`linear-gradient(160deg,rgba(${t.accentSoft},0.62),rgba(255,255,255,0.92))`} iconBg={`rgb(${t.accentSoft})`} brandColor={rgb(t.brandColor)} />
          <FeatureCard title="Google Reviews" eyebrow="Trust" description="Show rating and simple customer feedback." icon={MessagesSquare} bg={`linear-gradient(180deg,rgba(255,255,255,0.94),rgba(${t.brandSoft},0.3))`} iconBg={`rgb(${t.brandSoft})`} brandColor={rgb(t.brandColor)} />
          <FeatureCard title="Social Media" eyebrow="Community" description="Open all restaurant social links in one place." icon={Share2} bg={`linear-gradient(180deg,rgba(255,255,255,0.94),rgba(${t.accentSoft},0.34))`} iconBg={`rgb(${t.accentSoft})`} brandColor={rgb(t.brandColor)} />
        </div>
      </div>
    </div>
  );
}
