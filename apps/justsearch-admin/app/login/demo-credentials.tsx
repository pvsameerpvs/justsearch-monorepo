"use client";

export function LoginDemoCredentials() {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2">Demo Credentials</p>
      <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
        <span className="text-slate-500">Username</span>
        <span className="font-mono font-bold text-slate-700">admin</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs">
        <span className="text-slate-500">Password</span>
        <span className="font-mono font-bold text-slate-700">admin123</span>
      </div>
    </div>
  );
}
