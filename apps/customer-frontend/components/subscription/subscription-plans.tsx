"use client";

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@justsearch/ui';
import { SubscriptionPlanCard } from './subscription-plan-card';

export type SubscriptionPlan = 'pool' | 'exclusive';

export interface Plan {
  id: SubscriptionPlan;
  name: string;
  priceYearly: number;
  priceMonthly: number | null;
  description: string;
  features: string[];
  badge: string;
  badgeColor: string;
  accentColor: string;
  recommended?: boolean;
}

const PLANS: Plan[] = [
  { id: 'pool', name: 'Pool Reward Package', priceYearly: 3000, priceMonthly: null, description: 'Perfect for small restaurants starting their loyalty journey.', features: ['20% of fees go to customer reward pool','Basic game integration (4 games)','Standard QR menu system','Google review boost','Basic analytics dashboard','Email support'], badge: 'Starter', badgeColor: 'bg-blue-100 text-blue-700', accentColor: '#3b82f6' },
  { id: 'exclusive', name: 'Exclusive Reward Package', priceYearly: 3000, priceMonthly: 1000, description: 'Full-featured powerhouse for growing restaurants.', features: ['All Pool Package features','5 premium games + custom branding','VIP tier loyalty system','Referral program tools','Advanced analytics & AI insights','Priority 24/7 support','Ad revenue sharing (60/40 split)','White-label customization','Multi-location management'], badge: 'Most Popular', badgeColor: 'bg-amber-100 text-amber-700', accentColor: '#f59e0b', recommended: true },
];

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('exclusive');
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900">Choose Your Plan</h1>
        <p className="mt-2 text-sm text-slate-500">Unlock the full power of JustSearch for your restaurant</p>
      </div>
      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button type="button" onClick={() => setBillingCycle('yearly')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Yearly</button>
          <button type="button" onClick={() => setBillingCycle('monthly')} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Monthly</button>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly ?? plan.priceYearly / 12;
          return <SubscriptionPlanCard key={plan.id} plan={plan} isSelected={isSelected} price={price} billingCycle={billingCycle} onSelect={(planId) => setSelectedPlan(planId)} />;
        })}
      </div>
      <div className="mt-6">
        <Button className="w-full bg-amber-500 py-6 text-base font-bold hover:bg-amber-600">Get Started with {PLANS.find((p) => p.id === selectedPlan)?.name}<ChevronRight className="ml-2 h-5 w-5" /></Button>
        <p className="mt-3 text-center text-xs text-slate-400">14-day free trial · Cancel anytime · No setup fees</p>
      </div>
    </div>
  );
}
