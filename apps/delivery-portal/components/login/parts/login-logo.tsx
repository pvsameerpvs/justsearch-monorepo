import { Bike } from "lucide-react";

export function LoginLogo() {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
        <Bike className="h-7 w-7 text-white" />
      </div>
      <h1 className="mt-4 text-xl font-bold text-slate-900">Driver Portal</h1>
      <p className="text-sm text-slate-500">Sign in to access your orders</p>
    </div>
  );
}
