"use client";

import { useState } from "react";
import { Key, Globe, Copy, Check, ExternalLink, Lock } from "lucide-react";
import { useRestaurantQuery } from "@/lib/hooks/use-restaurant-query";

const BASE_DOMAIN = "js-restorant.com";
const SEPARATOR = "--";

interface DriverLoginInfoProps {
  uniqueId: string;
  password: string;
}

export function DriverLoginInfo({ uniqueId, password }: DriverLoginInfoProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { data: restaurant } = useRestaurantQuery();
  const slug = restaurant?.subdomain ?? restaurant?.slug ?? "";
  const portalUrl = slug ? `${slug}${SEPARATOR}${uniqueId}.${BASE_DOMAIN}/login` : "";

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-3 space-y-2">
      {/* Username + Password */}
      <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-3 py-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Key className="h-3 w-3 text-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Login Credentials</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-indigo-400">Username</p>
            <p className="text-sm font-mono font-bold text-indigo-800">{uniqueId}</p>
          </div>
          <button
            onClick={() => handleCopy(uniqueId, "user")}
            className="flex h-6 w-6 items-center justify-center rounded text-indigo-400 hover:bg-indigo-100 transition-colors"
            title="Copy username"
          >
            {copied === "user" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3 text-indigo-400" />
            <div>
              <p className="text-[10px] text-indigo-400">Password</p>
              <p className="text-sm font-mono font-bold text-indigo-800">{password}</p>
            </div>
          </div>
          <button
            onClick={() => handleCopy(password, "pass")}
            className="flex h-6 w-6 items-center justify-center rounded text-indigo-400 hover:bg-indigo-100 transition-colors"
            title="Copy password"
          >
            {copied === "pass" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Portal URL */}
      <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Globe className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal Login URL</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-mono text-slate-600 truncate">{portalUrl || "Loading..."}</p>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => portalUrl && handleCopy(portalUrl, "url")}
              disabled={!portalUrl}
              className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200 transition-colors disabled:opacity-50"
              title="Copy URL"
            >
              {copied === "url" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
            <a
              href={portalUrl ? `https://${portalUrl}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200 transition-colors"
              title="Open Portal"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
