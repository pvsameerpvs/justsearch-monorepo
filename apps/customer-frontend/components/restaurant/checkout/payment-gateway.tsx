"use client";

import { useState, useCallback } from 'react';
import { PaymentGatewayPresenter } from './payment-gateway-presenter';

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'tabby';

export type SplitBillPayer = {
  id: string; name: string; amount: number; paid: boolean;
};

type PaymentGatewayProps = {
  totalAmount: number; currency: string;
  onPay: (method: PaymentMethod, splitPayers?: SplitBillPayer[]) => void;
  onCancel: () => void;
};

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
        id: `payer-${i}`, name: i === 0 ? 'You' : `Person ${i + 1}`, amount: perPersonAmount, paid: i === 0,
      }));
      onPay(selectedMethod, payers);
    } else {
      onPay(selectedMethod);
    }
  }, [isSplitBill, onPay, perPersonAmount, selectedMethod, splitCount]);

  return (
    <PaymentGatewayPresenter
      totalAmount={totalAmount}
      currency={currency}
      perPersonAmount={perPersonAmount}
      selectedMethod={selectedMethod}
      onSelectMethod={setSelectedMethod}
      isSplitBill={isSplitBill}
      onToggleSplitBill={() => setIsSplitBill((s) => !s)}
      splitCount={splitCount}
      onDecrementSplit={() => setSplitCount((c) => Math.max(2, c - 1))}
      onIncrementSplit={() => setSplitCount((c) => Math.min(10, c + 1))}
      isProcessing={isProcessing}
      onPay={handlePay}
      onCancel={onCancel}
    />
  );
}
