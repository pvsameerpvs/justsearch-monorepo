"use client";

import type { ElementType } from 'react';

interface RevenueCardProps {
  label: string;
  value: string;
  change: string;
  icon: ElementType;
  color: string;
}

export function RevenueCard({
  label,
  value,
  change,
  icon: Icon,
  color,
}: RevenueCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
          {change}
        </span>
      </div>
      <p className="mt-3 text-2xl font-black text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
