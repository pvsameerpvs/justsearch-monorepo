import { Gift, Ticket, Zap } from 'lucide-react';
import { ScratchCardTriggerRow } from './scratch-card-trigger-row';
import { ScratchCardSkeleton } from './scratch-card-skeleton';
import { ScratchCardError } from './scratch-card-error';
import { ScratchCardEmpty } from './scratch-card-empty';
import type { ScratchCampaign } from './hooks/use-scratch-campaigns';

const TRIGGER_CONFIG = [
  { key: 'welcome', label: 'Welcome Offer', description: 'Scratch card on first visit', icon: Gift, behavior: 'scratch_card' as const },
  { key: 'order', label: 'Post-Order Offer', description: 'Scratch card after first order', icon: Ticket, behavior: 'scratch_card' as const },
  { key: 'order_threshold', label: 'High-Value Auto-Reward', description: 'Auto-add voucher for orders above threshold', icon: Zap, behavior: 'auto_add' as const },
];

interface Props {
  campaigns: ScratchCampaign[];
  activeVouchers: { id: string; code: string; type: string; value: number }[];
  isLoading: boolean;
  campaignsError: Error | null;
  onDeleteVoucher: (id: string) => void;
}

export function ScratchCardSettingsPresenter({
  campaigns, activeVouchers, isLoading, campaignsError, onDeleteVoucher,
}: Props) {
  if (isLoading) return <ScratchCardSkeleton />;
  if (campaignsError) return <ScratchCardError />;
  if (campaigns.length === 0) return <ScratchCardEmpty />;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4">Reward Rules</h3>
      <div className="space-y-4">
        {TRIGGER_CONFIG.map((cfg) => (
          <ScratchCardTriggerRow
            key={cfg.key}
            triggerKey={cfg.key}
            label={cfg.label}
            description={cfg.description}
            icon={cfg.icon}
            behavior={cfg.behavior}
            campaign={campaigns.find((c) => c.trigger === cfg.key)}
            activeVouchers={activeVouchers}
            onDeleteVoucher={onDeleteVoucher}
          />
        ))}
      </div>
    </div>
  );
}
