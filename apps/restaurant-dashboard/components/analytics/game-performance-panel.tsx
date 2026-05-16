import { Activity, Gamepad2 } from 'lucide-react';

export function GamePerformancePanel() {
  return (
    <div className="card-premium p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
          <Activity className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Game Performance</h3>
          <p className="text-sm text-slate-500">No data available yet</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-10 text-slate-400">
        <Gamepad2 className="h-10 w-10 mb-3 opacity-50" />
        <p className="text-sm font-medium">Game analytics coming soon</p>
        <p className="text-xs mt-1">Track plays, rewards, and conversions</p>
      </div>
    </div>
  );
}
