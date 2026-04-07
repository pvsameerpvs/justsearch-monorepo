import { Container } from '@/components/shared/container';
import { SectionHeading } from '@/components/shared/section-heading';
import { ButtonLink } from '@/components/shared/button-link';
import { demoRestaurant } from '@/lib/demo-data';
import { MenuCategoryCard } from './menu-category';

export function MenuPreview() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Highlights"
            title="A quick look at what the kitchen is serving."
            description="Guests can preview the menu before deciding whether to stay, order, or redeem a reward."
            action={<ButtonLink href="/menu" variant="outline">Browse full menu</ButtonLink>}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {demoRestaurant.menu.slice(0, 2).map((category) => (
              <MenuCategoryCard key={category.title} {...category} compact />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

