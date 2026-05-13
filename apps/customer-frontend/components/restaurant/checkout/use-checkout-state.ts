"use client";

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRestaurantFulfillment, type DeliveryCartLine } from '../use-restaurant-fulfillment';
import { getVoucherDiscountAmount, useVoucherWallet } from './use-voucher-wallet';
import { type SavedAddress, useAddressBook } from '../use-address-book';

const ORDER_PLACING_DURATION_MS = 1800;

function getCheckoutLineTotal(item: { price: number; quantity: number; lineTotal?: number }): number {
  return typeof item.lineTotal === 'number' ? item.lineTotal : item.price * item.quantity;
}

export function useCheckoutState() {
  const router = useRouter();
  const { cart, cartCount, total, deliverySavings, placeOrder } = useRestaurantFulfillment();
  const { findVoucherByCode, markVoucherUsed } = useVoucherWallet();
  const { addresses, addAddress, hydrated: addressesHydrated } = useAddressBook();

  const [addressTitle, setAddressTitle] = useState('Home');
  const [address, setAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressBookOpen, setIsAddressBookOpen] = useState(false);
  const [handoff, setHandoff] = useState('Hand it to me');
  const [restaurantNote, setRestaurantNote] = useState('');
  const [riderNote, setRiderNote] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [placingOrder, setPlacingOrder] = useState<{ orderId: string; startedAt: number } | null>(null);
  const [placingProgress, setPlacingProgress] = useState(0);

  const applySavedAddress = (savedAddress: SavedAddress) => {
    setSelectedAddressId(savedAddress.id);
    setAddressTitle(savedAddress.label);
    setAddress(savedAddress.address);
    setAddressDetails(savedAddress.details);
    setAlternateNumber(savedAddress.alternateNumber || '');
  };

  const applyCurrentLocationAddress = (resolvedAddress: string) => {
    setSelectedAddressId(null);
    setAddressTitle('Current location');
    setAddress(resolvedAddress);
    setAddressDetails('');
    setAlternateNumber('');
  };

  useEffect(() => {
    if (!addressesHydrated || addresses.length === 0) return;
    const selectedAddress = addresses.find((item) => item.id === selectedAddressId);
    if (selectedAddress) return;
    if (!address || !selectedAddressId) {
      applySavedAddress(addresses[0]);
    }
  }, [address, addresses, addressesHydrated, selectedAddressId]);

  const displayItems = useMemo(
    () => cart.map((item: DeliveryCartLine) => ({ ...item, lineTotal: getCheckoutLineTotal(item) })),
    [cart],
  );

  const appliedVoucher = useMemo(
    () => (appliedPromoCode ? findVoucherByCode(appliedPromoCode) : null),
    [appliedPromoCode, findVoucherByCode],
  );

  const promoDiscountAmount = useMemo(
    () => (appliedVoucher && !appliedVoucher.isUsed ? getVoucherDiscountAmount(appliedVoucher, total) : 0),
    [appliedVoucher, total],
  );

  const displayTotal = Math.max(0, total - promoDiscountAmount);
  const displaySavings = deliverySavings + promoDiscountAmount;

  useEffect(() => {
    if (!placingOrder) {
      setPlacingProgress(0);
      return;
    }

    let frameId = 0;
    const animate = () => {
      const elapsed = Date.now() - placingOrder.startedAt;
      const nextProgress = Math.min(1, elapsed / ORDER_PLACING_DURATION_MS);
      setPlacingProgress(nextProgress);
      if (nextProgress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    const redirectTimer = window.setTimeout(() => {
      router.push(`/menu/checkout/status/${encodeURIComponent(placingOrder.orderId)}`);
    }, ORDER_PLACING_DURATION_MS + 1000);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(redirectTimer);
    };
  }, [placingOrder, router]);

  const onPlaceOrder = () => {
    if (placingOrder) return;

    const combinedAddress = `${addressTitle} - ${address}\n${addressDetails}${alternateNumber ? `\nAlt number: ${alternateNumber}` : ''}\n${handoff}${riderNote ? `\nNote for rider: ${riderNote}` : ''}`;
    const promoSnapshot = appliedVoucher && !appliedVoucher.isUsed
      ? { code: appliedVoucher.code, discount: promoDiscountAmount }
      : null;

    const orderId = placeOrder({
      address: combinedAddress,
      note: restaurantNote,
      promoCode: promoSnapshot?.code,
      promoDiscount: promoSnapshot?.discount,
    });

    if (!orderId) {
      setError('Add at least one item and a delivery address before placing the order.');
      return;
    }

    if (promoSnapshot) {
      markVoucherUsed(promoSnapshot.code);
    }

    setError(null);
    setPlacedOrderId(orderId);
    setPlacingOrder({ orderId, startedAt: Date.now() });
  };

  const applyPromoCode = () => {
    const normalized = promoCode.trim().toUpperCase();
    if (!normalized) {
      setAppliedPromoCode(null);
      return;
    }
    const voucher = findVoucherByCode(normalized);
    if (!voucher || voucher.isUsed) return;
    setAppliedPromoCode(voucher.code);
  };

  return {
    cartCount,
    total,
    currency: cart[0]?.currency ?? 'AED',
    addressTitle,
    address,
    addressDetails,
    alternateNumber,
    setAlternateNumber,
    handoff,
    setHandoff,
    riderNote,
    setRiderNote,
    restaurantNote,
    setRestaurantNote,
    addresses,
    addAddress,
    isAddressBookOpen,
    setIsAddressBookOpen,
    selectedAddressId,
    displayItems,
    displaySavings,
    displayTotal,
    promoCode,
    setPromoCode,
    onApplyPromo: applyPromoCode,
    error,
    placedOrderId,
    placingOrder,
    placingProgress,
    onPlaceOrder,
    applySavedAddress,
    applyCurrentLocationAddress,
  };
}
