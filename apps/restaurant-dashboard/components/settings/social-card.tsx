import { ExternalLink, Trash2, Globe } from "lucide-react";

const BRAND_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Instagram:  { color: "#E4405F", bg: "bg-[#E4405F]/8",  icon: "https://cdn.simpleicons.org/instagram/E4405F" },
  Facebook:   { color: "#1877F2", bg: "bg-[#1877F2]/8",  icon: "https://cdn.simpleicons.org/facebook/1877F2" },
  WhatsApp:   { color: "#25D366", bg: "bg-[#25D366]/8",  icon: "https://cdn.simpleicons.org/whatsapp/25D366" },
  TikTok:     { color: "#000000", bg: "bg-black/8",       icon: "https://cdn.simpleicons.org/tiktok/000000" },
  Twitter:    { color: "#1DA1F2", bg: "bg-[#1DA1F2]/8",  icon: "https://cdn.simpleicons.org/twitter/1DA1F2" },
  YouTube:    { color: "#FF0000", bg: "bg-[#FF0000]/8",  icon: "https://cdn.simpleicons.org/youtube/FF0000" },
  Snapchat:   { color: "#FFFC00", bg: "bg-[#FFFC00]/15", icon: "https://cdn.simpleicons.org/snapchat/000000" },
  LinkedIn:   { color: "#0A66C2", bg: "bg-[#0A66C2]/8",  icon: "https://cdn.simpleicons.org/linkedin/0A66C2" },
  Telegram:   { color: "#26A5E4", bg: "bg-[#26A5E4]/8",  icon: "https://cdn.simpleicons.org/telegram/26A5E4" },
  Pinterest:  { color: "#BD081C", bg: "bg-[#BD081C]/8",  icon: "https://cdn.simpleicons.org/pinterest/BD081C" },
  Discord:    { color: "#5865F2", bg: "bg-[#5865F2]/8",  icon: "https://cdn.simpleicons.org/discord/5865F2" },
};

export const PLATFORMS = Object.keys(BRAND_CONFIG);

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
    icon: `https://cdn.simpleicons.org/${social.platform.toLowerCase()}/64748b`,
  };

  const boxClass = `flex shrink-0 items-center justify-center rounded-2xl ${config.bg} border border-slate-100`;

  const iconBox = (sz: "sm" | "md") => (
    <div className={`${boxClass} ${sz === "sm" ? "h-12 w-12" : "h-14 w-14"}`}>
      <img src={config.icon} alt={social.platform} className="h-1/2 w-1/2 object-contain" loading="lazy" />
    </div>
  );

  if (isEditing) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {iconBox("sm")}
            <select value={social.platform} onChange={(e) => onUpdate("platform", e.target.value)} className="elegant-input flex-1 text-sm">
              {PLATFORMS.map((p) => (<option key={p} value={p}>{p}</option>))}
            </select>
            <button onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
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
      <div className="rounded-2xl border border-slate-200 bg-white p-4 transition-all group-hover:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.08)] group-active:scale-[0.98]">
        <div className="flex items-center gap-4">
          {iconBox("md")}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">{social.platform}</p>
            <p className="truncate font-bold text-lg text-slate-900 leading-tight">{social.handle || "No handle"}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
            {social.url ? <ExternalLink className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
          </div>
        </div>
      </div>
    </a>
  );
}
