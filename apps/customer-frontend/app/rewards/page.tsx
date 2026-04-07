import { PageHeader } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { WalletBanner } from '@/components/rewards/wallet-banner';
import { RewardList } from '@/components/rewards/reward-list';
import { RewardHistory } from '@/components/rewards/reward-history';
import { RedeemPanel } from '@/components/rewards/redeem-panel';

export default function RewardsPage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Rewards"
          description="See the wallet, available offers, and recent redemption history in one place."
        >
          <ButtonLink href="/redeem" variant="secondary">
            Redeem now
          </ButtonLink>
        </PageHeader>
      </Container>
      <WalletBanner />
      <RewardList />
      <RewardHistory />
      <RedeemPanel />
    </>
  );
}

