import { Badge, Card, CardContent, CardHeader, CardTitle } from '@justsearch/ui';
import { PhoneCall, ShieldCheck, Star, Truck } from 'lucide-react';
import type { DeliveryAgent } from '@/lib/delivery-types';
import { AgentChecklist } from './agent-checklist';

function getStatusVariant(
  status: DeliveryAgent['status']
): 'default' | 'success' | 'warning' {
  switch (status) {
    case 'online':
      return 'success';
    case 'busy':
      return 'warning';
    default:
      return 'default';
  }
}

type DeliveryAgentPanelProps = {
  agent: DeliveryAgent;
  routeChecklist: string[];
};

export function DeliveryAgentPanel({
  agent,
  routeChecklist,
}: DeliveryAgentPanelProps) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white/95 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-500">
              Shift overview
            </p>
            <CardTitle className="mt-2 text-2xl text-slate-950">{agent.name}</CardTitle>
          </div>
          <Badge variant={getStatusVariant(agent.status)}>{agent.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Truck className="h-4 w-4 text-orange-500" />
              Vehicle
            </div>
            <p className="mt-2 text-sm text-slate-600">{agent.vehicleType}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <PhoneCall className="h-4 w-4 text-orange-500" />
              Direct line
            </div>
            <p className="mt-2 text-sm text-slate-600">{agent.phone}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Star className="h-4 w-4 text-orange-500" />
              Courier rating
            </div>
            <p className="mt-2 text-sm text-slate-600">{agent.rating} / 5.0</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldCheck className="h-4 w-4 text-orange-500" />
              Completed today
            </div>
            <p className="mt-2 text-sm text-slate-600">{agent.completedToday} orders</p>
          </div>
        </div>

        <AgentChecklist items={routeChecklist} />
      </CardContent>
    </Card>
  );
}
