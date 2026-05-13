import Link from "next/link";
import { Bike, MapPin, Phone, ChevronRight } from "lucide-react";
import { Surface } from "@/components/shared/surface";
import { RestaurantLogoBadge } from "@/components/restaurant/restaurant-logo-badge";
import { formatCurrency } from "@/lib/format";
import type { Restaurant } from "@/lib/restaurant-types";

export function StatusHeader({ orderId, headline, supportText, restaurant }: {
  orderId: string;
  headline: string;
  supportText: string;
  restaurant: Restaurant;
}) {
  return (
    <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Order #{orderId}</p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[rgb(var(--ink))]">{headline}</h2>
          <p className="mt-1 text-[12px] text-[rgb(var(--muted))]">{supportText}</p>
        </div>
        <Link href="/menu" className="shrink-0 rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--brand))] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent" aria-label={`Open ${restaurant.name} menu`}>
          <RestaurantLogoBadge restaurant={restaurant} size="sm" className="h-11 w-11 rounded-[18px] border-[rgb(var(--border)/0.6)] shadow-none ring-0" />
        </Link>
      </div>
    </Surface>
  );
}

export function RiderCard({ riderName, riderPhone, telValue, isDelivered }: {
  riderName: string;
  riderPhone: string;
  telValue: string;
  isDelivered: boolean;
}) {
  return (
    <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--brand-soft)/0.36)] text-[rgb(var(--brand))]">
            <Bike className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Delivery boy</p>
            <p className="mt-1 truncate text-sm font-semibold text-[rgb(var(--ink))]">{riderName}</p>
            <p className="mt-0.5 text-[12px] text-[rgb(var(--muted))]">{riderPhone}</p>
          </div>
        </div>
        {!isDelivered && (
          <a href={`tel:${telValue}`} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.82)] bg-white text-[rgb(var(--ink))] transition-colors hover:bg-[rgb(var(--card-surface-muted)/0.5)]" aria-label="Call delivery boy">
            <Phone className="h-4 w-4" />
          </a>
        )}
      </div>
    </Surface>
  );
}

export function AddressItemsCard({ addressLines, items, total, orderCurrency }: {
  addressLines: string[];
  items: { itemId: string; quantity: number; name: string; price: number; currency: string }[];
  total: number;
  orderCurrency: string;
}) {
  return (
    <Surface className="rounded-[24px] border-[rgb(var(--border)/0.72)] bg-white/[0.96] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[rgb(var(--accent-soft)/0.42)] text-[rgb(var(--accent))]">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--muted))]">Deliver to</p>
          {addressLines.slice(0, 3).map((line) => (
            <p key={line} className="mt-1 text-sm leading-5 text-[rgb(var(--ink))] first:font-semibold">{line}</p>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-[rgb(var(--border)/0.72)] pt-3">
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.itemId} className="flex items-start justify-between gap-3 text-sm">
              <p className="min-w-0 text-[rgb(var(--ink))]">{item.quantity} x {item.name}</p>
              <p className="shrink-0 font-semibold text-[rgb(var(--ink))]">{formatCurrency(item.price * item.quantity, item.currency)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-[rgb(var(--border)/0.72)] pt-3 text-sm font-semibold text-[rgb(var(--ink))]">
          <span>Total</span>
          <span>{formatCurrency(total, orderCurrency)}</span>
        </div>
      </div>
    </Surface>
  );
}

export function ViewDetailsLink({ orderId }: { orderId: string }) {
  return (
    <Link href={`/profile/orders/${encodeURIComponent(orderId)}`} className="inline-flex w-full items-center justify-between rounded-[22px] border border-[rgb(var(--border)/0.72)] bg-white px-4 py-3 text-sm font-semibold text-[rgb(var(--ink))] shadow-sm">
      View full order details
      <ChevronRight className="h-4 w-4 text-[rgb(var(--muted))]" />
    </Link>
  );
}
