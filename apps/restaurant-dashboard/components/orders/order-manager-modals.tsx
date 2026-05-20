"use client";

import { DeliveryBoyPicker } from "./delivery-boy-picker";
import { OrderDetailDrawer } from "./order-detail-drawer";
import { CancelReasonPicker } from "./cancel-reason-picker";
import type { DashboardOrder } from "@/lib/stores/order-store";

interface OrderManagerModalsProps {
  assigningOrderId: string | null;
  viewingOrderId: string | null;
  rejectingOrder: DashboardOrder | null;
  onCloseAssign: () => void;
  onCloseView: () => void;
  onAssignFromView: () => void;
  onRejectFromView: () => void;
  onConfirmReject: (reason: string) => void;
  onCloseReject: () => void;
}

export function OrderManagerModals({
  assigningOrderId,
  viewingOrderId,
  rejectingOrder,
  onCloseAssign,
  onCloseView,
  onAssignFromView,
  onRejectFromView,
  onConfirmReject,
  onCloseReject,
}: OrderManagerModalsProps) {
  return (
    <>
      {assigningOrderId && (
        <DeliveryBoyPicker orderId={assigningOrderId} onClose={onCloseAssign} />
      )}

      {viewingOrderId && (
        <OrderDetailDrawer
          orderId={viewingOrderId}
          onClose={onCloseView}
          onAssign={onAssignFromView}
          onReject={onRejectFromView}
        />
      )}

      {rejectingOrder && (
        <CancelReasonPicker
          orderCode={rejectingOrder.code}
          onConfirm={onConfirmReject}
          onClose={onCloseReject}
        />
      )}
    </>
  );
}
