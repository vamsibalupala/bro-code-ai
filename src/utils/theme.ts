/**
 * Theme & Palette Management for Bro Application
 * Supports:
 * 1. Obsidian Stream (Default): #151515, #292929 surfaces, #A9003D / #7D002D / #4A001C burgundy gradient
 * 2. Pitch Charcoal (OLED): #0c0c0c base, #1a1a1a surfaces, #A9003D deep rose accent
 * 3. Midnight Velvet: #121014 base, #201b24 surfaces, #6b0027 burgundy blend
 */

export type ThemeMode = 'obsidian' | 'charcoal' | 'midnight';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  description: string;
  surfaceBase: string;
  surfaceCard: string;
  surfaceElevated: string;
  headerGradient: string;
  borderHairline: string;
  textPrimary: string;
  accentGold: string;
}

export const THEME_CONFIGS: Record<ThemeMode, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Stream (Default)',
    description: 'Dark charcoal #151515 & #292929 with deep burgundy gradient header #A9003D',
    surfaceBase: '#111111',
    surfaceCard: '#151515',
    surfaceElevated: '#292929',
    headerGradient: 'from-[#4A001C] via-[#7D002D] to-[#A9003D]',
    borderHairline: '#262626',
    textPrimary: '#F5F5F5',
    accentGold: '#D4AF37',
  },
  charcoal: {
    id: 'charcoal',
    name: 'Pitch Charcoal (OLED)',
    description: 'Pure black #000000 floor with #151515 cards and intense ruby highlights',
    surfaceBase: '#080808',
    surfaceCard: '#151515',
    surfaceElevated: '#222222',
    headerGradient: 'from-[#380015] via-[#5c0021] to-[#8a0032]',
    borderHairline: '#202020',
    textPrimary: '#FFFFFF',
    accentGold: '#F59E0B',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Velvet',
    description: 'Deep violet-tinted charcoal with wine red gradients',
    surfaceBase: '#0d0b0f',
    surfaceCard: '#18141d',
    surfaceElevated: '#282030',
    headerGradient: 'from-[#3c0228] via-[#610433] to-[#8a023b]',
    borderHairline: '#302636',
    textPrimary: '#FAFAFA',
    accentGold: '#E6C657',
  },
};

export function getThemeClasses(theme: ThemeMode) {
  return THEME_CONFIGS[theme] || THEME_CONFIGS.obsidian;
}
