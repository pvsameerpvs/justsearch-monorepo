import { useMemo } from 'react';
import { useScratchCampaignsQuery } from './hooks/use-scratch-campaigns';
import { useVouchersQuery, useDeleteVoucherMutation } from '@/lib/hooks/use-vouchers-query';
import { ScratchCardSettingsPresenter } from './scratch-card-settings-presenter';

export function ScratchCardSettings() {
  const { data, isLoading, error: campaignsError } = useScratchCampaignsQuery();
  const { data: vouchersData } = useVouchersQuery();
  const deleteMutation = useDeleteVoucherMutation();

  const campaigns = data?.campaigns ?? [];
  const activeVouchers = useMemo(() => (vouchersData?.vouchers ?? []).filter((v) => v.isActive), [vouchersData]);

  const handleDeleteVoucher = (id: string) => {
    if (window.confirm('Delete this voucher?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <ScratchCardSettingsPresenter
      campaigns={campaigns}
      activeVouchers={activeVouchers}
      isLoading={isLoading}
      campaignsError={campaignsError}
      onDeleteVoucher={handleDeleteVoucher}
    />
  );
}
