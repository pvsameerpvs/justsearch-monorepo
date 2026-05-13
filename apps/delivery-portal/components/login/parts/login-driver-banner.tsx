interface LoginDriverBannerProps {
  driverUniqueId: string;
}

export function LoginDriverBanner({ driverUniqueId }: LoginDriverBannerProps) {
  return (
    <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-center">
      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
        Driver ID Detected
      </p>
      <p className="text-sm font-mono font-bold text-emerald-800 mt-0.5">
        {driverUniqueId}
      </p>
    </div>
  );
}
