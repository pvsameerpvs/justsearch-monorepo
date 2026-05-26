"use client";

import { Copy, Check, ExternalLink, User, Lock } from "lucide-react";

interface ProfileDriverItemProps {
  agent: {
    id: string;
    name: string;
    uniqueId: string;
    status: string;
    password: string;
  };
  portalUrl: string;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}

export function ProfileDriverItem({ agent, portalUrl, copied, onCopy }: ProfileDriverItemProps) {
  const userKey = `user-${agent.id}`;
  const passKey = `pass-${agent.id}`;
  const urlKey = `url-${agent.id}`;

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 space-y-2.5">
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
          <button onClick={() => onCopy(agent.uniqueId, userKey)} className="ml-auto flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Copy username">
            {copied === userKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Lock className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="font-mono text-slate-700">{agent.password || "driver123"}</span>
          <button onClick={() => onCopy(agent.password || "driver123", passKey)} className="ml-auto flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors" title="Copy password">
            {copied === passKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-slate-50 border border-slate-100 p-2 space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Portal URL</p>
        <p className="text-[11px] font-mono text-slate-600 truncate">{portalUrl}</p>
        <div className="flex gap-2">
          <button onClick={() => onCopy(portalUrl, urlKey)} className="flex-1 flex items-center justify-center gap-1 rounded-md bg-white border border-slate-200 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
            {copied === urlKey ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
            {copied === urlKey ? "Copied" : "Copy"}
          </button>
          <a href={portalUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1 rounded-md bg-amber-500 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-600 transition-colors">
            <ExternalLink className="h-3 w-3" /> Open Portal
          </a>
        </div>
      </div>
    </div>
  );
}
