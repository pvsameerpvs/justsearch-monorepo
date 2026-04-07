import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { Surface } from '@/components/shared/surface';
import { demoRestaurant } from '@/lib/demo-data';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';

const socialIcons = {
  Instagram,
  Facebook,
  WhatsApp: MessageCircle,
} as const;

export function SocialLinks() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <Surface className="p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[rgb(var(--brand))]">
                Social links
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
                Let guests find the restaurant wherever they already are.
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                Social links are managed in the dashboard and flow through to the customer
                frontend automatically. This keeps the public profile fresh without manual edits.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {demoRestaurant.socials.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons] ?? MessageCircle;
                return (
                  <ButtonLink key={social.label} href={social.href} variant="secondary" size="sm" external>
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {social.label}
                    </span>
                  </ButtonLink>
                );
              })}
            </div>
          </div>
        </Surface>
      </Container>
    </section>
  );
}

