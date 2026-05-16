import { EmptyState } from '@/components/shared/empty-state';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';

export default function NotFound() {
  return (
    <section className="py-24">
      <Container>
        <EmptyState
          title="This page could not be found"
          description="The page you are looking for does not exist or has been moved."
          action={<ButtonLink href="/">Back to home</ButtonLink>}
        />
      </Container>
    </section>
  );
}

