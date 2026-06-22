import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export type ScratchCampaign = {
  id: string;
  trigger: 'welcome' | 'order' | 'order_threshold';
  behavior: 'scratch_card' | 'auto_add';
  isEnabled: boolean;
  voucherCode: string;
  title: string;
  voucherType: 'percentage' | 'fixed';
  voucherValue: number;
  config: Record<string, unknown> | null;
};

async function fetchCampaigns(): Promise<{ campaigns: ScratchCampaign[] }> {
  const response = await apiClient<Record<string, unknown>>('/scratch-campaigns');
  const data = (response as { campaigns?: Record<string, unknown>[] }).campaigns ?? [];
  return {
    campaigns: data.map((c) => {
      const rawTrigger = String(c.trigger ?? '');
      const trigger = rawTrigger === 'order_threshold' ? 'order_threshold' : rawTrigger === 'order' ? 'order' : 'welcome';
      const rawType = String(c.voucherType ?? c.voucher_type ?? 'percentage');
      const voucherType = rawType === 'fixed' || rawType === 'flat' ? 'fixed' : 'percentage';
      const rawValue = c.voucherValue ?? c.voucher_value ?? '0';
      const voucherValue = Number(rawValue) || 0;
      let parsedConfig: Record<string, unknown> | null = null;
      const rawConfig = c.config ?? c.config;
      if (rawConfig) {
        try { parsedConfig = typeof rawConfig === 'string' ? JSON.parse(rawConfig) : rawConfig; } catch { parsedConfig = null; }
      }
      return {
        id: String(c.id),
        trigger,
        behavior: String(c.behavior ?? 'scratch_card') as 'scratch_card' | 'auto_add',
        isEnabled: Boolean(c.isEnabled ?? c.is_enabled),
        voucherCode: String(c.voucherCode ?? c.voucher_code ?? ''),
        title: String(c.title ?? ''),
        voucherType,
        voucherValue,
        config: parsedConfig,
      };
    }),
  };
}

export function useScratchCampaignsQuery() {
  return useQuery({
    queryKey: ['scratch-campaigns'],
    queryFn: fetchCampaigns,
    staleTime: 60_000,
  });
}
