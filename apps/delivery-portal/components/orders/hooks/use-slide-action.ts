"use client";

import { useState, useRef, useCallback } from "react";
import { useMotionValue, animate } from "framer-motion";
import type { DeliveryOrder, DeliveryOrderStatus } from "@/lib/delivery-types";

const STATUS_FLOW: DeliveryOrderStatus[] = ["assigned", "picked_up", "on_route", "arrived", "delivered"];

export function useSlideAction(order: DeliveryOrder, onUpdateStatus: (orderId: string, status: DeliveryOrderStatus) => void) {
  const activeIndex = STATUS_FLOW.indexOf(order.status);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  const doStatusUpdate = useCallback((next: DeliveryOrderStatus) => {
    onUpdateStatus(order.id, next);
    setTimeout(() => { setIsComplete(false); setShowPaymentPicker(false); animate(x, 0, { type: "spring", stiffness: 500, damping: 30 }); }, 400);
  }, [order.id, onUpdateStatus, x]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
      const containerWidth = containerRef.current?.offsetWidth ?? 300;
      if (info.offset.x > containerWidth * 0.65) {
        setIsComplete(true);
        const next = STATUS_FLOW[activeIndex + 1];
        if (!next) { setIsDragging(false); return; }
        if (order.status === "arrived" && next === "delivered") {
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
