import { router } from 'expo-router';
import { Text } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { useLearningPlan } from '@/hooks/useLearningPlan';
import { useTheme } from '@/providers/ThemeProvider';

export default function LearnScreen() {
  const { colors } = useTheme();
  const { milestones, loading, error, loadTodayPlan, completeMilestone } = useLearningPlan();
  return (
    <Screen>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>Today&apos;s learning</Text>
      {loading ? <Text style={{ color: colors.textMuted }}>Loading your plan…</Text> : null}
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
      {!loading && milestones.length === 0 ? <EmptyState title="Your plan is ready after assessment" description="Complete a short baseline assessment to personalize your activities." actionLabel="Start assessment" onAction={() => router.push('/assessment')} /> : null}
      {milestones.map((item) => (
        <Card key={item.id}>
          <Text style={{ color: colors.text, fontSize: 17, fontWeight: '600' }}>{item.title}</Text>
          <Text style={{ color: colors.textMuted }}>{item.description ?? `${item.estimated_minutes} minutes · ${item.xp_reward} XP`}</Text>
          <Button label={item.status === 'completed' ? 'Completed' : 'Complete activity'} disabled={item.status === 'completed'} onPress={() => void completeMilestone(item.id)} />
        </Card>
      ))}
      {!loading && milestones.length > 0 ? <Button label="Refresh plan" variant="secondary" onPress={() => void loadTodayPlan()} /> : null}
    </Screen>
  );
}
