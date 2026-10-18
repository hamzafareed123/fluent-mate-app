import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { radii, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type Variant = 'primary' | 'secondary' | 'ghost' | 'ai';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  style?: ViewStyle;
};

export function Button({ label, onPress, disabled, loading, variant = 'primary', style }: Props) {
  const { colors } = useTheme();

  const palette = {
    primary: { bg: colors.primary, text: '#FFFFFF', border: colors.primary },
    secondary: { bg: colors.surface, text: colors.text, border: colors.border },
    ghost: { bg: 'transparent', text: colors.text, border: 'transparent' },
    ai: { bg: colors.aiBlue, text: '#FFFFFF', border: colors.aiBlue },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={() => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: pressed ? 0.92 : 1,
        },
        (disabled || loading) && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  disabled: { opacity: 0.5 },
});
