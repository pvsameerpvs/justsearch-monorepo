import { Container } from '@/components/shared/container';
import { SectionHeading } from '@/components/shared/section-heading';
import { ButtonLink } from '@/components/shared/button-link';
import { demoRestaurant } from '@/lib/demo-data';
import { MenuCategoryCard } from './menu-category';

type MenuGridProps = {
  compact?: boolean;
};

export function MenuGrid({ compact = false }: MenuGridProps) {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Menu"
            title="Public menu cards, structured and easy to update."
            description="The dashboard can manage structured menu content, PDF menus, or image-based menu assets while keeping the customer view polished."
            action={<ButtonLink href="/contact" variant="secondary">Ask about catering</ButtonLink>}
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {demoRestaurant.menu
              .slice(0, compact ? 2 : demoRestaurant.menu.length)
              .map((category) => (
                <MenuCategoryCard key={category.title} {...category} compact={compact} />
              ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

