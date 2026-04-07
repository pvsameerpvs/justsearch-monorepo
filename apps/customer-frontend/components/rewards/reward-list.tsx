import { Container } from '@/components/shared/container';
import { SectionHeading } from '@/components/shared/section-heading';
import { ButtonLink } from '@/components/shared/button-link';
import { demoRestaurant } from '@/lib/demo-data';
import { RewardCard } from './reward-card';

type RewardListProps = {
  compact?: boolean;
};

export function RewardList({ compact = false }: RewardListProps) {
  const rewards = compact ? demoRestaurant.rewards.slice(0, 2) : demoRestaurant.rewards;

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Rewards"
            title="Reward cards that feel clear, current, and restaurant-specific."
            description="Restaurant exclusive and global rewards stay visually separated so guests understand what can be redeemed here."
            action={<ButtonLink href="/profile" variant="outline">View wallet</ButtonLink>}
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {rewards.map((reward) => (
              <RewardCard key={reward.name} {...reward} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

