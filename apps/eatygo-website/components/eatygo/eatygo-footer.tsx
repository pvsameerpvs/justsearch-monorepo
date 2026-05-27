import { MapPin, Phone } from 'lucide-react';
import { EatygoLogo } from './eatygo-logo';

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'Features', href: '/platform' },
      { label: 'Restaurants', href: '/restaurants' },
      { label: 'Games', href: '/games' },
      { label: 'Register', href: '/register' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  },
];

export function EatygoFooter() {
  return (
    <footer id="cities" className="border-t border-black/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="max-w-xs">
            <EatygoLogo />
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Websites, QR tables, delivery, games, and rewards — built for modern restaurants in the UAE.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href="tel:+971554617275"
                className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-lagoon"
              >
                <Phone size={15} />
                +971 55 461 7275
              </a>
              <a
                href="tel:+971542941197"
                className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-lagoon"
              >
                <Phone size={15} />
                +971 54 294 1197
              </a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-bold uppercase tracking-wider text-ink">{group.title}</h4>
              <ul className="mt-5 grid gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 transition-colors hover:text-lagoon"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} Eatygo. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MapPin size={13} aria-hidden="true" />
            <span>UAE based</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
