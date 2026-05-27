'use client';

import { motion } from 'framer-motion';

interface HeroTagListProps {
  tags: string[];
}

export function HeroTagList({ tags }: HeroTagListProps) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag, i) => (
        <motion.span
          key={tag}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl border border-white/10 bg-white/10 px-3.5 py-2 text-sm text-white/90 backdrop-blur-sm transition-colors duration-300 hover:bg-white/15"
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}
