import { Container } from '@/components/shared/container';
import { ButtonLink } from '@/components/shared/button-link';
import { footerNavLinks } from '@/lib/navigation';
import { demoRestaurant } from '@/lib/demo-data';
import { Instagram, MessageCircle, PhoneCall } from 'lucide-react';

const socialIcons = {
  Instagram,
  Facebook: MessageCircle,
  WhatsApp: PhoneCall,
} as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/70 bg-white/40 backdrop-blur-xl">
      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[rgb(var(--brand))]">
              {demoRestaurant.category}
            </p>
            <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[rgb(var(--ink))]">
              Public browsing stays open. Games unlock only during a valid session.
            </h2>
            <p className="max-w-lg text-sm leading-6 text-slate-600">{demoRestaurant.description}</p>
            <div className="flex flex-wrap gap-2">
              {demoRestaurant.socials.map((social) => {
                const Icon = socialIcons[social.label as keyof typeof socialIcons] ?? MessageCircle;
                return (
                  <ButtonLink key={social.label} href={social.href} external variant="secondary" size="sm">
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {social.label}
                    </span>
                  </ButtonLink>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[rgb(var(--ink))]">Quick Links</p>
            <div className="flex flex-wrap gap-2">
              {footerNavLinks.map((link) => (
                <ButtonLink key={link.href} href={link.href} variant="ghost" size="sm">
                  {link.label}
                </ButtonLink>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-[rgb(var(--ink))]">Contact</p>
            <div className="space-y-2 text-sm text-slate-600">
              <p>{demoRestaurant.address}</p>
              <p>{demoRestaurant.phone}</p>
              <p>{demoRestaurant.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-200/70 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} JustSearch Restaurant Activity</p>
          <p>Restaurant-scoped experience for guests, staff, and rewards.</p>
        </div>
      </Container>
    </footer>
  );
}
