import Image from 'next/image';
import { ExternalLink, Trash2 } from "lucide-react";

const BRAND_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Instagram: { color: "#E4405F", bg: "bg-[#E4405F]/5", icon: "https://cdn.simpleicons.org/instagram/E4405F" },
  Facebook: { color: "#1877F2", bg: "bg-[#1877F2]/5", icon: "https://cdn.simpleicons.org/facebook/1877F2" },
  WhatsApp: { color: "#25D366", bg: "bg-[#25D366]/5", icon: "https://cdn.simpleicons.org/whatsapp/25D366" },
  TikTok: { color: "#000000", bg: "bg-black/5", icon: "https://cdn.simpleicons.org/tiktok/000000" },
  Twitter: { color: "#1DA1F2", bg: "bg-[#1DA1F2]/5", icon: "https://cdn.simpleicons.org/twitter/1DA1F2" },
  YouTube: { color: "#FF0000", bg: "bg-[#FF0000]/5", icon: "https://cdn.simpleicons.org/youtube/FF0000" },
  Snapchat: { color: "#FFFC00", bg: "bg-[#FFFC00]/30", icon: "https://cdn.simpleicons.org/snapchat/000000" },
};

const PLATFORMS = Object.keys(BRAND_CONFIG);

interface SocialCardProps {
  social: { platform: string; url: string; handle: string };
  isEditing: boolean;
  onUpdate: (field: "platform" | "url" | "handle", value: string) => void;
  onRemove: () => void;
}

export function SocialCard({ social, isEditing, onUpdate, onRemove }: SocialCardProps) {
  const config = BRAND_CONFIG[social.platform] || {
    color: "#64748b",
    bg: "bg-slate-50",
    icon: `https://cdn.simpleicons.org/${social.platform.toLowerCase()}`,
  };

  if (isEditing) {
    return (
      <div className="rounded-[40px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[24px] ${config.bg} overflow-hidden p-2.5`}>
              <Image src={config.icon} alt={social.platform} fill className="object-contain p-2.5" sizes="48px" />
            </div>
            <select value={social.platform} onChange={(e) => onUpdate("platform", e.target.value)} className="elegant-input flex-1 text-sm">
              {PLATFORMS.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
            <button onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <input value={social.handle} onChange={(e) => onUpdate("handle", e.target.value)} placeholder="@handle" className="elegant-input w-full text-sm" />
          <input value={social.url} onChange={(e) => onUpdate("url", e.target.value)} placeholder="https://..." className="elegant-input w-full text-sm" />
        </div>
      </div>
    );
  }

  return (
    <a href={social.url || "#"} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="rounded-[40px] border border-slate-200 bg-white p-5 transition-all group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group-active:scale-[0.98]">
        <div className="flex items-center gap-4">
          <div className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[24px] ${config.bg} overflow-hidden p-2.5 border border-slate-100`}>
            <Image src={config.icon} alt={social.platform} fill className="object-contain p-2.5" sizes="56px" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-0.5">{social.platform}</p>
            <h2 className="truncate font-bold italic text-xl text-slate-900 leading-tight">{social.handle || "No handle"}</h2>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
            <ExternalLink className="h-4 w-4" />
          </div>
        </div>
      </div>
    </a>
  );
}
