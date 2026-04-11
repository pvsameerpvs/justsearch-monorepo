import { ExternalLink } from 'lucide-react';
import { Surface } from '@/components/shared/surface';
import type { SocialLink } from '@/lib/restaurant-types';

type RestaurantSocialLinkCardProps = {
  social: SocialLink;
};

// Official Brand Icon Config using SimpleIcons CDN
const BRAND_ICON_URLS: Record<string, { color: string; bg: string; icon: string }> = {
  Instagram: { color: '#E4405F', bg: 'bg-[#E4405F]/5', icon: 'https://cdn.simpleicons.org/instagram/E4405F' },
  Facebook: { color: '#1877F2', bg: 'bg-[#1877F2]/5', icon: 'https://cdn.simpleicons.org/facebook/1877F2' },
  WhatsApp: { color: '#25D366', bg: 'bg-[#25D366]/5', icon: 'https://cdn.simpleicons.org/whatsapp/25D366' },
  TikTok: { color: '#000000', bg: 'bg-black/5', icon: 'https://cdn.simpleicons.org/tiktok/000000' },
  Snapchat: { color: '#000000', bg: 'bg-[#FFFC00]', icon: 'https://cdn.simpleicons.org/snapchat/000000' },
  YouTube: { color: '#FF0000', bg: 'bg-[#FF0000]/5', icon: 'https://cdn.simpleicons.org/youtube/FF0000' },
};

export function RestaurantSocialLinkCard({
  social,
}: RestaurantSocialLinkCardProps) {
  const config = BRAND_ICON_URLS[social.platform] || { 
    color: '#64748b', 
    bg: 'bg-slate-50', 
    icon: `https://cdn.simpleicons.org/${social.platform.toLowerCase()}` 
  };

  return (
    <a 
        href={social.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block group"
    >
        <Surface className="rounded-[40px] border-white/70 bg-white/90 p-5 transition-all group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] group-active:scale-[0.98] border border-slate-100">
            <div className="flex items-center gap-5">
                {/* OFFICIAL BRAND LOGO (REAL IMAGE FROM CDN) */}
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[28px] ${config.bg} shadow-inner overflow-hidden border border-white/40 p-3.5`}>
                    <img 
                        src={config.icon} 
                        alt={social.platform} 
                        className="h-full w-full object-contain"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">
                        {social.platform}
                    </p>
                    <h2 className="truncate font-black italic tracking-tighter text-2xl text-slate-900 leading-none">
                        {social.handle}
                    </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <ExternalLink className="h-5 w-5" />
                </div>
            </div>
        </Surface>
    </a>
  );
}

