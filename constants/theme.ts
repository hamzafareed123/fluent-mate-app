export const palette = {
  light: {
    background: '#FAF9F6',
    surface: '#FFFFFF',
    text: '#0F172A',
    textMuted: '#64748B',
    primary: '#22C55E',
    primaryDark: '#16A34A',
    aiBlue: '#3B82F6',
    aiViolet: '#8B5CF6',
    border: '#E2E8F0',
    error: '#EF4444',
    warning: '#F59E0B',
    shadow: 'rgba(15, 23, 42, 0.08)',
  },
  dark: {
    background: '#0B1220',
    surface: '#111827',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    primary: '#4ADE80',
    primaryDark: '#22C55E',
    aiBlue: '#60A5FA',
    aiViolet: '#A78BFA',
    border: '#1E293B',
    error: '#F87171',
    warning: '#FBBF24',
    shadow: 'rgba(0, 0, 0, 0.35)',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 34 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500' as const, lineHeight: 18 },
} as const;

export type ThemeMode = keyof typeof palette;
