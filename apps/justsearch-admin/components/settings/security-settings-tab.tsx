export function SecuritySettingsTab() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-900">Security Settings</h3>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Admin Password</label>
          <input type="password" placeholder="••••••••" className="elegant-input w-full mt-1" />
        </div>
        <label className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4">
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
          <span className="text-sm font-medium text-slate-700">Require 2FA for admin login</span>
        </label>
      </div>
    </div>
  );
}
