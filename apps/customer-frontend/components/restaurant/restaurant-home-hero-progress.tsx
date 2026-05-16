"use client";

import Link from 'next/link';
import { MultiOrderCircularProgress } from './checkout/multi-order-circular-progress';
import { AnimatedStatusEmoji } from './checkout/animated-status-emoji';

import type { CheckoutActiveOrderSummary } from './checkout/checkout-live-status-utils';

export function RestaurantHomeHeroProgress({
  statusHref,
  activeOrders,
  isOnTheWay,
}: {
  statusHref: string;
  activeOrders: CheckoutActiveOrderSummary[];
  isOnTheWay: boolean;
}) {
  return (
    <Link
      href={statusHref}
      className="flex flex-col items-center animate-in fade-in zoom-in duration-700 hover:scale-105 transition-transform active:scale-95"
    >
      <div className="relative h-24 w-24">
        <MultiOrderCircularProgress orders={activeOrders} className="h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedStatusEmoji isOnTheWay={isOnTheWay} />
        </div>
      </div>
    </Link>
  );
}
