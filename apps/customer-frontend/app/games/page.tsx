import { PageHeader } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { SessionBanner } from '@/components/games/session-banner';
import { GameLobby } from '@/components/games/game-lobby';

export default function GamesPage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Game center"
          description="Available games appear here only while the restaurant session is valid."
        >
          <ButtonLink href="/scratch" variant="secondary">
            Go to scratch card
          </ButtonLink>
        </PageHeader>
      </Container>
      <SessionBanner />
      <GameLobby />
    </>
  );
}

