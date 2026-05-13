import { Key, Globe } from "lucide-react";

// In production this comes from the tenant/restaurant context
const RESTAURANT_SLUG = "mosaic-table";
const BASE_DOMAIN = "js-restorant.com";
const SEPARATOR = "--";

interface DriverLoginInfoProps {
  uniqueId: string;
}

export function DriverLoginInfo({ uniqueId }: DriverLoginInfoProps) {
  const portalUrl = `${RESTAURANT_SLUG}${SEPARATOR}${uniqueId}.${BASE_DOMAIN}/login`;

  return (
    <div className="mt-3 space-y-2">
      {/* Username + Password hint */}
      <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Key className="h-3 w-3 text-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Login Credentials</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-indigo-400">Username</p>
            <p className="text-sm font-mono font-bold text-indigo-800">{uniqueId}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-indigo-400">Password</p>
            <p className="text-xs font-medium text-indigo-600">••••••</p>
          </div>
        </div>
      </div>

      {/* Portal URL */}
      <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Globe className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal Login URL</span>
        </div>
        <p className="mt-0.5 text-[11px] font-mono text-slate-600 truncate">{portalUrl}</p>
      </div>
    </div>
  );
}
