interface GameHeaderProps {
  activeCount: number;
  totalCount: number;
}

export function GameHeader({ activeCount, totalCount }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-slate-900">Platform Games</h3>
      <p className="text-sm text-slate-500">{activeCount} of {totalCount} active</p>
    </div>
  );
}
