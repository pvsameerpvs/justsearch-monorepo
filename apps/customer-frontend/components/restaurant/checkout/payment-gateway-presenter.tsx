"use client";
import { Users, CreditCard, Wallet, Smartphone, Building2 } from 'lucide-react';
import { Button } from '@justsearch/ui';
import { PaymentMethodCard } from './payment-method-card';
import type { PaymentMethod } from './payment-gateway';
type Props = {
  totalAmount: number; currency: string; perPersonAmount: number;
  selectedMethod: PaymentMethod; onSelectMethod: (m: PaymentMethod) => void;
  isSplitBill: boolean; onToggleSplitBill: () => void; splitCount: number;
  onDecrementSplit: () => void; onIncrementSplit: () => void;
  isProcessing: boolean; onPay: () => void; onCancel: () => void;
};
export function PaymentGatewayPresenter({ totalAmount, currency, perPersonAmount, selectedMethod, onSelectMethod, isSplitBill, onToggleSplitBill, splitCount, onDecrementSplit, onIncrementSplit, isProcessing, onPay, onCancel }: Props) { return (
  <div className="space-y-5">
    <h2 className="text-xl font-bold text-slate-900">Payment</h2>
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
      <p className="text-sm text-slate-500">Total Amount</p>
      <p className="text-3xl font-black text-slate-900">{currency} {totalAmount.toLocaleString()}</p>
      {isSplitBill && <p className="mt-1 text-sm text-amber-600">{splitCount} people · {currency} {perPersonAmount.toLocaleString()} each</p>}
    </div>
    <div className="space-y-2">
      <PaymentMethodCard id="card" label="Credit/Debit Card" icon={CreditCard} isSelected={selectedMethod==='card'} onSelect={()=>onSelectMethod('card')} />
      <PaymentMethodCard id="apple_pay" label="Apple Pay" icon={Smartphone} isSelected={selectedMethod==='apple_pay'} onSelect={()=>onSelectMethod('apple_pay')} />
      <PaymentMethodCard id="google_pay" label="Google Pay" icon={Wallet} isSelected={selectedMethod==='google_pay'} onSelect={()=>onSelectMethod('google_pay')} />
      <PaymentMethodCard id="tabby" label="Tabby (Buy Now Pay Later)" icon={Building2} isSelected={selectedMethod==='tabby'} onSelect={()=>onSelectMethod('tabby')} />
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <button type="button" onClick={onToggleSplitBill} className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2"><Users className="h-5 w-5 text-slate-500" /><span className="font-semibold text-slate-900">Split Bill</span></div>
        <div className={`h-6 w-11 rounded-full transition-colors ${isSplitBill?'bg-amber-500':'bg-slate-300'}`}><div className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${isSplitBill?'translate-x-5':'translate-x-0.5'} mt-0.5`} /></div>
      </button>
      {isSplitBill && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm text-slate-600">People:</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onDecrementSplit} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">-</button>
            <span className="w-8 text-center font-bold">{splitCount}</span>
            <button type="button" onClick={onIncrementSplit} className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">+</button>
          </div>
        </div>
      )}
    </div>
    <div className="flex gap-3">
      <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
      <Button className="flex-1 bg-amber-500 hover:bg-amber-600" onClick={onPay} disabled={isProcessing}>{isProcessing ? 'Processing...' : `Pay ${currency} ${totalAmount.toLocaleString()}`}</Button>
    </div>
  </div>
); }
