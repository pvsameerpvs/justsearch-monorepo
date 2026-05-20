import { formatLastPlayed } from './eat-play-profile-utils';

interface EatPlayProfileStatsProps {
  playedGames: number;
  totalGames: number;
  roundsPlayed: number;
  totalPoints: number;
  lastPlayed: string;
}

export function EatPlayProfileStats({ playedGames, totalGames, roundsPlayed, totalPoints, lastPlayed }: EatPlayProfileStatsProps) {
  const items = [
    { label: 'GAMES PLAYED', value: `${playedGames} / ${totalGames}` },
    { label: 'TOTAL ROUNDS', value: roundsPlayed.toLocaleString() },
    { label: 'TOTAL POINTS', value: totalPoints.toLocaleString() },
    { label: 'LAST PLAYED', value: lastPlayed ? formatLastPlayed(lastPlayed).toUpperCase() : 'NO HISTORY', isExtraSmall: true },
  ];

  return (
    <div className="relative mt-12 grid grid-cols-2 gap-4 rounded-3xl border border-white/50 bg-white/30 p-4 backdrop-blur-sm sm:grid-cols-4 sm:p-6">
      {items.map((item, idx) => (
        <div key={item.label} className={`flex flex-col px-2 ${idx < 3 ? 'sm:border-r border-black/[0.03]' : ''} ${idx % 2 === 0 ? 'border-r border-black/[0.03]' : ''}`}>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[rgb(var(--muted))]">{item.label}</p>
          <p className={`mt-1 font-display ${item.isExtraSmall ? 'text-[10px] truncate mt-2 font-black text-[rgb(var(--brand))] opacity-80' : 'text-2xl font-black text-[rgb(var(--ink))]'}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
