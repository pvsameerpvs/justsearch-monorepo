import type { VoucherWalletEntry } from './reward-types';

export const REWARD_STORAGE_PREFIX = 'justsearch:restaurant:reward';
export const VOUCHER_WALLET_STORAGE_KEY = `${REWARD_STORAGE_PREFIX}:wallet`;
export const REWARD_SEEN_PREFIX = `${REWARD_STORAGE_PREFIX}:seen`;
export const WELCOME_REWARD_DELAY_MS = 5_000;
export const ORDER_REWARD_DELAY_MS = 10_000;

function createWalletId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}

function makeWalletEntry(
  entry: Omit<VoucherWalletEntry, 'id' | 'createdAt' | 'isUsed'> & Partial<Pick<VoucherWalletEntry, 'id' | 'createdAt' | 'isUsed'>>,
): VoucherWalletEntry {
  return {
    id: entry.id ?? createWalletId('voucher'),
    createdAt: entry.createdAt ?? Date.now(),
    isUsed: entry.isUsed ?? false,
    ...entry,
  };
}

export const DEFAULT_VOUCHER_WALLET: VoucherWalletEntry[] = [
  makeWalletEntry({
    code: 'WELCOME30',
    discountLabel: '30% OFF',
    title: 'First Order Special',
    expiryLabel: 'Expires in 5 days',
    discount: { kind: 'percent', value: 30 },
    source: 'seed',
  }),
  makeWalletEntry({
    code: 'FREE-DELIVERY',
    discountLabel: 'FREE',
    title: 'Weekend Delivery Promo',
    expiryLabel: 'Expires in 2 days',
    discount: { kind: 'free_delivery' },
    source: 'seed',
  }),
  makeWalletEntry({
    code: 'BURGER-LOVE',
    discountLabel: 'AED 15',
    title: 'Burger Category Reward',
    expiryLabel: 'Used 2 weeks ago',
    discount: { kind: 'flat', value: 15 },
    source: 'seed',
    isUsed: true,
  }),
];

function normalizeRewardKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ':');
}

export function normalizePhoneKey(mobile: string) {
  return mobile.replace(/\D/g, '');
}

export function getWelcomeRewardSeenKey(mobile: string) {
  return `${REWARD_SEEN_PREFIX}:welcome:${normalizePhoneKey(mobile)}`;
}

export function getOrderRewardSeenKey(orderId: string) {
  return `${REWARD_SEEN_PREFIX}:order:${normalizeRewardKey(orderId)}`;
}

export function getRewardSeenKey(rewardId: string) {
  return `${REWARD_SEEN_PREFIX}:${normalizeRewardKey(rewardId)}`;
}

export function readJsonStorage<T>(key: string, fallback: T) {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJsonStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function readBooleanStorage(key: string) {
  return readJsonStorage<boolean>(key, false);
}

export function writeBooleanStorage(key: string, value: boolean) {
  writeJsonStorage(key, Boolean(value));
}

