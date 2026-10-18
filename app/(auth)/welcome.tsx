import { Link } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Screen } from '@/components/ui/Screen';
import { spacing, typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function WelcomeScreen() {
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={styles.hero}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <Text style={[styles.title, { color: colors.text }]}>FluentMate AI</Text>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Your personal English-speaking coach — friendly, honest, and built for daily practice.
        </Text>
      </View>

      {!isSupabaseConfigured ? (
        <Text style={[styles.note, { color: colors.warning }]}>
          Add Supabase keys in `.env` (see `.env.example`) to enable sign-in and cloud sync.
        </Text>
      ) : null}

      <Link href="/(auth)/sign-up" asChild>
        <Button label="Create account" onPress={() => {}} />
      </Link>
      <Link href="/(auth)/sign-in" asChild>
        <Button label="Sign in" onPress={() => {}} variant="secondary" />
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  logo: { width: 96, height: 96, borderRadius: 24 },
  title: { ...typography.h1, textAlign: 'center' },
  subtitle: { ...typography.body, textAlign: 'center' },
  note: { ...typography.caption, textAlign: 'center' },
});
