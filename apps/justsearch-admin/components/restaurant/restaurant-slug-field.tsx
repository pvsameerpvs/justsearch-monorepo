"use client";

import { Globe, Briefcase, Link2 } from "lucide-react";

interface RestaurantSlugFieldProps {
  slug: string;
  onChange: (slug: string) => void;
}

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "js-restorant.com";

export function RestaurantSlugField({ slug, onChange }: RestaurantSlugFieldProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Link2 className="h-4 w-4 text-slate-400" />
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subdomain</label>
      </div>

      <div className="flex items-center gap-2">
        <input
          value={slug}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono text-slate-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          placeholder="restaurant-slug"
        />
        <span className="shrink-0 text-sm font-medium text-slate-400">.{BASE_DOMAIN}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <UrlPreviewCard label="Customer Site" icon={Globe} url={`https://${slug}.${BASE_DOMAIN}`} color="indigo" />
        <UrlPreviewCard label="Dashboard" icon={Briefcase} url={`https://admin-${slug}.${BASE_DOMAIN}`} color="slate" />
      </div>
    </div>
  );
}

function UrlPreviewCard({ label, url, icon: Icon, color }: { label: string; url: string; icon: any; color: string }) {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${colorClasses[color]}`}>
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="font-medium shrink-0">{label}</span>
      <span className="truncate font-mono opacity-70">{url}</span>
    </div>
  );
}
