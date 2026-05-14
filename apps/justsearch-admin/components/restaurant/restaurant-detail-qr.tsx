"use client";

import { useState } from "react";
import { QrCode, Copy, Check, ExternalLink, Download } from "lucide-react";

interface RestaurantDetailQrProps {
  subdomain: string;
}

function getQrUrl(data: string, size = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

export function RestaurantDetailQr({ subdomain }: RestaurantDetailQrProps) {
  const [copied, setCopied] = useState(false);
  const customerUrl = `https://${subdomain}.js-restorant.com`;
  const qrImageUrl = getQrUrl(customerUrl, 200);

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
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
        <QrCode className="h-4 w-4 text-purple-600" />
        Customer Site QR Code
      </h3>

      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <img
            src={qrImageUrl}
            alt="Customer QR Code"
            className="h-32 w-32 rounded-xl border border-slate-200 bg-white object-contain"
          />
        </div>

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
      </div>
    </div>
  );
}
