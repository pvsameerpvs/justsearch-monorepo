import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import type { Restaurant } from '@/lib/restaurant-types';
import { RestaurantSocialLinkCard } from './restaurant-social-link-card';
import { Share2, ArrowLeft } from 'lucide-react';

type RestaurantSocialMediaShowcaseProps = {
  restaurant: Restaurant;
};

export function RestaurantSocialMediaShowcase({
  restaurant,
}: RestaurantSocialMediaShowcaseProps) {
  return (
    <div className="min-h-screen bg-white pb-24">
      <Container className="pt-12 px-4">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">{restaurant.name}</h2>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.3em] text-slate-400">Social Channels</p>
        </div>

        {/* SOCIAL LINKS GRID */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {restaurant.socials.map((social) => (
                <RestaurantSocialLinkCard
                    key={social.platform}
                    social={social}
                />
            ))}
        </div>

       
      </Container>
    </div>
  );
}
