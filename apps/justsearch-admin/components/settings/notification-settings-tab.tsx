export function NotificationSettingsTab() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-900">Notification Settings</h3>
      <div className="space-y-3">
        {["New order alerts", "Restaurant signups", "Payment failures", "Weekly reports"].map((label) => (
          <label key={label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
            <span className="text-sm font-medium text-slate-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
