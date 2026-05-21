"use client";

import type { DeliveryTier } from "@justsearch/types";
import { useMemo } from "react";

export function useDeliveryTierValidation(tiers: DeliveryTier[], maxRadiusKm: number): string[] {
  return useMemo(() => {
    const sorted = [...tiers].sort((a, b) => a.minKm - b.minKm);
    const gaps: string[] = [];
    if (sorted.length === 0) return ['Add at least one pricing tier'];
    if (sorted[0].minKm > 0) gaps.push(`Gap from 0 km to ${sorted[0].minKm} km has no price`);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].minKm > sorted[i - 1].maxKm) {
        gaps.push(`Gap from ${sorted[i - 1].maxKm} km to ${sorted[i].minKm} km has no price`);
      }
    }
    const last = sorted[sorted.length - 1];
    if (last.maxKm < maxRadiusKm) {
      gaps.push(`Gap from ${last.maxKm} km to ${maxRadiusKm} km has no price`);
    }
    return gaps;
  }, [tiers, maxRadiusKm]);
}
