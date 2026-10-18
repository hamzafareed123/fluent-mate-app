import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemScheme } from 'react-native';

import { palette, type ThemeMode } from '@/constants/theme';

type ThemeContextValue = {
  mode: ThemeMode;
  colors: (typeof palette)[ThemeMode];
  setMode: (mode: ThemeMode | 'system') => void;
  preference: ThemeMode | 'system';
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const system = useSystemScheme();
  const [preference, setPreference] = useState<ThemeMode | 'system'>('system');

  const mode: ThemeMode = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo(
    () => ({
      mode,
      colors: palette[mode],
      preference,
      setMode: setPreference,
    }),
    [mode, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within AppThemeProvider');
  return ctx;
}
