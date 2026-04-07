import { PageHeader } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { SessionBanner } from '@/components/games/session-banner';
import { ScratchCard } from '@/components/games/scratch-card';

export default function ScratchPage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Scratch card"
          description="Reveal a reward only after the customer has a valid restaurant session."
        >
          <ButtonLink href="/rewards" variant="secondary">
            View rewards
          </ButtonLink>
        </PageHeader>
      </Container>
      <SessionBanner
        title="Scratch unlocked"
        description="The session is active, so the reward reveal remains open until the timer expires."
      />
      <ScratchCard />
    </>
  );
}

