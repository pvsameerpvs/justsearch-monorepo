import type { CSSProperties } from 'react';
import type { RestaurantTheme } from './restaurant-types';

const themeDefaults = {
  muted: '94 108 132',
  border: '226 232 240',
  pageBackgroundFrom: '248 243 234',
  pageBackgroundTo: '244 239 230',
  pageGlowBrand: '15 118 110',
  pageGlowAccent: '245 170 66',
  cardSurface: '255 255 255',
  cardSurfaceMuted: '248 250 252',
  cardBorder: '255 255 255',
  logoGradientFrom: '15 118 110',
  logoGradientTo: '245 170 66',
} as const;

export function getRestaurantThemeVars(theme: RestaurantTheme): CSSProperties {
  return {
    '--brand': theme.brandColor,
    '--brand-soft': theme.brandSoft,
    '--accent': theme.accentColor,
    '--accent-soft': theme.accentSoft,
    '--surface': theme.surface,
    '--ink': theme.ink,
    '--muted': theme.muted ?? themeDefaults.muted,
    '--border': theme.border ?? themeDefaults.border,
    '--page-bg-from':
      theme.pageBackgroundFrom ?? themeDefaults.pageBackgroundFrom,
    '--page-bg-to': theme.pageBackgroundTo ?? themeDefaults.pageBackgroundTo,
    '--page-glow-brand': theme.pageGlowBrand ?? theme.brandColor,
    '--page-glow-accent': theme.pageGlowAccent ?? theme.accentColor,
    '--card-surface': theme.cardSurface ?? themeDefaults.cardSurface,
    '--card-surface-muted':
      theme.cardSurfaceMuted ?? themeDefaults.cardSurfaceMuted,
    '--card-border': theme.cardBorder ?? themeDefaults.cardBorder,
    '--logo-from': theme.logoGradientFrom ?? theme.brandColor,
    '--logo-to': theme.logoGradientTo ?? theme.accentColor,
  } as CSSProperties;
}
