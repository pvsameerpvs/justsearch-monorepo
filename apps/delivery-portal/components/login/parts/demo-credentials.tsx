"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

const DRIVERS = [
  { username: "aem-101", name: "Ahmed Hassan" },
  { username: "moh-202", name: "Mohammed Ali" },
  { username: "ras-303", name: "Rashid Khan" },
  { username: "fah-404", name: "Fahad Ibrahim" },
  { username: "sae-505", name: "Saeed Omar" },
];

const PASSWORD = "driver123";

export function DemoCredentials() {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-4 rounded-lg bg-slate-100 border border-slate-200 p-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors"
      >
        <HelpCircle className="h-3 w-3" />
        {expanded ? "Hide Driver Credentials" : "Show All Driver Credentials"}
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1.5">
          {DRIVERS.map((driver) => (
            <div key={driver.username} className="flex items-center justify-between rounded-md bg-white px-2 py-1.5 text-xs">
              <div className="min-w-0">
                <p className="font-bold text-slate-700">{driver.name}</p>
                <p className="text-[10px] font-mono text-slate-500">{driver.username}</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleCopy(driver.username, `user-${driver.username}`)}
                  className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100"
                  title="Copy username"
                >
                  {copied === `user-${driver.username}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
                <button
                  onClick={() => handleCopy(PASSWORD, `pass-${driver.username}`)}
                  className="flex h-5 w-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100"
                  title="Copy password"
                >
                  {copied === `pass-${driver.username}` ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-center text-slate-500">All passwords: <span className="font-mono font-bold">{PASSWORD}</span></p>
        </div>
      )}
    </div>
  );
}
