"use client";

import { useState } from 'react';
import { Button } from '@justsearch/ui';
import { useVoucherWallet } from '@/lib/voucher-wallet';
import { Check, X, Ticket } from 'lucide-react';

export function VoucherValidator() {
  const { vouchers } = useVoucherWallet();
  const [scanCode, setScanCode] = useState('');
  const [result, setResult] = useState<{
    valid: boolean;
    message: string;
    voucher?: { title: string; discountLabel: string };
  } | null>(null);

  const handleValidate = () => {
    const voucher = vouchers.find((v) => v.code === scanCode && !v.isUsed);
    if (voucher) {
      setResult({
        valid: true,
        message: 'Voucher is valid!',
        voucher: { title: voucher.title, discountLabel: voucher.discountLabel },
      });
    } else {
      setResult({
        valid: false,
        message: 'Invalid or already used voucher.',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900">Voucher Validation</h3>

      <div className="flex gap-2">
        <input
          value={scanCode}
          onChange={(e) => setScanCode(e.target.value.toUpperCase())}
          placeholder="Enter voucher code"
          className="flex-1 rounded-xl border border-slate-200 p-3 text-sm font-mono uppercase"
        />
        <Button onClick={handleValidate} className="bg-amber-500 hover:bg-amber-600">
          <Ticket className="mr-2 h-4 w-4" />
          Validate
        </Button>
      </div>

      {result && (
        <div
          className={`rounded-xl border p-4 ${
            result.valid
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.valid ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
            <span className={result.valid ? 'text-green-800' : 'text-red-800'}>
              {result.message}
            </span>
          </div>
          {result.voucher && (
            <div className="mt-2 text-sm text-green-700">
              <p className="font-bold">{result.voucher.title}</p>
              <p>{result.voucher.discountLabel}</p>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="font-semibold text-slate-900">Active Vouchers</h4>
        <div className="mt-2 space-y-2">
          {vouchers.filter((v) => !v.isUsed).map((v) => (
            <div key={v.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <div>
                <p className="text-sm font-bold text-slate-900">{v.title}</p>
                <p className="text-xs font-mono text-slate-500">{v.code}</p>
              </div>
              <span className="text-xs font-bold text-amber-600">{v.discountLabel}</span>
            </div>
          ))}
          {vouchers.filter((v) => !v.isUsed).length === 0 && (
            <p className="text-sm text-slate-500">No active vouchers</p>
          )}
        </div>
      </div>
    </div>
  );
}
