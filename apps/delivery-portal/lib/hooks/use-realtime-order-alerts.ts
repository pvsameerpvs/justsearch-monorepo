"use client";

import { useCallback, useEffect, useState } from "react";
import { mergeIncomingOrders } from "@/lib/realtime/incoming-order-utils";
import { rememberRealtimeOrder } from "@/lib/realtime/realtime-order-memory";
import { parseRealtimeOrderMessage, toIncomingOrder } from "@/lib/realtime/realtime-order-message";
import { connectDeliveryRealtime } from "@/lib/realtime/realtime-socket";
import { useEnhancedNotification } from "./use-enhanced-notification";
import type { IncomingOrder } from "./use-order-notification";

type RealtimeOrderAlertArgs = {
  driverId: string | null;
  onOrderReceived: () => void | Promise<void>;
};

export function useRealtimeOrderAlerts({
  driverId,
  onOrderReceived,
}: RealtimeOrderAlertArgs) {
  const [incoming, setIncoming] = useState<IncomingOrder[]>([]);
  const { startPersistentAlarm, stopPersistentAlarm, doVibrate } = useEnhancedNotification();

  useEffect(() => () => stopPersistentAlarm(), [stopPersistentAlarm]);

  useEffect(() => {
    if (driverId) return;
    stopPersistentAlarm();
    setIncoming([]);
  }, [driverId, stopPersistentAlarm]);

  const handleOrder = useCallback(
    (data: unknown) => {
      const message = parseRealtimeOrderMessage(data);
      if (!message) return;

      rememberRealtimeOrder(message.orderId);
      setIncoming((current) => mergeIncomingOrders([toIncomingOrder(message)], current));
      startPersistentAlarm();
      doVibrate();
      void onOrderReceived();
    },
    [doVibrate, onOrderReceived, startPersistentAlarm]
  );

  useEffect(() => {
    if (!driverId || typeof window === "undefined") return;
    return connectDeliveryRealtime({
      onMessage: handleOrder,
      onOpen: onOrderReceived,
    });
  }, [driverId, handleOrder, onOrderReceived]);

  const dismiss = useCallback(() => {
    stopPersistentAlarm();
    setIncoming([]);
  }, [stopPersistentAlarm]);

  return { incoming, dismiss };
}
