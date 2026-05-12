import { PageHeader } from '@justsearch/ui';
import { VoucherValidator } from '@/components/vouchers/voucher-validator';

export default function VouchersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Vouchers" description="Validate and manage customer vouchers" />
      <VoucherValidator />
    </div>
  );
}
