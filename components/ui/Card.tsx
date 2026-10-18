import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { radii, spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type Props = { children: ReactNode; style?: ViewStyle; accent?: 'green' | 'blue' | 'none' };

export function Card({ children, style, accent = 'none' }: Props) {
  const { colors } = useTheme();
  const borderColor =
    accent === 'green' ? colors.primary : accent === 'blue' ? colors.aiBlue : colors.border;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor,
          shadowColor: colors.shadow,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
});
