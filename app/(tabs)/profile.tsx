import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from '@/lib/auth';
import { useTheme } from '@/providers/ThemeProvider';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, profile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const onSignOut = async () => {
    try { await signOut(); router.replace('/(auth)/welcome'); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not sign out.'); }
  };
  return (
    <Screen>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>Profile</Text>
      <Card>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{profile?.display_name ?? 'Learner'}</Text>
        <Text style={{ color: colors.textMuted }}>{user?.email}</Text>
        <Text style={{ color: colors.textMuted }}>Goal: {profile?.daily_goal_minutes ?? 15} minutes a day</Text>
        <Text style={{ color: colors.textMuted }}>Correction style: {profile?.correction_preference ?? 'gentle'}</Text>
      </Card>
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
      <Button label="Sign out" variant="secondary" onPress={() => void onSignOut()} />
    </Screen>
  );
}
