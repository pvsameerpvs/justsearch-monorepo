import {
  Instagram,
  Facebook,
  MessageCircle,
  Music,
  Twitter,
  Youtube,
  Camera,
  Trash2,
} from 'lucide-react';

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  Instagram,
  Facebook,
  WhatsApp: MessageCircle,
  TikTok: Music,
  Twitter,
  YouTube: Youtube,
  Snapchat: Camera,
};

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: 'bg-pink-50 text-pink-600',
  Facebook: 'bg-blue-50 text-blue-600',
  WhatsApp: 'bg-emerald-50 text-emerald-600',
  TikTok: 'bg-slate-50 text-slate-900',
  Twitter: 'bg-sky-50 text-sky-600',
  YouTube: 'bg-red-50 text-red-600',
  Snapchat: 'bg-yellow-50 text-yellow-600',
};

const PLATFORMS = ['Instagram', 'Facebook', 'WhatsApp', 'TikTok', 'Twitter', 'YouTube', 'Snapchat'];

interface Social {
  platform: string;
  url: string;
  handle: string;
}

interface SocialRowProps {
  social: Social;
  isEditing: boolean;
  onUpdate: (field: 'platform' | 'url' | 'handle', value: string) => void;
  onRemove: () => void;
}

export function SocialRow({ social, isEditing, onUpdate, onRemove }: SocialRowProps) {
  const Icon = PLATFORM_ICONS[social.platform] || Camera;
  const colorClass = PLATFORM_COLORS[social.platform] || 'bg-slate-50 text-slate-600';

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      {isEditing ? (
        <div className="flex-1 grid gap-2 sm:grid-cols-3">
          <select value={social.platform} onChange={(e) => onUpdate('platform', e.target.value)} className="elegant-input text-sm">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input value={social.handle} onChange={(e) => onUpdate('handle', e.target.value)} className="elegant-input text-sm" placeholder="Handle" />
          <input value={social.url} onChange={(e) => onUpdate('url', e.target.value)} className="elegant-input text-sm" placeholder="URL" />
        </div>
      ) : (
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900">{social.platform}</p>
          <p className="text-xs text-slate-500">{social.handle}</p>
        </div>
      )}
      {isEditing ? (
        <button onClick={onRemove} className="text-red-400 hover:text-red-600">
          <Trash2 className="h-4 w-4" />
        </button>
      ) : (
        <p className="text-xs font-medium text-slate-400 truncate max-w-[140px]">{social.url}</p>
      )}
    </div>
  );
}
