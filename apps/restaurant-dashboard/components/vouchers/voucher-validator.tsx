"use client";

import { useState } from 'react';
import { useVoucherWallet } from '@/lib/voucher-wallet';
import { Ticket, ScanLine } from 'lucide-react';
import { ValidationResultCard, VoucherListItem } from './voucher-cards';

export function VoucherValidator() {
  const { vouchers } = useVoucherWallet();
  const [scanCode, setScanCode] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    message: string;
    voucher?: { title: string; discountLabel: string };
  } | null>(null);

  const handleValidate = () => {
    const code = scanCode.trim().toUpperCase();
    const voucher = vouchers.find((v: { code: string; isUsed: boolean }) => v.code === code && !v.isUsed);
    if (voucher) {
      setResult({
        valid: true,
        message: 'Voucher validated successfully!',
        voucher: { title: voucher.title, discountLabel: voucher.discountLabel },
      });
    } else {
      setResult({
        valid: false,
        message: 'Invalid or already used voucher code.',
      });
    }
  };

  const activeVouchers = vouchers.filter((v: { isUsed: boolean }) => !v.isUsed);

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <ScanLine className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Validate Voucher</h3>
            <p className="text-sm text-slate-500">Enter customer voucher code</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME20"
              className="input-premium w-full font-mono uppercase tracking-wider"
            />
          </div>
          <button
            type="button"
            onClick={handleValidate}
            className="btn-primary px-6"
          >
            <Ticket className="mr-2 h-4 w-4" />
            Validate
          </button>
        </div>

        {result && <ValidationResultCard result={result} />}
      </div>

      <div className="card-premium p-5">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Active Vouchers</h3>
        <div className="space-y-3">
          {activeVouchers.map((v: { id: string; code: string; title: string; discountLabel: string; expiryLabel: string }) => (
            <VoucherListItem key={v.id} voucher={v} />
          ))}
          {activeVouchers.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Ticket className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No active vouchers</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
