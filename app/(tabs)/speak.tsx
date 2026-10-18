import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { typography } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

export default function SpeakTab() {
  const { colors } = useTheme();

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Speaking practice</Text>
      <Card accent="blue">
        <Text style={{ color: colors.textMuted, marginBottom: 12 }}>
          Push-to-talk conversation with transcription, tutor replies, and optional voice playback.
        </Text>
        <Button label="Start conversation" variant="ai" onPress={() => router.push('/conversation')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1 },
});
