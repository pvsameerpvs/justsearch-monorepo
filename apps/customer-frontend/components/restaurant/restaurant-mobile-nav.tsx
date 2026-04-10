"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, Gamepad2, User } from 'lucide-react';
import { useMeasuredCssVarHeight } from '@/components/layout/use-measured-css-var-height';

export function RestaurantMobileNav() {
  const pathname = usePathname();
  const containerRef = useMeasuredCssVarHeight('--restaurant-mobile-nav-height');

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Eat', icon: UtensilsCrossed, href: '/menu' },
    { label: 'Play', icon: Gamepad2, href: '/eat-play' },
    { label: 'Profile', icon: User, href: '/profile' },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 z-[9999] w-full"
    >
      <nav className="flex items-center justify-around rounded-t-[24px] border-t border-x border-white/20 bg-white/95 pb-[calc(env(safe-area-inset-bottom,16px)+8px)] pt-3 shadow-[0_-15px_40px_rgba(0,0,0,0.12)] backdrop-blur-3xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex flex-col items-center gap-1.5 rounded-2xl px-4 py-2.5 transition-all active:scale-90 ${
                isActive 
                  ? 'text-[rgb(var(--brand))]' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                isActive 
                  ? 'bg-[rgb(var(--brand)/0.15)] shadow-[0_8px_16px_rgba(var(--brand),0.08)]' 
                  : 'bg-transparent'
              }`}>
                <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -top-1 h-1 w-1 rounded-full bg-[rgb(var(--brand))] shadow-[0_0_8px_rgba(var(--brand),0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
