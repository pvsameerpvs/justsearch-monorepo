import Image from 'next/image';
import { Calendar, Bike } from 'lucide-react';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

interface MenuHeroPreviewProps {
  heroUrl: string;
  logoUrl: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  cuisine: string;
  hours: string;
  theme: Record<string, string>;
}

export function MenuHeroPreview({ heroUrl, logoUrl, name, tagline, description, category, cuisine, hours, theme }: MenuHeroPreviewProps) {
  const initials = getInitials(name);
  const backgroundImage = heroUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=2070';

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
      <div className="relative h-48">
        <Image
          src={backgroundImage}
          alt="Menu Hero Background"
          fill
          className="object-cover brightness-[0.45]"
          sizes="(max-width: 768px) 100vw, 400px"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-white">
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <div
                className="relative h-20 w-20 overflow-hidden rounded-2xl"
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
                }}
              >
                {logoUrl ? (
                  <Image src={logoUrl} alt="Logo" fill className="object-cover" sizes="80px" />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center font-bold text-xl"
                    style={{
                      background: `linear-gradient(145deg, rgb(${theme.logoGradientFrom ?? '99,102,241'}), rgb(${theme.logoGradientTo ?? '168,85,247'}))`,
                    }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: `rgb(${theme.brandColor})` }}>
                  {category || 'Category'}
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-white">{name || 'Restaurant Name'}</h1>
                <p className="mx-auto max-w-xs text-sm text-white/80 font-medium">{tagline || 'Tagline'}</p>
              </div>
            </div>

            {description && (
              <p className="mx-auto max-w-xs text-xs text-white/70 line-clamp-2">{description}</p>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {cuisine ? (
                cuisine
                  .split(',')
                  .map((c) => c.trim())
                  .filter(Boolean)
                  .map((c, i) => (
                    <span
                      key={`${c}-${i}`}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60"
                    >
                      {c}
                    </span>
                  ))
              ) : (
                <span className="text-xs text-white/30">No cuisine tags</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 space-y-3">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5">
            <Bike className="h-3 w-3 text-slate-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Delivery Only</span>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 pr-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Opening Today</p>
              <p className="text-xs font-bold text-slate-900">{hours || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
