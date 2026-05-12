import type { Restaurant } from '@justsearch/utils';
import { Instagram, Facebook, MessageCircle, Music, Twitter, Youtube, Camera } from 'lucide-react';

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

export function SocialLinksSection({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="elegant-card p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
          <Camera className="h-5 w-5 text-violet-600" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Social Media</h3>
          <p className="text-sm text-slate-500">Links shown to customers</p>
        </div>
      </div>

      {restaurant.socials.length === 0 ? (
        <div className="text-center py-8 text-slate-400">
          <p className="text-sm">No social links configured</p>
        </div>
      ) : (
        <div className="space-y-2">
          {restaurant.socials.map((social) => {
            const Icon = PLATFORM_ICONS[social.platform] || Camera;
            const colorClass = PLATFORM_COLORS[social.platform] || 'bg-slate-50 text-slate-600';

            return (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:border-slate-200 hover:shadow-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{social.platform}</p>
                  <p className="text-xs text-slate-500">{social.handle}</p>
                </div>
                <p className="text-xs font-medium text-slate-400">{social.url}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
