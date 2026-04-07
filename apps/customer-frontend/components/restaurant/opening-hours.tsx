import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { demoRestaurant } from '@/lib/demo-data';

export function OpeningHours() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Surface className="p-8">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
                Opening hours
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                Easy to visit, easy to remember.
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                The dashboard keeps restaurant hours visible on the customer frontend, so guests
                always know when the brand is open.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {demoRestaurant.hours.map((hours) => (
                <div key={hours.day} className="rounded-2xl bg-[rgb(var(--brand-soft))] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {hours.day}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[rgb(var(--ink))]">{hours.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}

