import { Card, CardContent, CardHeader, CardTitle } from '@justsearch/ui';
import { MapPin } from 'lucide-react';
import type { DeliveryOrder } from '@/lib/delivery-types';

interface DropoffInstructionsCardProps {
  order: DeliveryOrder;
}

export function DropoffInstructionsCard({ order }: DropoffInstructionsCardProps) {
  return (
    <Card className="rounded-3xl border border-orange-100 bg-orange-50/80 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
      <CardHeader>
        <CardTitle className="text-xl text-slate-950">Drop-off instructions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-700">
        <div className="flex items-start gap-3 rounded-2xl border border-orange-200 bg-white/80 px-4 py-3">
          <MapPin className="mt-0.5 h-4 w-4 text-orange-500" />
          <div>
            <p className="font-medium text-slate-900">Address</p>
            <p className="mt-1">{order.dropoffAddress}</p>
          </div>
        </div>
        <p>{order.notes ?? 'No extra customer instructions were attached to this stop.'}</p>
      </CardContent>
    </Card>
  );
}
