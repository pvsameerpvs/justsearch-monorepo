"use client";

import { useRouter } from "next/navigation";
import { Users, Trophy, ArrowRight } from "lucide-react";

interface Row {
  id: string;
  name: string;
  city: string;
  area: string;
  cuisine: string;
  status: "active" | "draft" | "suspended";
  userCount: number;
  totalPoints: number;
}

interface RestaurantUserTableRowProps {
  row: Row;
}

export function RestaurantUserTableRow({ row }: RestaurantUserTableRowProps) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/users/${row.id}`)}
      className="group cursor-pointer hover:bg-slate-50/80 transition-colors"
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
            {row.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{row.name}</p>
            <p className="text-xs text-slate-500">{row.area}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-slate-700">{row.city}</td>
      <td className="px-5 py-3.5 text-sm text-slate-600">{row.cuisine}</td>
      <td className="px-5 py-3.5 text-center">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${row.status === "active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" : row.status === "suspended" ? "bg-red-50 text-red-700 ring-1 ring-red-200" : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"}`}>
          {row.status}
        </span>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
          <Users className="h-3 w-3 text-slate-400" />
          {row.userCount}
        </div>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
          <Trophy className="h-3 w-3" />
          {row.totalPoints.toLocaleString()}
        </div>
      </td>
      <td className="px-5 py-3.5 text-right">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </td>
    </tr>
  );
}
