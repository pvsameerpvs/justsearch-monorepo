"use client";

import { useMemo, useState } from 'react';
import { Clock3, MapPin, PackageCheck, PencilLine, ShieldCheck, User } from 'lucide-react';
import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';
import { formatCurrency } from '@/lib/format';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantDeliveryStatusBadge } from './restaurant-delivery-status-badge';
import { useRestaurantFulfillment } from './use-restaurant-fulfillment';

function getCheckoutLineTotal(item: {
  price: number;
  quantity: number;
  lineTotal?: number;
}) {
  return typeof item.lineTotal === 'number' ? item.lineTotal : item.price * item.quantity;
}

function formatOrderTime(value: number) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(value);
}

export function RestaurantCheckoutScreen({ restaurant }: { restaurant: Restaurant }) {
  const {
    setMode,
    cart,
    cartCount,
    total,
    deliverySavings,
    orders,
    placeOrder,
  } = useRestaurantFulfillment(restaurant);

  const [addressTitle, setAddressTitle] = useState('Work');
  const [address, setAddress] = useState('Dubai Damas tower, 28 Al Maktoum Road, Riggat Al Buteen, Dubai');
  const [addressDetails, setAddressDetails] = useState('305 office number');
  const [handoff, setHandoff] = useState('Hand it to me');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const currency = cart[0]?.currency ?? restaurant.menu[0]?.items[0]?.currency ?? 'AED';

  const latestOrder = useMemo(
    () => (placedOrderId ? orders.find((order) => order.id === placedOrderId) ?? null : null),
    [orders, placedOrderId],
  );
  const fallbackOrder = latestOrder ?? orders[0] ?? null;
  const displayItems = useMemo(
    (): Array<{
      itemId: string;
      quantity: number;
      name: string;
      price: number;
      currency: string;
      lineTotal: number;
    }> =>
      (cartCount > 0 ? cart : fallbackOrder?.items ?? []).map((item) => ({
        ...item,
        lineTotal: getCheckoutLineTotal(item),
      })),
    [cart, cartCount, fallbackOrder?.items],
  );
  const displayTotal = cartCount > 0 ? total : fallbackOrder?.total ?? 0;
  const displaySavings = cartCount > 0 ? deliverySavings : fallbackOrder?.deliverySavings ?? 0;

  const onPlaceOrder = () => {
    setMode('delivery');

    const combinedAddress = `${addressTitle} - ${address}\n${addressDetails}\n${handoff}${note ? `\n${note}` : ''}`;
    const orderId = placeOrder({
      address: combinedAddress,
      note,
    });

    if (!orderId) {
      setError('Add at least one item and a delivery address before placing the order.');
      return;
    }

    setError(null);
    setPlacedOrderId(orderId);
  };

  if (cartCount === 0 && orders.length === 0) {
    return (
      <section className="py-8 sm:py-10">
        <Container className="max-w-3xl">
          <EmptyState
            title="No delivery items yet"
            description="Add menu items in delivery mode, then come here to review address, summary, and place the order."
            action={
              <ButtonLink href="/menu" variant="primary" size="md">
                Back to menu
              </ButtonLink>
            }
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8">
      <Container className="max-w-3xl">
        <div className="space-y-5">
          <div className="rounded-[28px] border border-[rgb(var(--border)/0.8)] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-3 border-b border-[rgb(var(--border)/0.6)] px-5 py-4">
              <MapPin className="mt-1 h-5 w-5 text-[rgb(var(--brand))]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[rgb(var(--card-surface-muted)/0.9)] px-2 py-1 text-xs font-bold text-[rgb(var(--muted))]">
                    {addressTitle}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAddressTitle(addressTitle === 'Work' ? 'Home' : 'Work')}
                    className="text-xs font-semibold text-[rgb(var(--brand))]"
                  >
                    Switch
                  </button>
                </div>
                <input
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="mt-2 w-full bg-transparent text-[1.15rem] font-semibold leading-7 text-[rgb(var(--ink))] outline-none"
                />
                <input
                  value={addressDetails}
                  onChange={(event) => setAddressDetails(event.target.value)}
                  className="mt-1 w-full bg-transparent text-sm text-[rgb(var(--muted))] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-[rgb(var(--border)/0.6)] px-5 py-4">
              <User className="h-5 w-5 text-[rgb(var(--brand))]" />
              <button
                type="button"
                onClick={() =>
                  setHandoff((current) =>
                    current === 'Hand it to me' ? 'Leave at reception' : 'Hand it to me',
                  )
                }
                className="flex flex-1 items-center justify-between text-left"
              >
                <span className="text-xl font-semibold text-[rgb(var(--ink))]">{handoff}</span>
                <PencilLine className="h-5 w-5 text-[rgb(var(--muted))]" />
              </button>
            </div>

            <div className="px-5 py-4">
              <div className="flex items-center gap-3 text-[1.05rem] font-semibold text-[rgb(var(--ink))]">
                <Clock3 className="h-5 w-5 text-[rgb(var(--brand))]" />
                Est. arrival 16:05-16:15
              </div>

              <div className="mt-4 rounded-[20px] bg-[rgba(16,185,129,0.12)] px-4 py-3">
                <div className="flex items-center gap-2 text-base font-bold text-[rgb(5,150,105)]">
                  <ShieldCheck className="h-5 w-5" />
                  On-time Promise
                </div>
                <p className="mt-2 text-sm leading-6 text-[rgb(6,95,70)]">
                  If your order arrives late, the customer can receive a small voucher in the real flow.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgb(var(--border)/0.8)] bg-white px-5 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-3xl font-bold tracking-tight text-[rgb(var(--ink))]">Order summary</p>
                <p className="mt-1 text-sm text-[rgb(var(--muted))]">{restaurant.name}</p>
              </div>
              <ButtonLink href="/menu" variant="ghost" size="sm">
                Edit
              </ButtonLink>
            </div>

            <div className="mt-5 space-y-4">
              {displayItems.map((item) => (
                <div key={item.itemId} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold leading-7 text-[rgb(var(--ink))]">
                      {item.quantity} x {item.name}
                    </p>
                    <p className="mt-1 text-sm text-[rgb(var(--muted))]">One portion</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[rgb(var(--ink))]">
                      {formatCurrency(item.lineTotal, item.currency)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[18px] border border-[rgb(var(--border)/0.7)] px-4 py-3">
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="What to do if an item is out of stock?"
                className="w-full bg-transparent text-sm text-[rgb(var(--ink))] outline-none"
              />
            </div>

            <div className="mt-5 rounded-[18px] bg-[rgba(254,249,195,0.85)] px-4 py-3 text-sm font-semibold text-[rgb(146,64,14)]">
              You've got the best deal. {formatCurrency(displaySavings, currency)} off applied as free delivery.
            </div>
          </div>

          <div className="rounded-[28px] border border-[rgb(var(--border)/0.8)] bg-white px-5 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-3">
              <PackageCheck className="h-5 w-5 text-[rgb(var(--brand))]" />
              <div>
                <p className="text-xl font-bold text-[rgb(var(--ink))]">Order tracking</p>
                <p className="text-sm text-[rgb(var(--muted))]">
                  Customer-visible statuses: order confirmed, assign delivery boy, delivered order.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <p className="mt-4 text-sm text-[rgb(var(--muted))]">
                Place the order to start tracking.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-[18px] border border-[rgb(var(--border)/0.7)] bg-[rgb(var(--card-surface-muted)/0.45)] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-[rgb(var(--ink))]">Order #{order.id}</p>
                        <p className="mt-1 text-xs text-[rgb(var(--muted))]">{formatOrderTime(order.createdAt)}</p>
                      </div>
                      <RestaurantDeliveryStatusBadge status={order.status} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">{order.address}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      <div className="fixed inset-x-0 z-[9998] px-3 sm:px-6" style={{ bottom: 'calc(var(--restaurant-mobile-nav-height,0px) + 12px)' }}>
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-[24px] border border-[rgb(var(--border)/0.85)] bg-white px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
          <div className="min-w-0">
            <p className="text-3xl font-bold tracking-tight text-[rgb(var(--ink))]">
              Total {formatCurrency(displayTotal, currency)}
            </p>
            <p className="mt-1 text-sm font-semibold text-[rgb(var(--brand))]">
              {formatCurrency(displaySavings, currency)} off applied
            </p>
            {error ? <p className="mt-1 text-sm font-medium text-red-600">{error}</p> : null}
            {latestOrder ? (
              <p className="mt-1 text-sm font-medium text-emerald-600">
                Order #{latestOrder.id} placed successfully
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onPlaceOrder}
            disabled={cartCount === 0}
            className="inline-flex h-14 shrink-0 items-center justify-center rounded-[20px] bg-[#ffd814] px-8 text-xl font-bold text-[#2d2612] shadow-[0_14px_36px_rgba(255,216,20,0.34)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cartCount > 0 ? 'Place order' : 'Order placed'}
          </button>
        </div>
      </div>
    </section>
  );
}
