import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Voucher, VoucherFormData } from '@/components/vouchers/types/voucher.types';

const STALE_TIME = 30_000;

function mapApiToVoucher(data: Record<string, unknown>): Voucher {
  return {
    id: String(data.id), code: String(data.code), title: String(data.title ?? ''),
    description: String(data.description ?? ''), type: data.type === 'fixed' ? 'fixed' : 'percentage',
    value: Number(data.value ?? 0), minOrderValue: Number(data.minOrderValue ?? data.minOrder ?? 0),
    maxDiscount: Number(data.maxDiscount ?? 0), usageLimit: Number(data.usageLimit ?? 0),
    usageCount: Number(data.usageCount ?? 0), startDate: String(data.startDate ?? data.validFrom ?? ''),
    endDate: String(data.endDate ?? data.validUntil ?? ''), isActive: Boolean(data.isActive),
    createdAt: String(data.createdAt ?? ''),
  };
}

function mapVoucherToApi(data: VoucherFormData & { isActive?: boolean }): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    code: data.code, title: data.title || undefined, description: data.description || undefined,
    type: data.type, value: data.value, minOrder: data.minOrderValue,
    maxDiscount: data.maxDiscount || undefined, validFrom: data.startDate || undefined,
    validUntil: data.endDate || undefined, usageLimit: data.usageLimit || undefined,
  };
  if (data.isActive !== undefined) payload.isActive = data.isActive;
  return payload;
}

async function fetchVouchers(): Promise<{ vouchers: Voucher[] }> {
  const response = await apiClient<Record<string, unknown>[]>('/vouchers');
  const list = Array.isArray(response) ? response : (response as { vouchers?: Record<string, unknown>[] }).vouchers ?? [];
  return { vouchers: list.map(mapApiToVoucher) };
}

export function useVouchersQuery() {
  return useQuery({ queryKey: ['vouchers'], queryFn: fetchVouchers, staleTime: STALE_TIME });
}

export function useCreateVoucherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VoucherFormData) => apiClient('/vouchers', { method: 'POST', body: JSON.stringify(mapVoucherToApi(data)) }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['vouchers'] });
      await queryClient.refetchQueries({ queryKey: ['vouchers'] });
    },
  });
}

export function useUpdateVoucherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VoucherFormData & { isActive?: boolean } }) =>
      apiClient(`/vouchers/${id}`, { method: 'PATCH', body: JSON.stringify(mapVoucherToApi(data)) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vouchers'] }); },
  });
}

export function useDeleteVoucherMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient(`/vouchers/${id}`, { method: 'DELETE' }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['vouchers'] }); },
    onError: (error: any) => { alert('Delete failed: ' + (error?.message || 'Unknown error')); },
  });
}
