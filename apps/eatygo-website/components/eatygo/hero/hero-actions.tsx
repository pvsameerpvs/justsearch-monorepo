import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HeroActions() {
  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <Link
        href="/register"
        className="group inline-flex items-center gap-2.5 rounded-xl bg-tomato px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-tomato/25 transition-all duration-300 hover:bg-[#d9442f] hover:shadow-xl hover:shadow-tomato/30 hover:-translate-y-0.5"
      >
        Register restaurant
        <ArrowRight
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
      <Link
        href="/platform"
        className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:border-white/40"
      >
        See platform
      </Link>
    </div>
  );
}
