import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

export type ScratchReward = {
  id: string;
  trigger: 'welcome' | 'order' | 'auto_voucher';
  voucherCode: string;
  claimedAt: string;
  usedAt?: string;
  expiryAt?: string;
  isUsed: boolean;
};

async function fetchMyRewards(): Promise<{ rewards: ScratchReward[] }> {
  const response = await apiClient<Record<string, unknown>>('/scratch-rewards/my');
  const data = (response as { rewards?: Record<string, unknown>[] }).rewards ?? [];
  return {
    rewards: data.map((r) => {
      const rawTrigger = String(r.trigger ?? '');
      const trigger = rawTrigger === 'auto_voucher' ? 'auto_voucher' : rawTrigger === 'order' ? 'order' : 'welcome';
      return {
        id: String(r.id),
        trigger,
        voucherCode: String(r.voucherCode ?? r.voucher_code ?? ''),
        claimedAt: String(r.claimedAt ?? r.claimed_at ?? ''),
        usedAt: r.usedAt || r.used_at ? String(r.usedAt ?? r.used_at) : undefined,
        expiryAt: r.expiryAt || r.expiry_at ? String(r.expiryAt ?? r.expiry_at) : undefined,
        isUsed: Boolean(r.isUsed ?? r.is_used),
      };
    }),
  };
}

export function useMyScratchRewardsQuery() {
  return useQuery({
    queryKey: ['scratch-rewards', 'my'],
    queryFn: fetchMyRewards,
    staleTime: 30_000,
  });
}

export function useClaimScratchRewardMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { trigger: 'welcome' | 'order'; voucherCode: string }) => {
      const response = await apiClient('/scratch-rewards/claim', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scratch-rewards', 'my'] });
    },
  });
}

export function useMarkScratchRewardUsedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { trigger: 'welcome' | 'order' | 'auto_voucher' }) => {
      const response = await apiClient('/scratch-rewards/use', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scratch-rewards', 'my'] });
    },
  });
}
