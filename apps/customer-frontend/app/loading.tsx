import { Container } from '@/components/shared/container';

export default function Loading() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-xl space-y-4">
          <div className="h-32 animate-pulse rounded-[32px] border border-[rgb(var(--border)/0.56)] bg-white/70" />
          <div className="h-32 animate-pulse rounded-[32px] border border-[rgb(var(--border)/0.56)] bg-white/70" />
          <div className="h-32 animate-pulse rounded-[32px] border border-[rgb(var(--border)/0.56)] bg-white/70" />
        </div>
      </Container>
    </section>
  );
}
