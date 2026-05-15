import { FileText, ExternalLink, Trash2 } from "lucide-react";

interface RestaurantLicensePreviewProps {
  licenseUrl: string;
  isEditing: boolean;
  onRemove: () => void;
}

export function RestaurantLicensePreview({ licenseUrl, isEditing, onRemove }: RestaurantLicensePreviewProps) {
  if (!licenseUrl) {
    return (
      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
        <p className="text-xs text-slate-500">No business license document uploaded</p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
        <FileText className="h-5 w-5 text-amber-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-900">License Document</p>
        <p className="text-xs text-slate-500 truncate">{licenseUrl}</p>
      </div>
      <a
        href={licenseUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-600"
      >
        <ExternalLink className="h-3 w-3" /> View
      </a>
      {isEditing && (
        <button onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
