import { EmptyState } from '@/components/shared/empty-state';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';

export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <EmptyState
          title="This page could not be found"
          description="The restaurant frontend stays public, but this route does not exist in the current demo."
          action={<ButtonLink href="/">Back to home</ButtonLink>}
        />
      </Container>
    </section>
  );
}

