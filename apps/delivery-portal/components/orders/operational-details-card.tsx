import { Card, CardContent, CardHeader, CardTitle } from '@justsearch/ui';
import { Clock3, PackageCheck, ShieldCheck, Wallet } from 'lucide-react';
import type { DeliveryOrder } from '@/lib/delivery-types';

interface OperationalDetailsCardProps {
  order: DeliveryOrder;
}

export function OperationalDetailsCard({ order }: OperationalDetailsCardProps) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white/95 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
      <CardHeader>
        <CardTitle className="text-xl text-slate-950">Operational details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-slate-600">
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Clock3 className="mt-0.5 h-4 w-4 text-orange-500" />
          <div>
            <p className="font-medium text-slate-900">Target ETA</p>
            <p>{order.etaMinutes} minutes</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <PackageCheck className="mt-0.5 h-4 w-4 text-orange-500" />
          <div>
            <p className="font-medium text-slate-900">Packed items</p>
            <p>{order.itemCount} items ready for handoff</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <Wallet className="mt-0.5 h-4 w-4 text-orange-500" />
          <div>
            <p className="font-medium text-slate-900">Payment mode</p>
            <p>{order.paymentMode === 'prepaid' ? 'Prepaid' : 'Cash on delivery'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-orange-500" />
          <div>
            <p className="font-medium text-slate-900">Priority</p>
            <p>{order.priority === 'rush' ? 'Rush stop' : 'Standard stop'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
