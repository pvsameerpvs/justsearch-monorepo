import { ExternalLink } from 'lucide-react';
import { ButtonLink } from '@/components/shared/button-link';
import { Surface } from '@/components/shared/surface';
import type { SocialLink } from '@/lib/restaurant-types';

type RestaurantSocialLinkCardProps = {
  social: SocialLink;
};

export function RestaurantSocialLinkCard({
  social,
}: RestaurantSocialLinkCardProps) {
  return (
    <Surface className="rounded-[32px] border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(var(--brand-soft),0.28))] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--brand))]">
        {social.platform}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.05em] text-[rgb(var(--ink))]">
        {social.handle}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
        Direct guests to the correct social channel for updates,
        reservations, and restaurant storytelling.
      </p>

      <div className="mt-6">
        <ButtonLink href={social.url} external variant="secondary" size="md">
          <span className="inline-flex items-center gap-2">
            Open link
            <ExternalLink className="h-4 w-4" />
          </span>
        </ButtonLink>
      </div>
    </Surface>
  );
}
