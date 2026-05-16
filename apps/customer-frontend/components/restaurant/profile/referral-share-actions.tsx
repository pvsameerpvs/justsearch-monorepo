"use client";

import { Button } from '@justsearch/ui';
import { Share2 } from 'lucide-react';

interface ReferralShareActionsProps {
  link: string;
}

export function ReferralShareActions({ link }: ReferralShareActionsProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join me at Mosaic Table!',
          text: 'Scan the QR code and get 500 bonus points!',
          url: link,
        });
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="mt-3 flex gap-2">
      <Button onClick={handleShare} className="flex-1 bg-amber-500 hover:bg-amber-600">
        <Share2 className="mr-2 h-4 w-4" />
        Share Link
      </Button>
    </div>
  );
}
