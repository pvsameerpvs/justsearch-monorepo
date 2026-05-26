"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { readNotificationSettings, playBigBell, doVibrate } from "./use-order-notification.utils";

export type IncomingOrder = {
  assignmentId: string;
  code: string;
  customerName: string;
  orderValue: string;
  etaMinutes: number;
};

export function useOrderNotification(orders: IncomingOrder[]) {
  const prevIdsRef = useRef<string[]>([]);
  const [incoming, setIncoming] = useState<IncomingOrder[]>([]);

  useEffect(() => {
    const prev = prevIdsRef.current;
    const currentIds = orders.map((o) => o.assignmentId);
    const newOrders = orders.filter((o) => !prev.includes(o.assignmentId));

    if (newOrders.length > 0 && prev.length > 0) {
      const settings = readNotificationSettings();
      if (settings.soundEnabled) playBigBell();
      if (settings.vibrationEnabled) doVibrate();
      setIncoming(newOrders);
    }

    prevIdsRef.current = [...currentIds];
  }, [orders]);

  const dismiss = useCallback(() => {
    setIncoming([]);
  }, []);

  return { incoming, dismiss };
}
