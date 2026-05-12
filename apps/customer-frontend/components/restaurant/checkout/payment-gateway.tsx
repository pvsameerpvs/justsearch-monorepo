"use client";

import { useState, useCallback } from 'react';
import { CreditCard, Wallet, Smartphone, Building2, Users } from 'lucide-react';
import { Button } from '@justsearch/ui';

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'tabby';

export type SplitBillPayer = {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
};

type PaymentGatewayProps = {
  totalAmount: number;
  currency: string;
  onPay: (method: PaymentMethod, splitPayers?: SplitBillPayer[]) => void;
  onCancel: () => void;
};

const PAYMENT_METHODS = [
  { id: 'card' as PaymentMethod, label: 'Credit/Debit Card', icon: CreditCard },
  { id: 'apple_pay' as PaymentMethod, label: 'Apple Pay', icon: Smartphone },
  { id: 'google_pay' as PaymentMethod, label: 'Google Pay', icon: Wallet },
  { id: 'tabby' as PaymentMethod, label: 'Tabby (Buy Now Pay Later)', icon: Building2 },
];

export function PaymentGateway({ totalAmount, currency, onPay, onCancel }: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [isSplitBill, setIsSplitBill] = useState(false);
  const [splitCount, setSplitCount] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);

  const perPersonAmount = Math.ceil(totalAmount / splitCount);

  const handlePay = useCallback(() => {
    setIsProcessing(true);

    if (isSplitBill) {
      const payers: SplitBillPayer[] = Array.from({ length: splitCount }, (_, i) => ({
        id: `payer-${i}`,
        name: i === 0 ? 'You' : `Person ${i + 1}`,
        amount: perPersonAmount,
        paid: i === 0,
      }));
      onPay(selectedMethod, payers);
    } else {
      onPay(selectedMethod);
    }
  }, [isSplitBill, onPay, perPersonAmount, selectedMethod, splitCount]);

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-slate-900">Payment</h2>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
        <p className="text-sm text-slate-500">Total Amount</p>
        <p className="text-3xl font-black text-slate-900">
          {currency} {totalAmount.toLocaleString()}
        </p>
        {isSplitBill && (
          <p className="mt-1 text-sm text-amber-600">
            {splitCount} people · {currency} {perPersonAmount.toLocaleString()} each
          </p>
        )}
      </div>

      <div className="space-y-2">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                selectedMethod === method.id
                  ? 'border-amber-400 bg-amber-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selectedMethod === method.id ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="flex-1 font-semibold text-slate-900">{method.label}</span>
              {selectedMethod === method.id && (
                <div className="h-5 w-5 rounded-full border-4 border-amber-500 bg-white" />
              )}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <button
          type="button"
          onClick={() => setIsSplitBill(!isSplitBill)}
          className="flex w-full items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-500" />
            <span className="font-semibold text-slate-900">Split Bill</span>
          </div>
          <div
            className={`h-6 w-11 rounded-full transition-colors ${
              isSplitBill ? 'bg-amber-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                isSplitBill ? 'translate-x-5' : 'translate-x-0.5'
              } mt-0.5`}
            />
          </div>
        </button>

        {isSplitBill && (
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm text-slate-600">People:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700"
              >
                -
              </button>
              <span className="w-8 text-center font-bold">{splitCount}</span>
              <button
                type="button"
                onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="flex-1 bg-amber-500 hover:bg-amber-600"
          onClick={handlePay}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ${currency} ${totalAmount.toLocaleString()}`}
        </Button>
      </div>
    </div>
  );
}
