"use client";

import { Check } from 'lucide-react';
import Link from 'next/link';

type CheckoutLiveProgressCircleProps = {
  progress: number;
  stageLabel: string;
  orderId?: string;
};

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CheckoutLiveProgressCircle({
  progress,
  stageLabel,
  orderId,
}: CheckoutLiveProgressCircleProps) {
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const dashOffset = CIRCUMFERENCE * (1 - normalizedProgress);
  const isDone = normalizedProgress >= 1;

  const content = (
    <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full bg-white/80 p-1 shadow-2xl backdrop-blur-md">
          <svg
            viewBox="0 0 64 64"
            className="-rotate-90 h-full w-full"
            aria-hidden="true"
          >
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              className="fill-none stroke-black/5"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              className={`fill-none transition-all duration-1000 ease-linear ${
                isDone ? 'stroke-green-500' : 'stroke-[rgb(var(--brand))]'
              }`}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-0.5">
          {isDone ? (
            <div className="rounded-full bg-green-500 p-1 text-white">
              <Check className="h-5 w-5" strokeWidth={3} />
            </div>
          ) : (
            <>
              <span className="text-[14px] font-bold tracking-tighter text-[rgb(var(--ink))]">
                {Math.round(normalizedProgress * 100)}%
              </span>
              <span className="text-[7px] font-bold uppercase tracking-widest text-[rgb(var(--brand))] opacity-80">
                Live
              </span>
            </>
          )}
        </div>
        
        {/* Tooltip-like label */}
        <div className="absolute -left-20 -top-8 flex w-32 justify-center">
            <div className="rounded-full bg-black/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                <p className="whitespace-nowrap text-[10px] font-bold uppercase tracking-tight text-white">
                    {stageLabel}
                </p>
            </div>
            {/* Tiny arrow */}
            <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black/90" />
        </div>
      </div>
  );

  return (
    <div className="fixed bottom-[calc(var(--restaurant-mobile-nav-height,0px)+24px)] right-6 z-[10000] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {orderId ? (
        <Link 
          href={`/menu/checkout/status/${orderId}`}
          className="block transition-transform hover:scale-105 active:scale-95"
        >
          {content}
        </Link>
      ) : content}
    </div>
  );
}
