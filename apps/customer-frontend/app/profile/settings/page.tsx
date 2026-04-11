import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';

const settings = [
  { title: 'Notifications', description: 'Promo messages and updates (demo)' },
  { title: 'Privacy', description: 'Data stored in your browser (demo)' },
  { title: 'Language', description: 'English (demo)' },
] as const;

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
              Preferences (demo)
            </h1>
            <p className="mt-3 text-sm leading-6 text-[rgb(var(--muted))]">
              These are demo settings for UI only.
            </p>
          </Surface>

          <div className="grid gap-4">
            {settings.map((item) => (
              <Surface
                key={item.title}
                className="rounded-[28px] border-white/70 bg-white/90 p-6"
              >
                <p className="text-sm font-semibold text-[rgb(var(--ink))]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-[rgb(var(--muted))]">
                  {item.description}
                </p>
              </Surface>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

