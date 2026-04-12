"use client";

import { useEffect, useState } from 'react';

type AnimatedStatusEmojiProps = {
  isOnTheWay: boolean;
  className?: string;
};

export function AnimatedStatusEmoji({ 
  isOnTheWay, 
  className = "text-3xl" 
}: AnimatedStatusEmojiProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 333);
    return () => window.clearInterval(timer);
  }, []);

  const emojis = isOnTheWay 
    ? ['🛵', '🏠', '📍', '🍱', '🍔', '🍽️', '🍜', '👨‍🍳', '🍱', '🍜', '🍲'] 
    : ['🍔', '🍽️', '🍜', '👨‍🍳', '🍱', '🍜', '🍲'];

  const emojiIndex = Math.floor(now / 333) % emojis.length;
  const animationKey = Math.floor(now / 333);

  return (
    <div className="flex items-center justify-center">
      <span 
        key={animationKey}
        className={`${className} animate-in fade-in zoom-in duration-300 transform-gpu`}
      >
        {emojis[emojiIndex]}
      </span>
    </div>
  );
}
