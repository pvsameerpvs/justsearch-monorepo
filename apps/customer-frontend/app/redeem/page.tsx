import { PageHeader } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { SessionBanner } from '@/components/games/session-banner';
import { RedeemPanel } from '@/components/rewards/redeem-panel';
import { RewardList } from '@/components/rewards/reward-list';

export default function RedeemPage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Redeem rewards"
          description="Guests can choose a reward and let the restaurant staff complete the final approval step."
        >
          <ButtonLink href="/profile" variant="secondary">
            Wallet profile
          </ButtonLink>
        </PageHeader>
      </Container>
      <SessionBanner
        title="Ready to redeem"
        description="The guest is checked in, and redemptions can move forward with staff approval when required."
      />
      <RedeemPanel />
      <RewardList compact />
    </>
  );
}

