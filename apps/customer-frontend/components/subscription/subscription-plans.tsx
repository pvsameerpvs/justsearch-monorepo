"use client";

import { useState } from 'react';
import { Check, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@justsearch/ui';
import { motion } from 'framer-motion';

export type SubscriptionPlan = 'pool' | 'exclusive';

const PLANS = [
  {
    id: 'pool' as SubscriptionPlan,
    name: 'Pool Reward Package',
    priceYearly: 3000,
    priceMonthly: null,
    description: 'Perfect for small restaurants starting their loyalty journey.',
    features: [
      '20% of fees go to customer reward pool',
      'Basic game integration (4 games)',
      'Standard QR menu system',
      'Google review boost',
      'Basic analytics dashboard',
      'Email support',
    ],
    badge: 'Starter',
    badgeColor: 'bg-blue-100 text-blue-700',
    accentColor: '#3b82f6',
  },
  {
    id: 'exclusive' as SubscriptionPlan,
    name: 'Exclusive Reward Package',
    priceYearly: 3000,
    priceMonthly: 1000,
    description: 'Full-featured powerhouse for growing restaurants.',
    features: [
      'All Pool Package features',
      '5 premium games + custom branding',
      'VIP tier loyalty system',
      'Referral program tools',
      'Advanced analytics & AI insights',
      'Priority 24/7 support',
      'Ad revenue sharing (60/40 split)',
      'White-label customization',
      'Multi-location management',
    ],
    badge: 'Most Popular',
    badgeColor: 'bg-amber-100 text-amber-700',
    accentColor: '#f59e0b',
    recommended: true,
  },
];

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('exclusive');
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="text-center">
        <h1 className="text-2xl font-black text-slate-900">Choose Your Plan</h1>
        <p className="mt-2 text-sm text-slate-500">
          Unlock the full power of JustSearch for your restaurant
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="inline-flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              billingCycle === 'yearly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Yearly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const price =
            billingCycle === 'yearly'
              ? plan.priceYearly
              : plan.priceMonthly ?? plan.priceYearly / 12;

          return (
            <motion.div
              key={plan.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                isSelected
                  ? 'border-amber-400 bg-amber-50 shadow-lg'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${plan.badgeColor}`}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{plan.description}</p>
                </div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="h-4 w-4 text-white" />}
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">AED {price.toLocaleString()}</span>
                <span className="text-sm text-slate-500">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
              </div>

              {billingCycle === 'yearly' && plan.priceMonthly && (
                <p className="mt-1 text-xs text-green-600">
                  Save AED {((plan.priceMonthly * 12) - plan.priceYearly).toLocaleString()} vs monthly
                </p>
              )}

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
                    <Sparkles
                      className="h-4 w-4 shrink-0"
                      style={{ color: plan.accentColor }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6">
        <Button className="w-full bg-amber-500 py-6 text-base font-bold hover:bg-amber-600">
          Get Started with {PLANS.find((p) => p.id === selectedPlan)?.name}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="mt-3 text-center text-xs text-slate-400">
          14-day free trial · Cancel anytime · No setup fees
        </p>
      </div>
    </div>
  );
}
