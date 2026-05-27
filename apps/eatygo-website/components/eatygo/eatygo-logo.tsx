'use client';

import Link from 'next/link';

interface EatygoLogoProps {
  showText?: boolean;
  className?: string;
}

export function EatygoLogo({ showText = true, className = '' }: EatygoLogoProps) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="relative block h-10 w-10 shrink-0">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
          {/* Magnifying glass circle */}
          <circle cx="52" cy="52" r="42" stroke="#333333" strokeWidth="10" fill="white" />
          {/* Magnifying glass handle */}
          <line x1="82" y1="82" x2="110" y2="110" stroke="#333333" strokeWidth="12" strokeLinecap="round" />
          
          {/* Fork */}
          <path d="M38 32 L38 52 M46 32 L46 52 M42 28 L42 52" stroke="#E94F37" strokeWidth="5" strokeLinecap="round" />
          <line x1="38" y1="54" x2="46" y2="54" stroke="#E94F37" strokeWidth="5" strokeLinecap="round" />
          
          {/* Spoon */}
          <ellipse cx="62" cy="40" rx="6" ry="9" stroke="#E94F37" strokeWidth="4" fill="#E94F37" />
          <line x1="62" y1="50" x2="62" y2="72" stroke="#E94F37" strokeWidth="4" strokeLinecap="round" />
          
          {/* Location pin */}
          <path d="M30 65 C30 58 38 54 48 58 C56 62 58 72 52 82 L42 95 L32 82 C26 72 28 62 30 65Z" fill="#E94F37" />
          <path d="M38 70 C38 66 42 64 46 66 C50 68 50 74 46 78 L42 84 L38 78 C34 74 34 68 38 70Z" fill="white" />
          
          {/* Sparkle star */}
          <path d="M88 18 L90 24 L96 26 L90 28 L88 34 L86 28 L80 26 L86 24Z" fill="#22c55e" />
          {/* Sparkle dots */}
          <circle cx="78" cy="14" r="2.5" fill="#22c55e" />
          <circle cx="96" cy="12" r="2" fill="#22c55e" />
          <circle cx="102" cy="22" r="2" fill="#22c55e" />
          <circle cx="98" cy="36" r="2.5" fill="#22c55e" />
          <circle cx="84" cy="40" r="2" fill="#22c55e" />
        </svg>
      </span>
      {showText && (
        <span className="font-display text-[1.55rem] font-semibold leading-none tracking-tight text-[#333333]">
          eatygo
        </span>
      )}
    </Link>
  );
}
