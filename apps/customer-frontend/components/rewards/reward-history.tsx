import { Container } from '@/components/shared/container';
import { Surface } from '@/components/shared/surface';
import { demoRestaurant } from '@/lib/demo-data';

export function RewardHistory() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Surface className="p-8">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
                Recent history
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                Reward and points history stays visible for the guest.
              </h3>
            </div>

            <div className="grid gap-4">
              {demoRestaurant.rewardHistory.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-[rgb(var(--ink))]">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.detail}</p>
                  </div>
                  <div className="text-sm text-slate-500 sm:text-right">
                    <p>{item.time}</p>
                    <p className="font-semibold text-[rgb(var(--brand))]">{item.points}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}

