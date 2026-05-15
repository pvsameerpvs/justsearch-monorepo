interface RestaurantLicenseMetaProps {
  licenseNum: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export function RestaurantLicenseMeta({ licenseNum, isEditing, onChange }: RestaurantLicenseMetaProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Number</p>
      {isEditing ? (
        <input
          value={licenseNum}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm focus:border-amber-500 focus:outline-none"
        />
      ) : (
        <p className="text-sm font-medium text-slate-700">{licenseNum}</p>
      )}
    </div>
  );
}
