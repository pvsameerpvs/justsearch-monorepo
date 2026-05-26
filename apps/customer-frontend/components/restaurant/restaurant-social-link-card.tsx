import { ExternalLink } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { SocialLink } from '@/lib/restaurant-types';

type Props = {
  social: SocialLink;
};

const BRAND_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  Instagram:  { color: '#E4405F', bg: 'bg-[#E4405F]/8',  icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
  Facebook:   { color: '#1877F2', bg: 'bg-[#1877F2]/8',  icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
  WhatsApp:   { color: '#25D366', bg: 'bg-[#25D366]/8',  icon: 'https://cdn.simpleicons.org/whatsapp/25D366' },
  TikTok:     { color: '#000000', bg: 'bg-black/8',       icon: 'https://cdn.simpleicons.org/tiktok/000000' },
  Snapchat:   { color: '#FFFC00', bg: 'bg-[#FFFC00]/15', icon: 'https://cdn.simpleicons.org/snapchat/000000' },
  YouTube:    { color: '#FF0000', bg: 'bg-[#FF0000]/8',  icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
  Twitter:    { color: '#1DA1F2', bg: 'bg-[#1DA1F2]/8',  icon: 'https://cdn.simpleicons.org/twitter/1DA1F2' },
  LinkedIn:   { color: '#0A66C2', bg: 'bg-[#0A66C2]/8',  icon: 'https://cdn.simpleicons.org/linkedin/0A66C2' },
  Telegram:   { color: '#26A5E4', bg: 'bg-[#26A5E4]/8',  icon: 'https://cdn.simpleicons.org/telegram/26A5E4' },
  Pinterest:  { color: '#BD081C', bg: 'bg-[#BD081C]/8',  icon: 'https://cdn.simpleicons.org/pinterest/BD081C' },
  Discord:    { color: '#5865F2', bg: 'bg-[#5865F2]/8',  icon: 'https://cdn.simpleicons.org/discord/5865F2' },
};

export function RestaurantSocialLinkCard({ social }: Props) {
  const cfg = BRAND_CONFIG[social.platform] || {
    color: '#64748b',
    bg: 'bg-slate-50',
    icon: `https://cdn.simpleicons.org/${social.platform.toLowerCase()}/64748b`,
  };

  return (
    <a href={social.url || '#'} target="_blank" rel="noopener noreferrer" className="block group">
      <Surface className="rounded-[40px] border-white/70 bg-white/90 p-5 transition-all group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group-active:scale-[0.98] border border-slate-100">
        <div className="flex items-center gap-5">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[28px] ${cfg.bg} border border-white/40`}>
            <img src={cfg.icon} alt={social.platform} className="h-8 w-8 object-contain" loading="lazy" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">{social.platform}</p>
            <h2 className="truncate font-black italic tracking-tighter text-2xl text-slate-900 leading-none">{social.handle}</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
            <ExternalLink className="h-5 w-5" />
          </div>
        </div>
      </Surface>
    </a>
  );
}
