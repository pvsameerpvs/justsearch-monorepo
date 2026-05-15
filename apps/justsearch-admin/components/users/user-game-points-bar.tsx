import { Trophy } from "lucide-react";
import type { UserGamePoints } from "@/lib/types/user.types";

interface UserGamePointsBarProps {
  gamePoints: UserGamePoints;
}

export function UserGamePointsBar({ gamePoints }: UserGamePointsBarProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 text-center hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-center gap-1 mb-1">
        <Trophy className="h-3 w-3 text-amber-500" />
        <span className="text-xs font-bold text-slate-700">{gamePoints.points.toLocaleString()}</span>
      </div>
      <p className="text-[10px] font-semibold text-slate-500 truncate">{gamePoints.gameName}</p>
    </div>
  );
}
