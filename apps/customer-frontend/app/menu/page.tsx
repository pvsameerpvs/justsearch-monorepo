import { PageHeader } from '@justsearch/ui';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { MenuGrid } from '@/components/restaurant/menu-grid';

export default function MenuPage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Menu"
          description="Browse the restaurant menu before you arrive or while you are already checked in."
        >
          <ButtonLink href="/live" variant="secondary">
            Check in first
          </ButtonLink>
        </PageHeader>
      </Container>
      <MenuGrid />
    </>
  );
}

