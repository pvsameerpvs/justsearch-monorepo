import { Trophy } from "lucide-react";
import type { RestaurantUser } from "@/lib/stores/user-store";

interface DashboardUserRowProps {
  user: RestaurantUser;
}

function DashboardUserRow({ user }: DashboardUserRowProps) {
  const initials = user.name.split(" ").map((n) => n[0]).join("");

  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${user.status === "active" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"}`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
        <p className="text-xs text-slate-500">{user.phone}</p>
      </div>
      <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
        <Trophy className="h-3 w-3" />
        {user.totalPoints.toLocaleString()}
      </div>
    </div>
  );
}

interface DashboardActivityFeedProps {
  users: RestaurantUser[];
  totalPoints: number;
}

export function DashboardActivityFeed({ users, totalPoints }: DashboardActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
          <Trophy className="h-4 w-4 text-rose-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Recent Players</p>
          <p className="text-xs text-slate-500">{users.length} users · {totalPoints.toLocaleString()} points</p>
        </div>
      </div>
      <div className="px-5 py-3 space-y-1">
        {users.map((u) => (
          <DashboardUserRow key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
}
