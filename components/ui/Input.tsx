import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { radii, spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      {label ? <Text style={[styles.label, { color: colors.text }]}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
          },
          style,
        ]}
        {...rest}
      />
      {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  label: { ...typography.caption },
  input: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    ...typography.body,
  },
  error: { ...typography.caption },
});
