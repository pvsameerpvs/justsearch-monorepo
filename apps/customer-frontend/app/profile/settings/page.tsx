import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { RegistrationSettingsCard } from '@/components/restaurant/profile/registration-settings-card';

export default function ProfileSettingsPage() {
  return (
    <section className="py-8 sm:py-10">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <Surface className="rounded-[32px] border-white/70 bg-white/90 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
              Settings
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.06em] text-[rgb(var(--ink))]">
              Account
            </h1>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              Manage your account preferences.
            </p>
          </Surface>

          <div className="grid gap-4">
            <RegistrationSettingsCard />
          </div>
        </div>
      </Container>
    </section>
  );
}
