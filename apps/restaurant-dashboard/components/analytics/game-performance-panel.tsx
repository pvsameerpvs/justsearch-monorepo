import { Activity } from 'lucide-react';
import { PerformanceBar } from './analytics-cards';

const GAME_DATA = {
  topGame: 'Jump & Bite',
  topGamePlays: 5430,
  totalGamePlays: 15432,
  avgSessionTime: '4m 32s',
  conversionRate: '68%',
  repeatRate: '42%',
};

export function GamePerformancePanel() {
  return (
    <div className="card-premium p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
          <Activity className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Game Performance</h3>
          <p className="text-sm text-slate-500">Top performing metrics</p>
        </div>
      </div>

      <div className="space-y-4">
        <PerformanceBar label={GAME_DATA.topGame} value={GAME_DATA.topGamePlays} max={GAME_DATA.totalGamePlays} color="bg-purple-500" icon="🏃" />
        <PerformanceBar label="Avg. Session Time" value={GAME_DATA.avgSessionTime} max={GAME_DATA.avgSessionTime} color="bg-blue-500" icon="⏱️" isText />
        <PerformanceBar label="Conversion Rate" value={GAME_DATA.conversionRate} max="100%" color="bg-emerald-500" icon="📈" isText />
        <PerformanceBar label="Repeat Customer Rate" value={GAME_DATA.repeatRate} max="100%" color="bg-amber-500" icon="🔄" isText />
      </div>
    </div>
  );
}
