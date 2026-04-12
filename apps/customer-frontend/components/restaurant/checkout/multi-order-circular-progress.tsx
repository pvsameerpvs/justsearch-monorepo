"use client";

import React from 'react';

type OrderProgress = {
  id: string;
  progress: number;
};

type MultiOrderCircularProgressProps = {
  orders: OrderProgress[];
  size?: number;
  className?: string;
  radii?: number[];
  colors?: string[];
  viewBox?: number;
};

const DEFAULT_COLORS = ['rgb(var(--brand))', '#F59E0B', '#3B82F6', '#EC4899'];

export function MultiOrderCircularProgress({
  orders,
  size = 100,
  className = "",
  radii = [44, 36, 28, 20],
  colors = DEFAULT_COLORS,
  viewBox = 100
}: MultiOrderCircularProgressProps) {
  const center = viewBox / 2;

  return (
    <svg 
      className={`-rotate-90 overflow-visible ${className}`} 
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      width={size}
      height={size}
    >
      {orders.slice(0, radii.length).map((order, i) => {
        const r = radii[i];
        const circum = 2 * Math.PI * r;
        const color = colors[i % colors.length];
        const isPrimary = i === 0;

        return (
          <g key={order.id} className="animate-in fade-in fill-none">
            {/* Track Background */}
            <circle 
              cx={center} 
              cy={center} 
              r={r} 
              className="stroke-slate-200/40" 
              strokeWidth={isPrimary ? 6 : 4} 
            />
            {/* Progress Bar */}
            <circle
              cx={center}
              cy={center}
              r={r}
              style={{
                stroke: color,
                strokeDasharray: circum,
                strokeDashoffset: circum * (1 - order.progress)
              }}
              className="transition-all duration-1000 ease-out"
              strokeWidth={isPrimary ? 6 : 4}
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
