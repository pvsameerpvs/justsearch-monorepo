import { PageHeader } from '@justsearch/ui';
import { Suspense } from 'react';
import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { SessionBanner } from '@/components/games/session-banner';
import { CheckinPanel } from '@/components/auth/checkin-panel';

export default function LivePage() {
  return (
    <>
      <Container className="pt-10">
        <PageHeader
          title="Live check-in"
          description="The permanent live route starts the QR validation flow and creates a temporary session."
        >
          <ButtonLink href="/checkin?token=demo-checkin-4821" variant="secondary">
            Try demo token
          </ButtonLink>
        </PageHeader>
      </Container>
      <SessionBanner
        title="Ready to check in"
        description="Scan the permanent route, validate the token, and unlock the protected customer flow."
      />
      <Suspense
        fallback={
          <Container className="pb-12">
            <div className="rounded-3xl border border-white/70 bg-white/80 p-8 text-sm text-slate-600 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              Loading check-in panel...
            </div>
          </Container>
        }
      >
        <CheckinPanel />
      </Suspense>
    </>
  );
}
