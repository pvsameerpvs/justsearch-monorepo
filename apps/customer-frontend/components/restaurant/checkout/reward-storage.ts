import type { VoucherWalletEntry } from './reward-types';

export const REWARD_STORAGE_PREFIX = 'justsearch:restaurant:reward';
export const VOUCHER_WALLET_STORAGE_KEY = `${REWARD_STORAGE_PREFIX}:wallet`;
export const REWARD_SEEN_PREFIX = `${REWARD_STORAGE_PREFIX}:seen`;
export const WELCOME_REWARD_DELAY_MS = 5_000;
export const ORDER_REWARD_DELAY_MS = 10_000;

export const DEFAULT_VOUCHER_WALLET: VoucherWalletEntry[] = [];

function normalizeRewardKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ':');
}

export function normalizePhoneKey(mobile: string) {
  return mobile.replace(/\D/g, '');
}

export function getWelcomeRewardSeenKey(restaurantId: string, mobile: string) {
  return `${REWARD_SEEN_PREFIX}:welcome:${normalizeRewardKey(restaurantId)}:${normalizePhoneKey(mobile)}`;
}

export function getOrderRewardSeenKey(restaurantId: string, orderId: string) {
  return `${REWARD_SEEN_PREFIX}:order:${normalizeRewardKey(restaurantId)}:${normalizeRewardKey(orderId)}`;
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

