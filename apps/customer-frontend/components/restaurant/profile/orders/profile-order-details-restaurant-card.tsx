import { ChevronRight } from "lucide-react";
import { Surface } from "@/components/shared/surface";
import { RestaurantLogoBadge } from "@/components/restaurant/restaurant-logo-badge";

type Props = {
  name: string;
  logoUrl?: string;
};

export function ProfileOrderDetailsRestaurantCard({ name, logoUrl }: Props) {
  return (
    <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.92] p-4 shadow-sm transition-colors hover:bg-white">
      <div className="flex items-center gap-3">
        <RestaurantLogoBadge
          restaurant={{ name, logoUrl }}
          size="sm"
          className="h-11"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">
            Restaurant
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-[rgb(var(--ink))]">
            {name}
          </p>
        </div>
        <ChevronRight className="h-4 w-4 text-[rgb(var(--muted))]" />
      </div>
    </Surface>
  );
}
