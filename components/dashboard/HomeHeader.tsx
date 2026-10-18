import { StyleSheet, Text, View } from 'react-native';

import { typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

type Props = {
  name: string;
  level: string | null;
};

export function HomeHeader({ name, level }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.greeting, { color: colors.textMuted }]}>Good to see you</Text>
      <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      {level ? (
        <Text style={[styles.level, { color: colors.primary }]}>Estimated level · {level}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  greeting: { ...typography.caption },
  name: { ...typography.h1 },
  level: { ...typography.body, fontWeight: '600' },
});
