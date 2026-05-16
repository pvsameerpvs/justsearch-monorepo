import { Sparkles } from 'lucide-react';

interface SubscriptionPlanFeaturesProps {
  features: string[];
  accentColor: string;
}

export function SubscriptionPlanFeatures({ features, accentColor }: SubscriptionPlanFeaturesProps) {
  return (
    <ul className="mt-4 space-y-2">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-2 text-sm text-slate-700">
          <Sparkles className="h-4 w-4 shrink-0" style={{ color: accentColor }} />
          {feature}
        </li>
      ))}
    </ul>
  );
}
