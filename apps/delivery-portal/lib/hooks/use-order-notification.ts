"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getIncomingOrderKey } from "@/lib/realtime/incoming-order-utils";
import { wasRecentlyRealtimeOrder } from "@/lib/realtime/realtime-order-memory";
import { useEnhancedNotification } from "./use-enhanced-notification";
import { readNotificationSettings } from "./use-order-notification.utils";

export type IncomingOrder = {
  assignmentId: string;
  orderId?: string;
  code: string;
  customerName: string;
  orderValue: string;
  etaMinutes: number;
};

export function useOrderNotification(orders: IncomingOrder[]) {
  const prevIdsRef = useRef<string[]>([]);
  const [incoming, setIncoming] = useState<IncomingOrder[]>([]);
  const { startPersistentAlarm, stopPersistentAlarm, doVibrate } = useEnhancedNotification();

  useEffect(() => () => stopPersistentAlarm(), [stopPersistentAlarm]);

  useEffect(() => {
    if (orders.length > 0) return;
    stopPersistentAlarm();
    setIncoming([]);
  }, [orders.length, stopPersistentAlarm]);

  useEffect(() => {
    const prev = prevIdsRef.current;
    const currentIds = orders.map(getIncomingOrderKey);
    const newOrders = orders.filter((order) => {
      const key = getIncomingOrderKey(order);
      return !prev.includes(key) && !wasRecentlyRealtimeOrder(key);
    });

    if (newOrders.length > 0 && prev.length > 0) {
      const settings = readNotificationSettings();
      if (settings.soundEnabled) startPersistentAlarm();
      if (settings.vibrationEnabled) doVibrate();
      setIncoming(newOrders);
    }

    prevIdsRef.current = [...currentIds];
  }, [orders, startPersistentAlarm, doVibrate]);

  const dismiss = useCallback(() => {
    stopPersistentAlarm();
    setIncoming([]);
  }, [stopPersistentAlarm]);

  return { incoming, dismiss };
}
