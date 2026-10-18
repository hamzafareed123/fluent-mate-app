import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { Button } from '@/components/ui/Button';

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
      {actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} variant="primary" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
  title: { ...typography.h2, textAlign: 'center' },
  description: { ...typography.body, textAlign: 'center' },
});
