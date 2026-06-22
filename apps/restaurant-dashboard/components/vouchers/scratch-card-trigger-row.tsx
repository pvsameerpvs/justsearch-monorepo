import { useCallback } from 'react';
import type { ScratchCampaign } from './hooks/use-scratch-campaigns';
import { useUpdateScratchCampaignMutation } from './hooks/use-scratch-campaigns';
import { ScratchCardToggle } from './scratch-card-toggle';
import { ScratchCardVoucherManager } from './scratch-card-voucher-manager';
import { ScratchCardThresholdConfig } from './scratch-card-threshold-config';

interface Props {
  triggerKey: string; label: string; description: string;
  icon: React.ComponentType<{ className?: string }>;
  behavior: 'scratch_card' | 'auto_add';
  campaign?: ScratchCampaign;
  activeVouchers: { id: string; code: string; type: string; value: number }[];
  onDeleteVoucher: (id: string) => void;
}

export function ScratchCardTriggerRow({
  triggerKey, label, description, icon: Icon, behavior,
  campaign, activeVouchers, onDeleteVoucher,
}: Props) {
  const update = useUpdateScratchCampaignMutation();
  const enabled = campaign?.isEnabled ?? false;
  const code = campaign?.voucherCode ?? '';
  const isThreshold = triggerKey === 'order_threshold';
  const minAmount = isThreshold && campaign?.config ? Number((campaign.config as Record<string, unknown>).minAmount ?? 50) : 50;

  const handleToggle = useCallback(() => {
    const data: Record<string, unknown> = { isEnabled: !enabled };
    if (isThreshold) { data.behavior = 'auto_add'; data.config = { minAmount }; }
    update.mutate({ trigger: triggerKey, data });
  }, [triggerKey, enabled, isThreshold, minAmount, update]);

  const handleVoucherChange = useCallback((code: string) => {
    update.mutate({ trigger: triggerKey, data: { voucherCode: code } });
  }, [triggerKey, update]);

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><Icon className="h-5 w-5" /></div>
          <div><p className="text-sm font-bold text-slate-900">{label}</p><p className="text-xs text-slate-500 mt-0.5">{description}</p></div>
        </div>
        <ScratchCardToggle enabled={enabled} onToggle={handleToggle} />
      </div>
      {enabled && isThreshold && <ScratchCardThresholdConfig triggerKey={triggerKey} minAmount={minAmount} />}
      {enabled && <ScratchCardVoucherManager selectedCode={code} vouchers={activeVouchers} onSelect={handleVoucherChange} onDelete={onDeleteVoucher} />}
    </div>
  );
}
