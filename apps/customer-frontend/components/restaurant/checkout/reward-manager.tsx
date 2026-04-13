"use client";

import { useEffect, useState } from 'react';
import { useRestaurantFulfillment } from '../use-restaurant-fulfillment';
import { ScratchCard } from './scratch-card';
import { AnimatePresence } from 'framer-motion';

/**
 * GLOBAL REWARD MANAGER
 * This component is invisible and lives at the root of the app.
 * It monitors orders and triggers the Scratch Card 3 seconds after a new order is placed,
 * regardless of what page the user is on.
 */
export function RewardManager() {
  const { hydrated, orders } = useRestaurantFulfillment();
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated || orders.length === 0) return;

    const latestOrder = orders[0];
    const orderId = latestOrder.id;
    
    // 1. Check if the order is fresh (placed in the last 10 mins)
    const isNewOrder = (Date.now() - latestOrder.createdAt) < 600000;
    if (!isNewOrder) return;

    // 2. Check if already shown in this session
    const shownKey = `scratch_shown_${orderId}`;
    if (sessionStorage.getItem(shownKey)) return;

    // 3. Trigger the 3-second countdown
    // This will now survive page changes and status updates
    const timer = setTimeout(() => {
      setActiveOrderId(orderId);
      setShowScratchCard(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [orders[0]?.id, hydrated]); // Only re-run if the latest order ID or hydration status changes

  const handleClose = () => {
    if (activeOrderId) {
      sessionStorage.setItem(`scratch_shown_${activeOrderId}`, 'true');
    }
    setShowScratchCard(false);
    setActiveOrderId(null);
  };

  return (
    <AnimatePresence>
      {showScratchCard && (
        <ScratchCard onClose={handleClose} />
      )}
    </AnimatePresence>
  );
}
