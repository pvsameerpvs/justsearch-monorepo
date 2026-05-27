"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DriverOrderIncomingAlert } from "@/components/orders/driver-order-incoming-alert";
import { useDriverAuth } from "@/lib/driver-auth-store";
import { useRealtimeOrderAlerts } from "@/lib/hooks/use-realtime-order-alerts";

export function RealtimeOrderAlertListener() {
  const { driverId, hydrated, isLoggedIn } = useDriverAuth();
  const queryClient = useQueryClient();
  const enabledDriverId = hydrated && isLoggedIn ? driverId : null;

  const handleOrderReceived = useCallback(() => {
    if (!enabledDriverId) return;
    void queryClient.invalidateQueries({
      queryKey: ["driverAssignments", enabledDriverId],
    });
  }, [enabledDriverId, queryClient]);

  const { incoming, dismiss } = useRealtimeOrderAlerts({
    driverId: enabledDriverId,
    onOrderReceived: handleOrderReceived,
  });

  return <DriverOrderIncomingAlert orders={incoming} onDismiss={dismiss} />;
}
