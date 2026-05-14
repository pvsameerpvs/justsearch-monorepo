import { Users } from "lucide-react";

export function UserEmpty() {
  return (
    <div className="py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 mx-auto mb-3">
        <Users className="h-6 w-6 text-slate-400" />
      </div>
      <p className="text-sm font-bold text-slate-700">No registered users</p>
      <p className="text-xs text-slate-500 mt-1">This restaurant has no customer registrations yet</p>
    </div>
  );
}
