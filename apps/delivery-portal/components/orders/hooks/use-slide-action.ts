"use client";

import { useState, useRef, useCallback } from "react";
import { useMotionValue, animate } from "framer-motion";
import type { DeliveryOrder, DeliveryOrderStatus } from "@/lib/delivery-types";

const STATUS_FLOW: DeliveryOrderStatus[] = ["assigned", "picked_up", "on_route", "delivered"];

const PORTAL_TO_ASSIGNMENT_STATUS: Record<string, string> = {
  picked_up: 'picked_up',
  on_route: 'in_transit',
  delivered: 'delivered',
};

export function useSlideAction(order: DeliveryOrder, onUpdateStatus: (assignmentId: string, status: string) => void) {
  const activeIndex = STATUS_FLOW.indexOf(order.status);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  const doStatusUpdate = useCallback((next: DeliveryOrderStatus) => {
    const assignmentStatus = PORTAL_TO_ASSIGNMENT_STATUS[next] || next;
    onUpdateStatus(order.assignmentId, assignmentStatus);
    setTimeout(() => { setIsComplete(false); setShowPaymentPicker(false); animate(x, 0, { type: "spring", stiffness: 500, damping: 30 }); }, 400);
  }, [order.assignmentId, onUpdateStatus, x]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
      const containerWidth = containerRef.current?.offsetWidth ?? 300;
      if (info.offset.x > containerWidth * 0.65) {
        setIsComplete(true);
        const next = STATUS_FLOW[activeIndex + 1];
        if (!next) { setIsDragging(false); return; }
        if (order.status === "on_route" && next === "delivered") {
          setTimeout(() => setShowPaymentPicker(true), 200);
        } else {
          setTimeout(() => doStatusUpdate(next), 200);
        }
      } else {
        animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
      }
      setIsDragging(false);
    },
    [activeIndex, doStatusUpdate, order.status, x]
  );

  const handleCancel = useCallback(() => {
    setShowPaymentPicker(false);
    setIsComplete(false);
    animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
  }, [x]);

  return {
    x, containerRef, isDragging, isComplete, showPaymentPicker,
    setIsDragging, doStatusUpdate, handleDragEnd, handleCancel,
  };
}
