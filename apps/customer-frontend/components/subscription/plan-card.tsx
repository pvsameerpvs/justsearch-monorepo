"use client";

import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Plan, SubscriptionPlan } from './subscription-plans';

type PlanCardProps = {
  plan: Plan;
  isSelected: boolean;
  price: number;
  billingCycle: 'yearly' | 'monthly';
  onSelect: (planId: SubscriptionPlan) => void;
};

export function PlanCard({ plan, isSelected, price, billingCycle, onSelect }: PlanCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(plan.id)}
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
}
