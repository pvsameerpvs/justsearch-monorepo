import { PageHeader } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { ProfileSummary } from '@/components/customer/profile-summary';
import { RewardHistory } from '@/components/rewards/reward-history';
import { ActivityFeed } from '@/components/shared/activity-feed';
import { demoRestaurant } from '@/lib/demo-data';

export default function ProfilePage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Profile"
          description="The profile view keeps the wallet, visit count, and recent actions close at hand."
        >
          <ButtonLink href="/rewards" variant="secondary">
            Rewards wallet
          </ButtonLink>
        </PageHeader>
      </Container>
      <ProfileSummary />
      <RewardHistory />
      <section className="py-8 sm:py-12">
        <Container>
          <ActivityFeed
            items={demoRestaurant.activity}
            title="Your recent activity"
            description="A guest profile can also show the latest check-ins, games, and reward claims."
          />
        </Container>
      </section>
    </>
  );
}

