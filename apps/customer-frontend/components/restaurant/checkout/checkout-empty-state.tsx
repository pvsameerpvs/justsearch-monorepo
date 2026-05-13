import { ButtonLink } from '@/components/shared/button-link';
import { Container } from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';

export function CheckoutEmptyState() {
  return (
    <section className="py-8 sm:py-10">
      <Container className="max-w-3xl">
        <EmptyState
          title="No delivery items yet"
          description="Add menu items in delivery mode, then come here to review address, summary, and place the order."
          action={
            <ButtonLink href="/menu" variant="primary" size="md">
              Back to menu
            </ButtonLink>
          }
        />
      </Container>
    </section>
  );
}
