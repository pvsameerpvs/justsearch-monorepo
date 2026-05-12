import { Badge } from '@justsearch/ui';
import { Clock3, MapPin, Phone } from 'lucide-react';
import type { DeliveryAgent } from '@/lib/delivery-types';

function getAgentBadgeVariant(
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

export function AgentInfoCard({ agent, routeHealthLabel }: { agent: DeliveryAgent; routeHealthLabel: string }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-slate-950 px-5 py-5 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.7)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-200">
            Active courier
          </p>
          <p className="mt-2 text-2xl font-semibold">{agent.name}</p>
          <p className="mt-1 text-sm text-slate-300">{agent.vehicleType}</p>
        </div>
        <Badge variant={getAgentBadgeVariant(agent.status)}>
          {agent.status}
        </Badge>
      </div>
      <div className="mt-5 grid gap-3 text-sm text-slate-200">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-orange-300" />
          <span>{agent.shiftLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-orange-300" />
          <span>{agent.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-orange-300" />
          <span>{routeHealthLabel}</span>
        </div>
      </div>
    </div>
  );
}
