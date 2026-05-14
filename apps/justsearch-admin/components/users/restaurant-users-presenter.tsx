import { ArrowLeft, Store } from "lucide-react";
import { UserPointsTable } from "./user-points-table";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";
import type { RestaurantUser } from "@/lib/stores/user-store";

interface RestaurantUsersPresenterProps {
  restaurant: AdminRestaurant;
  users: RestaurantUser[];
  totalPoints: number;
  onBack: () => void;
}

export function RestaurantUsersPresenter({ restaurant, users, totalPoints, onBack }: RestaurantUsersPresenterProps) {
  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Restaurants
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">{restaurant.name}</p>
              <p className="text-xs text-slate-500">{restaurant.city} • {restaurant.area} • {restaurant.cuisine}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Users</p>
              <p className="text-lg font-black text-indigo-700">{users.length}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Points</p>
              <p className="text-lg font-black text-amber-600">{totalPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="px-5 py-4">
          <UserPointsTable users={users} />
        </div>
      </div>
    </div>
  );
}
