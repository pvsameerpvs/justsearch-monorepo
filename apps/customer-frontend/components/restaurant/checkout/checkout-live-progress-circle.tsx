"use client";

import Link from 'next/link';
import { AnimatedStatusEmoji } from './animated-status-emoji';
import { MultiOrderCircularProgress } from './multi-order-circular-progress';
import {
  type CheckoutActiveOrderSummary,
  getCheckoutStatusHref,
} from './checkout-live-status-utils';

type CheckoutLiveProgressCircleProps = {
  orders: CheckoutActiveOrderSummary[];
};

export function CheckoutLiveProgressCircle({
  orders,
}: CheckoutLiveProgressCircleProps) {
  if (orders.length === 0) {
    return null;
  }

  const primaryOrder = orders[0];
  const statusHref = getCheckoutStatusHref(orders.map((order) => order.id));

  const content = (
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 rounded-full bg-white/80 shadow-2xl backdrop-blur-md">
        <MultiOrderCircularProgress 
          orders={orders} 
          radii={[30, 24, 18, 12]} 
          viewBox={64}
          size={undefined}
          className="h-full w-full"
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <AnimatedStatusEmoji isOnTheWay={primaryOrder.isOnTheWay} className="text-xl" />
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-[calc(var(--restaurant-mobile-nav-height,0px)+24px)] right-6 z-[10000] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {statusHref ? (
        <Link 
          href={statusHref}
          className="block transition-transform hover:scale-105 active:scale-95"
        >
          {content}
        </Link>
      ) : content}
    </div>
  );
}
