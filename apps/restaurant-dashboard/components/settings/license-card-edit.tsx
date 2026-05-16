"use client";

import { Trash2, Upload } from "lucide-react";

interface LicenseCardEditProps {
  licenseNum: string;
  licenseUrl: string;
  onLicenseNumChange: (v: string) => void;
  onRemoveUrl: () => void;
  onFileSelect: () => void;
  onSave: () => void;
  onCancel: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LicenseCardEdit({
  licenseNum, licenseUrl, onLicenseNumChange, onRemoveUrl, onFileSelect, onSave, onCancel, fileInputRef, onFileChange,
}: LicenseCardEditProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Number</label>
        <input value={licenseNum} onChange={(e) => onLicenseNumChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-amber-500 focus:outline-none" />
      </div>
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">License Document</label>
        {licenseUrl ? (
          <div className="flex items-center gap-2 mt-1">
            <a href={licenseUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs text-amber-600 underline">View current document</a>
            <button onClick={onRemoveUrl} className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50" title="Remove">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-400 mt-1">No document uploaded</p>
        )}
        <button onClick={onFileSelect} className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
          <Upload className="h-3 w-3" /> Upload PDF
        </button>
        <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onFileChange} />
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
        <button onClick={onSave} className="flex-1 rounded-lg bg-emerald-500 py-2 text-xs font-bold text-white hover:bg-emerald-600 transition-colors">Save</button>
      </div>
    </div>
  );
}
