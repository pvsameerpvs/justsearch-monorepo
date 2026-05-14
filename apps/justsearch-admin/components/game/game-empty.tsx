import { Gamepad2 } from 'lucide-react';

export function GameEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 py-12">
      <Gamepad2 className="h-10 w-10 text-slate-300" />
      <p className="text-sm font-medium text-slate-500">No games available</p>
    </div>
  );
}
