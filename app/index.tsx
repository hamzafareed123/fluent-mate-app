import { Redirect, type Href } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/providers/ThemeProvider';

export default function Index() {
  const { session, profile, loading, configured } = useAuth();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!configured) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!session) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!profile?.onboarding_completed) {
    return <Redirect href={'/(onboarding)' as Href} />;
  }

  return <Redirect href="/(tabs)" />;
}
