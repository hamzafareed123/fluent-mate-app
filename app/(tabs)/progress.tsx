import { Text } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/ui/Screen';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/providers/ThemeProvider';

export default function ProgressScreen() {
  const { colors } = useTheme();
  const { data, loading, error } = useProgress();
  return (
    <Screen>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>Your progress</Text>
      {loading ? <Text style={{ color: colors.textMuted }}>Loading your progress…</Text> : null}
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
      {data ? <>
        <Card><Text style={{ color: colors.text }}>Estimated level: {data.latestAssessmentLevel ?? 'Not assessed'}</Text></Card>
        <Card><Text style={{ color: colors.text }}>Experience: {data.totalXp} XP · Current streak: {data.streak} days</Text></Card>
        <Card><Text style={{ color: colors.text }}>This week: {data.speakingMinutesWeek} speaking minutes · {data.milestonesCompletedWeek} activities completed</Text></Card>
        <Card><Text style={{ color: colors.text, fontWeight: '600' }}>Practice focus</Text>
          {data.topMistakes.length ? data.topMistakes.map((mistake) => <Text key={mistake.original_text} style={{ color: colors.textMuted }}>{mistake.original_text} · seen {mistake.occurrence_count} times</Text>) : <Text style={{ color: colors.textMuted }}>Your saved correction patterns will appear here.</Text>}
        </Card>
      </> : null}
    </Screen>
  );
}
