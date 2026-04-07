import { PageHeader } from '@justsearch/ui';
import { Suspense } from 'react';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { CheckinPanel } from '@/components/auth/checkin-panel';

export default function CheckinPage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Check-in validation"
          description="Enter or confirm the short-lived token to create a restaurant-scoped active session."
        >
          <ButtonLink href="/games" variant="secondary">
            Open games
          </ButtonLink>
        </PageHeader>
      </Container>
      <Suspense
        fallback={
          <Container className="pb-12">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-8 text-sm text-slate-600 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              Loading check-in validation...
            </div>
          </Container>
        }
      >
        <CheckinPanel />
      </Suspense>
    </>
  );
}
