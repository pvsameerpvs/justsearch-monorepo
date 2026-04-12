"use client";

import { Check } from 'lucide-react';
import Link from 'next/link';
import { AnimatedStatusEmoji } from './animated-status-emoji';
import { MultiOrderCircularProgress } from './multi-order-circular-progress';

type ActiveOrderInfo = {
  id: string;
  progress: number;
  stageLabel: string;
  createdAt: number;
  isOnTheWay: boolean;
};

type CheckoutLiveProgressCircleProps = {
  orders: ActiveOrderInfo[];
};

export function CheckoutLiveProgressCircle({
  orders,
}: CheckoutLiveProgressCircleProps) {
  const primaryOrder = orders[0];
  const latestOrder = [...orders].sort((a, b) => b.createdAt - a.createdAt)[0];
  const isDone = primaryOrder.progress >= 1;

  const content = (
    <div className="relative h-16 w-16">
      <div className="absolute inset-0 rounded-full bg-white/80 shadow-2xl backdrop-blur-md">
        <MultiOrderCircularProgress 
          orders={orders} 
          radii={[30, 24, 18, 12]} 
          viewBox={64}
          size={undefined} // rely on className
          className="h-full w-full"
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isDone ? (
          <div className="rounded-full bg-green-500 p-1 text-white">
            <Check className="h-4 w-4" strokeWidth={3} />
          </div>
        ) : (
          <AnimatedStatusEmoji 
            isOnTheWay={primaryOrder.isOnTheWay} 
            className="text-xl" 
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-[calc(var(--restaurant-mobile-nav-height,0px)+24px)] right-6 z-[10000] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {latestOrder?.id ? (
        <Link 
          href={`/menu/checkout/status/${latestOrder.id}`}
          className="block transition-transform hover:scale-105 active:scale-95"
        >
          {content}
        </Link>
      ) : content}
    </div>
  );
}
