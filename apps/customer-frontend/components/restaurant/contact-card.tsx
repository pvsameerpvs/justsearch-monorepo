import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { demoRestaurant } from '@/lib/demo-data';

export function ContactCard() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Surface className="p-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
                Contact
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                Keep the restaurant reachable from the public site.
              </h3>
              <div className="space-y-3 text-sm leading-6 text-slate-600">
                <p>{demoRestaurant.address}</p>
                <p>{demoRestaurant.phone}</p>
                <p>{demoRestaurant.email}</p>
              </div>
            </div>
          </Surface>

          <Surface className="p-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
                Location note
              </p>
              <p className="text-sm leading-6 text-slate-600">
                This is the public contact card customers can use before checking in. The admin
                dashboard can update these values instantly for all restaurant touchpoints.
              </p>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5 text-sm text-slate-500">
                Map preview or embedded location widget can be connected here later.
              </div>
            </div>
          </Surface>
        </div>
      </Container>
    </section>
  );
}

