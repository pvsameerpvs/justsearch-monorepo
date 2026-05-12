export function GeneralSettingsTab() {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-slate-900">General Settings</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Platform Name</label>
          <input defaultValue="JustSearch" className="elegant-input w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Base Domain</label>
          <input defaultValue="js-restorant.com" className="elegant-input w-full mt-1" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Default Currency</label>
          <select defaultValue="AED" className="elegant-input w-full mt-1">
            <option>AED</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase text-slate-400">Default City</label>
          <input defaultValue="Dubai" className="elegant-input w-full mt-1" />
        </div>
      </div>
    </div>
  );
}
