"use client";

import { useState } from "react";
import { Globe, Check, Copy } from "lucide-react";

interface SettingsDomainCardProps {
  subdomain: string;
}

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "js-restorant.com";

export function SettingsDomainCard({ subdomain }: SettingsDomainCardProps) {
  const urls = [
    { label: "Customer Site", url: `https://${subdomain}.${BASE_DOMAIN}` },
    { label: "Dashboard", url: `https://${subdomain}.admin.${BASE_DOMAIN}` },
    { label: "Delivery Boy", url: `https://${subdomain}.delivery.${BASE_DOMAIN}` },
  ];

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
          <Globe className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Your URLs</h3>
      </div>

      <div className="space-y-3">
        {urls.map((u) => (
          <UrlCopyRow key={u.label} label={u.label} url={u.url} />
        ))}
      </div>
    </div>
  );
}

function UrlCopyRow({ label, url }: { label: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-xs font-mono text-slate-700">{url}</p>
      </div>
      <button
        onClick={handleCopy}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        title="Copy URL"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
