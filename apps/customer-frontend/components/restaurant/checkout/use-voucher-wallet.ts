"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_VOUCHER_WALLET,
  VOUCHER_WALLET_STORAGE_KEY,
  readJsonStorage,
  writeJsonStorage,
} from './reward-storage';
import type {
  VoucherWalletEntry,
  VoucherWalletInput,
  VoucherDiscount,
} from './reward-types';

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

const UPDATED_EVENT = 'justsearch:voucherWalletUpdated';

function createWalletEntry(input: VoucherWalletInput): VoucherWalletEntry {
  return {
    id: input.id ?? `voucher-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`,
    code: normalizeCode(input.code),
    title: input.title,
    discountLabel: input.discountLabel,
    discount: input.discount,
    expiryLabel: input.expiryLabel,
    isUsed: input.isUsed ?? false,
    source: input.source,
    createdAt: input.createdAt ?? Date.now(),
    mobile: input.mobile,
    orderId: input.orderId,
  };
}

function isVoucherDiscount(value: unknown): value is VoucherDiscount {
  if (!value || typeof value !== 'object') return false;
  const discount = value as Record<string, unknown>;
  if (discount.kind === 'free_delivery') return true;
  if (discount.kind === 'percent' || discount.kind === 'flat') {
    return typeof discount.value === 'number' && Number.isFinite(discount.value);
  }
  return false;
}

function isVoucherWalletEntry(value: unknown): value is VoucherWalletEntry {
  if (!value || typeof value !== 'object') return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    typeof entry.code === 'string' &&
    typeof entry.title === 'string' &&
    typeof entry.discountLabel === 'string' &&
    typeof entry.expiryLabel === 'string' &&
    typeof entry.isUsed === 'boolean' &&
    typeof entry.source === 'string' &&
    typeof entry.createdAt === 'number' &&
    isVoucherDiscount(entry.discount)
  );
}

function readWalletEntries(): VoucherWalletEntry[] {
  if (typeof window === 'undefined') {
    return DEFAULT_VOUCHER_WALLET;
  }

  const stored = readJsonStorage<unknown>(VOUCHER_WALLET_STORAGE_KEY, null);
  if (!stored) {
    return DEFAULT_VOUCHER_WALLET;
  }

  if (!Array.isArray(stored)) {
    return DEFAULT_VOUCHER_WALLET;
  }

  const entries = stored.filter(isVoucherWalletEntry);
  return entries.length > 0 ? entries : DEFAULT_VOUCHER_WALLET;
}

function sortEntries(entries: VoucherWalletEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.isUsed !== b.isUsed) {
      return Number(a.isUsed) - Number(b.isUsed);
    }

    return b.createdAt - a.createdAt;
  });
}

export function getVoucherDiscountAmount(voucher: VoucherWalletEntry, subtotal: number) {
  if (voucher.discount.kind === 'percent') {
    return Math.max(0, Math.round((subtotal * voucher.discount.value) / 100));
  }

  if (voucher.discount.kind === 'flat') {
    return Math.max(0, Math.min(subtotal, voucher.discount.value));
  }

  return 0;
}

export function useVoucherWallet() {
  const [wallet, setWallet] = useState<VoucherWalletEntry[]>(DEFAULT_VOUCHER_WALLET);

  useEffect(() => {
    const initial = readWalletEntries();
    const normalized = sortEntries(initial);
    setWallet(normalized);

    if (typeof window !== 'undefined' && !window.localStorage.getItem(VOUCHER_WALLET_STORAGE_KEY)) {
      writeJsonStorage(VOUCHER_WALLET_STORAGE_KEY, normalized);
    }
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== VOUCHER_WALLET_STORAGE_KEY) return;
      setWallet(sortEntries(readWalletEntries()));
    };

    window.addEventListener('storage', onStorage);
    const onUpdated = () => setWallet(sortEntries(readWalletEntries()));

    window.addEventListener(UPDATED_EVENT, onUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(UPDATED_EVENT, onUpdated);
    };
  }, []);

  const commit = useCallback(
    (updater: (current: VoucherWalletEntry[]) => VoucherWalletEntry[]) => {
      setWallet((current) => {
        const next = sortEntries(updater(current));
        writeJsonStorage(VOUCHER_WALLET_STORAGE_KEY, next);
        window.dispatchEvent(new Event(UPDATED_EVENT));
        return next;
      });
    },
    [],
  );

  const addVoucher = useCallback(
    (input: VoucherWalletInput) => {
      const nextEntry = createWalletEntry(input);
      commit((current) => [
        nextEntry,
        ...current.filter((entry) => entry.code !== nextEntry.code),
      ]);
      return nextEntry;
    },
    [commit],
  );

  const markVoucherUsed = useCallback(
    (code: string) => {
      const normalized = normalizeCode(code);
      commit((current) =>
        current.map((entry) =>
          entry.code === normalized ? { ...entry, isUsed: true } : entry,
        ),
      );
    },
    [commit],
  );

  const findVoucherByCode = useCallback(
    (code: string) => {
      const normalized = normalizeCode(code);
      return wallet.find((entry) => entry.code === normalized) ?? null;
    },
    [wallet],
  );

  const activeVouchers = useMemo(
    () => wallet.filter((entry) => !entry.isUsed),
    [wallet],
  );

  return {
    wallet,
    activeVouchers,
    addVoucher,
    markVoucherUsed,
    findVoucherByCode,
    getVoucherDiscountAmount,
  };
}
