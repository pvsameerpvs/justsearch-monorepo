"use client";

import { Globe, Copy, Check, ExternalLink } from "lucide-react";
import { useClipboardCopy } from "@/lib/hooks/use-clipboard-copy";
import { useRestaurantQuery } from "@/lib/hooks/use-restaurant-query";
import { CredentialRow, CredentialCard } from "./driver-credential-parts";

const BASE_DOMAIN = "js-restorant.com";
const SEPARATOR = "--";

interface DriverLoginInfoProps {
  uniqueId: string;
}

export function DriverLoginInfo({ uniqueId }: DriverLoginInfoProps) {
  const { copied, handleCopy } = useClipboardCopy();
  const { data: restaurant } = useRestaurantQuery();
  const slug = restaurant?.subdomain ?? restaurant?.slug ?? "";
  const portalUrl = slug ? `${slug}${SEPARATOR}${uniqueId}.${BASE_DOMAIN}` : "";

  return (
    <div className="mt-3 space-y-2">
      <CredentialCard>
        <CredentialRow label="Username" value={uniqueId} copyKey="user" copied={copied} onCopy={handleCopy} />
      </CredentialCard>

      <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
        <div className="flex items-center gap-1.5 mb-1">
          <Globe className="h-3 w-3 text-slate-400" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal Login URL</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-mono text-slate-600 truncate">{portalUrl || "Loading..."}</p>
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => portalUrl && handleCopy(`https://${portalUrl}`, "url")}
              disabled={!portalUrl}
              className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {copied === "url" ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            </button>
            <a
              href={portalUrl ? `https://${portalUrl}` : "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
