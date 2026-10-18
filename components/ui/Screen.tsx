import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { spacing } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type Props = {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
};

export function Screen({ children, scroll = true, style }: Props) {
  const { colors } = useTheme();

  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.scrollContent, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
});
