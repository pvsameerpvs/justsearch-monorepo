"use client";

import { useState } from "react";
import { Globe, ExternalLink, Truck, Copy, Check } from "lucide-react";

interface ProfileLinksCardProps {
  subdomain: string;
}

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "js-restorant.com";

export function ProfileLinksCard({ subdomain }: ProfileLinksCardProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const links = [
    { label: "Customer Site", url: `https://${subdomain}.${BASE_DOMAIN}`, icon: Globe, color: "indigo" },
    { label: "Dashboard", url: `https://admin-${subdomain}.${BASE_DOMAIN}`, icon: ExternalLink, color: "slate" },
    { label: "Driver Portal", url: `https://${subdomain}--driver.${BASE_DOMAIN}`, icon: Truck, color: "amber" },
  ];

  const handleCopy = async (url: string, key: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="elegant-card p-5">
      <h3 className="text-base font-bold text-slate-900 mb-4">Restaurant Links</h3>
      <div className="space-y-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isCopied = copied === link.label;
          return (
            <div key={link.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${link.color === "indigo" ? "bg-indigo-50" : link.color === "amber" ? "bg-amber-50" : "bg-slate-100"}`}>
                <Icon className={`h-4 w-4 ${link.color === "indigo" ? "text-indigo-600" : link.color === "amber" ? "text-amber-600" : "text-slate-500"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{link.label}</p>
                <p className="text-xs font-mono text-slate-700 truncate">{link.url}</p>
              </div>
              <button
                onClick={() => handleCopy(link.url, link.label)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                title="Copy"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                title="Open"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
