"use client";

import { useEffect } from "react";
import { useEnhancedNotification } from "@/lib/hooks/use-enhanced-notification";
import { readNotificationSettings } from "@/lib/hooks/use-order-notification.utils";
import type { IncomingOrder } from "@/lib/hooks/use-order-notification";

type DriverOrderIncomingAlertProps = {
  orders: IncomingOrder[];
  onDismiss: () => void;
};

export function DriverOrderIncomingAlert({ orders, onDismiss }: DriverOrderIncomingAlertProps) {
  const { startPersistentAlarm, stopPersistentAlarm, doVibrate } = useEnhancedNotification();

  useEffect(() => {
    if (orders.length > 0) {
      const settings = readNotificationSettings();
      if (settings.soundEnabled) startPersistentAlarm();
      if (settings.vibrationEnabled) doVibrate();
    } else {
      stopPersistentAlarm();
    }

    return () => {
      stopPersistentAlarm();
    };
  }, [orders.length, startPersistentAlarm, stopPersistentAlarm, doVibrate]);

  if (orders.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div
        className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-4 animate-pulse">
            <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-wide">NEW ORDER</h2>
          <p className="text-sm font-semibold text-emerald-600 mt-1">
            {orders.length > 1 ? `${orders.length} orders incoming!` : "Order incoming!"}
          </p>
        </div>

        <div className="mt-5 rounded-[18px] border border-slate-100 bg-slate-50 p-4 text-center">
          <p className="text-3xl font-black text-slate-900">{orders[0].code}</p>
          <p className="text-sm font-semibold text-slate-700 mt-1">{orders[0].customerName}</p>
          <p className="mt-2 text-lg font-black text-emerald-700">{orders[0].orderValue}</p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white active:bg-emerald-700 transition"
          >
            Accept Order
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-600 active:bg-slate-200 transition"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
