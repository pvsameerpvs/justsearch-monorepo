"use client";

import { useState } from "react";
import { QrCode, Copy, Check, Download } from "lucide-react";

interface SettingsQrCardProps {
  subdomain: string;
}

const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "js-restorant.com";

function getQrUrl(data: string, size = 180): string {
  return "https://api.qrserver.com/v1/create-qr-code/?size=" + size + "x" + size + "&data=" + encodeURIComponent(data);
}

export function SettingsQrCard({ subdomain }: SettingsQrCardProps) {
  const [copied, setCopied] = useState(false);
  const customerUrl = "https://" + subdomain + "." + BASE_DOMAIN;
  const qrImageUrl = getQrUrl(customerUrl, 180);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(customerUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = subdomain + "-qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
          <QrCode className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">QR Code</h3>
          <p className="text-xs text-slate-500">1 QR code per restaurant</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <img
            src={qrImageUrl}
            alt="Restaurant QR Code"
            className="h-24 w-24 rounded-xl border border-slate-200 bg-white object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Main Customer QR</p>
            <p className="text-xs font-mono text-slate-700 truncate mt-0.5">{customerUrl}</p>
            <p className="text-[10px] text-slate-500 mt-1">Scan to open restaurant menu</p>
          </div>
          <div className="flex gap-2 mt-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
