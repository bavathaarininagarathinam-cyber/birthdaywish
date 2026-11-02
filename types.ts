export type ThemeColor = 'Pink' | 'Purple' | 'Blue' | 'Gold';

export interface BirthdayConfig {
  name: string;
  age: number;
  message: string;
  birthdayDate: string; // YYYY-MM-DD
  photoUrl: string | null;
  theme: ThemeColor;
}

export interface WishNote {
  id: string;
  author: string;
  message: string;
  color: string;
  rotation: number;
  timestamp: number;
  likes: number;
}

export interface BalloonItem {
  id: number;
  x: number; // percentage 5 - 90
  y: number; // percentage
  speed: number;
  color: string;
  size: number;
  wish: string;
  popped: boolean;
}

export interface ThemeStyles {
  name: ThemeColor;
  primary: string;
  primaryHover: string;
  accentBg: string;
  gradientBg: string;
  heroGradient: string;
  cardBg: string;
  border: string;
  textPrimary: string;
  textMuted: string;
  badgeBg: string;
  badgeText: string;
  ring: string;
  candleColors: string[];
}

export const THEME_CONFIGS: Record<ThemeColor, ThemeStyles> = {
  Pink: {
    name: 'Pink',
    primary: 'bg-rose-500',
    primaryHover: 'hover:bg-rose-600',
    accentBg: 'bg-rose-50',
    gradientBg: 'from-rose-50 via-pink-50 to-amber-50',
    heroGradient: 'from-rose-500 via-pink-500 to-amber-500',
    cardBg: 'bg-white/90',
    border: 'border-rose-200',
    textPrimary: 'text-rose-950',
    textMuted: 'text-rose-700',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    ring: 'focus:ring-rose-400',
    candleColors: ['#fb7185', '#f43f5e', '#fda4af', '#f472b6', '#fb923c'],
  },
  Purple: {
    name: 'Purple',
    primary: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    accentBg: 'bg-purple-50',
    gradientBg: 'from-purple-50 via-fuchsia-50 to-pink-50',
    heroGradient: 'from-purple-600 via-violet-600 to-pink-500',
    cardBg: 'bg-white/90',
    border: 'border-purple-200',
    textPrimary: 'text-purple-950',
    textMuted: 'text-purple-700',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-800',
    ring: 'focus:ring-purple-400',
    candleColors: ['#c084fc', '#a855f7', '#d8b4fe', '#818cf8', '#f472b6'],
  },
  Blue: {
    name: 'Blue',
    primary: 'bg-sky-500',
    primaryHover: 'hover:bg-sky-600',
    accentBg: 'bg-sky-50',
    gradientBg: 'from-sky-50 via-cyan-50 to-indigo-50',
    heroGradient: 'from-sky-500 via-cyan-500 to-indigo-600',
    cardBg: 'bg-white/90',
    border: 'border-sky-200',
    textPrimary: 'text-sky-950',
    textMuted: 'text-sky-700',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-800',
    ring: 'focus:ring-sky-400',
    candleColors: ['#38bdf8', '#0284c7', '#7dd3fc', '#60a5fa', '#34d399'],
  },
  Gold: {
    name: 'Gold',
    primary: 'bg-amber-500',
    primaryHover: 'hover:bg-amber-600',
    accentBg: 'bg-amber-50',
    gradientBg: 'from-amber-50 via-yellow-50 to-orange-50',
    heroGradient: 'from-amber-500 via-orange-500 to-yellow-500',
    cardBg: 'bg-white/90',
    border: 'border-amber-200',
    textPrimary: 'text-amber-950',
    textMuted: 'text-amber-800',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    ring: 'focus:ring-amber-400',
    candleColors: ['#f59e0b', '#d97706', '#fbbf24', '#f97316', '#eab308'],
  },
};
