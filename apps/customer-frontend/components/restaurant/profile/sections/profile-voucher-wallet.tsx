"use client";

import { Ticket, Clock, Info, CheckCircle2 } from 'lucide-react';
import { Surface } from '@/components/shared/surface';

type Voucher = {
  id: string;
  code: string;
  discount: string;
  title: string;
  expiry: string;
  isUsed?: boolean;
};

const VOUCHERS: Voucher[] = [
  {
    id: '1',
    code: 'WELCOME30',
    discount: '30% OFF',
    title: 'First Order Special',
    expiry: 'Expires in 5 days',
  },
  {
    id: '2',
    code: 'FREE-DELIVERY',
    discount: 'FREE',
    title: 'Weekend Delivery Promo',
    expiry: 'Expires in 2 days',
  },
  {
    id: '3',
    code: 'BURGER-LOVE',
    discount: 'AED 15',
    title: 'Burger Category Reward',
    expiry: 'Used 2 weeks ago',
    isUsed: true
  },
];

export function ProfileVoucherWallet() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {VOUCHERS.map((voucher) => (
          <Surface 
            key={voucher.id}
            className={`group relative overflow-hidden rounded-[28px] border-white/60 p-6 transition-all ${
              voucher.isUsed ? 'bg-slate-50/80 grayscale' : 'bg-white/80 hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]'
            }`}
          >
            {/* Ticket Cutout Effect */}
            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[rgb(var(--background))]" />
            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-[rgb(var(--background))]" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[rgb(var(--brand-soft)/0.45)] text-[rgb(var(--brand))] ${voucher.isUsed ? 'bg-slate-200 text-slate-400' : ''}`}>
                  <Ticket className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[rgb(var(--brand))]">
                    {voucher.discount}
                  </h3>
                  <p className="mt-0.5 text-lg font-bold text-[rgb(var(--ink))]">
                    {voucher.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[rgb(var(--muted))]">
                    <Clock className="h-3 w-3" />
                    {voucher.expiry}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl border-2 border-dashed border-slate-200 px-4 py-2.5 bg-slate-50/50">
                  <p className="font-mono text-sm font-bold tracking-widest text-[rgb(var(--ink))]">
                    {voucher.code}
                  </p>
                </div>
                {voucher.isUsed ? (
                   <CheckCircle2 className="h-6 w-6 text-slate-400" />
                ) : (
                  <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg transition-transform hover:scale-110">
                    <Info className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </Surface>
        ))}
      </div>

      <div className="rounded-[28px] bg-[rgb(var(--brand-soft)/0.25)] p-6 border border-[rgb(var(--brand)/0.1)]">
        <h4 className="text-sm font-bold text-[rgb(var(--brand))]">How to redeem?</h4>
        <p className="mt-2 text-sm leading-relaxed text-[rgb(var(--muted))]">
          Copy the voucher code and paste it into the "Promo Code" section during checkout to apply your discount. Rewards points can also be converted to vouchers in the Rewards section.
        </p>
      </div>
    </div>
  );
}
