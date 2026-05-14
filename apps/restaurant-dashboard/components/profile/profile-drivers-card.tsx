"use client";

import { useState } from "react";
import { Truck, Copy, Check, ExternalLink, User, Lock } from "lucide-react";
import { useDeliveryBoyStore } from "@/lib/stores/delivery-boy-store";

interface ProfileDriversCardProps {
  subdomain: string;
}

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "js-restorant.com";
const SEPARATOR = "--";

export function ProfileDriversCard({ subdomain }: ProfileDriversCardProps) {
  const { agents } = useDeliveryBoyStore();
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (agents.length === 0) {
    return (
      <div className="elegant-card p-5">
        <h3 className="text-base font-bold text-slate-900 mb-4">Delivery Drivers</h3>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
          <Truck className="mx-auto h-6 w-6 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No delivery drivers yet</p>
          <p className="text-xs text-slate-400 mt-1">Go to /delivery to add drivers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Delivery Drivers</h3>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{agents.length} total</span>
      </div>

      <div className="space-y-3">
        {agents.map((agent) => {
          const portalUrl = `https://${subdomain}${SEPARATOR}${agent.uniqueId}.${BASE_DOMAIN}/login`;
          const userKey = `user-${agent.id}`;
          const passKey = `pass-${agent.id}`;
          const urlKey = `url-${agent.id}`;

          return (
            <div key={agent.id} className="rounded-xl border border-slate-100 bg-white p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800 text-white font-bold text-xs">
                    {agent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {agent.uniqueId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${agent.status === "available" ? "bg-emerald-500" : agent.status === "busy" ? "bg-amber-500" : "bg-slate-400"}`} />
                  <span className="text-[10px] text-slate-400 capitalize">{agent.status}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <User className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-700">{agent.uniqueId}</span>
                  <button
                    onClick={() => handleCopy(agent.uniqueId, userKey)}
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Copy username"
                  >
                    {copied === userKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-700">{agent.password || "driver123"}</span>
                  <button
                    onClick={() => handleCopy(agent.password || "driver123", passKey)}
                    className="ml-auto flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Copy password"
                  >
                    {copied === passKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 border border-slate-100 p-2 space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Portal URL</p>
                <p className="text-[11px] font-mono text-slate-600 truncate">{portalUrl}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(portalUrl, urlKey)}
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-white border border-slate-200 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copied === urlKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                    {copied === urlKey ? "Copied" : "Copy"}
                  </button>
                  <a
                    href={portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1 rounded-md bg-slate-900 py-1.5 text-[11px] font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Open Portal
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
