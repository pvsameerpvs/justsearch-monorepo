"use client";
import { Check } from 'lucide-react';

type CheckoutOrderPlacingOverlayProps = {
  progress: number;
  isSuccess?: boolean;
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CheckoutOrderPlacingOverlay({
  progress,
  isSuccess,
}: CheckoutOrderPlacingOverlayProps) {
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const dashOffset = CIRCUMFERENCE * (1 - normalizedProgress);
  const showSuccess = isSuccess || normalizedProgress >= 1;

  return (
    <div className="fixed inset-0 z-[10020] flex items-center justify-center bg-black/50 px-6 backdrop-blur-[3px]">
      <div className="w-full max-w-sm rounded-[30px] border border-[rgb(var(--border)/0.4)] bg-white px-5 py-8 text-center shadow-[0_32px_60px_rgba(0,0,0,0.24)]">
        <div className="relative mx-auto h-36 w-36">
          <svg
            viewBox="0 0 128 128"
            className="-rotate-90 h-36 w-36"
            aria-hidden="true"
          >
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              className="fill-none stroke-black/20"
              strokeWidth="10"
            />
            <circle
              cx="64"
              cy="64"
              r={RADIUS}
              className="fill-none stroke-[rgb(var(--brand))]"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`flex h-[78px] w-[78px] items-center justify-center rounded-full text-[36px] shadow-[0_12px_24px_rgba(15,23,42,0.25)] transition-all duration-500 ${showSuccess ? 'bg-[rgb(var(--brand))] scale-110' : 'bg-black'}`}>
              {showSuccess ? (
                <Check className="h-10 w-10 text-white" strokeWidth={3} />
              ) : (
                <span className="animate-pulse">🍔</span>
              )}
            </div>
          </div>
        </div>

        <p className={`mt-5 text-base font-semibold tracking-tight transition-colors duration-500 ${showSuccess ? 'text-[rgb(var(--brand))] uppercase tracking-[0.05em]' : 'text-[rgb(var(--ink))]'}`}>
          {showSuccess ? 'Order placed!' : 'Placing your order'}
        </p>
        <p className="mt-1 text-[13px] leading-5 text-[rgb(var(--muted))]">
          {showSuccess 
            ? 'Your order is being prepared by the restaurant.' 
            : 'Please wait while we confirm with the restaurant.'}
        </p>
      </div>
    </div>
  );
}
