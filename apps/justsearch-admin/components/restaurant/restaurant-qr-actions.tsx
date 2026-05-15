"use client";

import { useState } from "react";
import { Copy, Check, Download, ExternalLink } from "lucide-react";

interface RestaurantQrActionsProps {
  customerUrl: string;
  qrImageUrl: string;
  subdomain: string;
}

export function RestaurantQrActions({ customerUrl, qrImageUrl, subdomain }: RestaurantQrActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(customerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `${subdomain}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 space-y-2 min-w-0">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Customer Site URL</p>
        <p className="text-xs font-mono text-slate-700 truncate">{customerUrl}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy URL"}
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-100 transition-colors"
        >
          <Download className="h-3 w-3" /> Download QR
        </button>
        <a
          href={customerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition-colors"
        >
          <ExternalLink className="h-3 w-3" /> Open Site
        </a>
      </div>
      <p className="text-[10px] text-slate-400">Scan this QR code to open the customer-facing menu site. Print and place at the restaurant entrance.</p>
    </div>
  );
}
