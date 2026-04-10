import { Gamepad2, MessagesSquare, Share2, UtensilsCrossed } from 'lucide-react';
import { Container } from '@/components/shared/container';
import { RestaurantFeatureCard } from './restaurant-feature-card';

export function RestaurantFeatureGrid() {
  const cards = [
    {
      title: 'Food Menu',
      eyebrow: 'Dining',
      description: 'See dishes, prices, and menu categories.',
      href: '/menu',
      icon: UtensilsCrossed,
      className:
        'bg-[linear-gradient(160deg,rgba(var(--brand-soft),0.45),rgba(255,255,255,0.92))]',
      iconClassName: 'bg-[rgb(var(--brand-soft))]',
    },
    {
      title: 'Eat, Play',
      eyebrow: 'Experience',
      description: 'Show the fun dining and play experience.',
      href: '/eat-play',
      icon: Gamepad2,
      className:
        'bg-[linear-gradient(160deg,rgba(var(--accent-soft),0.62),rgba(255,255,255,0.92))]',
      iconClassName: 'bg-[rgb(var(--accent-soft))]',
    },
    {
      title: 'Google Reviews',
      eyebrow: 'Trust',
      description: 'Show rating and simple customer feedback.',
      href: '/google-reviews',
      icon: MessagesSquare,
      className:
        'bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(var(--brand-soft),0.3))]',
      iconClassName: 'bg-[rgb(var(--brand-soft))]',
    },
    {
      title: 'Social Media',
      eyebrow: 'Community',
      description: 'Open all restaurant social links in one place.',
      href: '/social-media',
      icon: Share2,
      className:
        'bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(var(--accent-soft),0.34))]',
      iconClassName: 'bg-[rgb(var(--accent-soft))]',
    },
  ] as const;

  return (
    <section className="pb-12 sm:pb-14 lg:pb-5">
      <Container>
        <div className="mx-auto grid max-w-5xl gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-4">
          {cards.map((card) => (
            <RestaurantFeatureCard
              key={card.title}
              title={card.title}
              eyebrow={card.eyebrow}
              description={card.description}
              href={card.href}
              icon={card.icon}
              className={card.className}
              iconClassName={card.iconClassName}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
