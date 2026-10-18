import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { HomeHeader } from '@/components/dashboard/HomeHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { Screen } from '@/components/ui/Screen';
import { spacing, typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useLearningPlan } from '@/hooks/useLearningPlan';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/providers/ThemeProvider';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, profile } = useAuth();
  const { milestones, loading, completeMilestone } = useLearningPlan();
  const [hasAssessment, setHasAssessment] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from('assessments')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setHasAssessment(!!data));
  }, [user]);

  const completed = milestones.filter((m) => m.status === 'completed').length;
  const progress = milestones.length ? completed / milestones.length : 0;

  if (hasAssessment === false) {
    return (
      <Screen>
        <EmptyState
          title="Let's find your starting point"
          description="Take a short speaking assessment so FluentMate can build a plan matched to your level."
          actionLabel="Start assessment"
          onAction={() => router.push('/assessment')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <HomeHeader name={profile?.display_name ?? 'Learner'} level={profile?.estimated_cefr_level ?? null} />

      <View style={styles.progressRow}>
        <ProgressRing progress={progress} label="Today" />
        <View style={styles.stats}>
          <Stat label="Streak" value={`${profile?.current_streak ?? 0} days`} />
          <Stat label="Total XP" value={`${profile?.total_xp ?? 0}`} />
          <Stat label="Daily goal" value={`${profile?.daily_goal_minutes ?? 15} min`} />
        </View>
      </View>

      <Card accent="green">
        <Text style={[styles.cardTitle, { color: colors.text }]}>Continue learning</Text>
        <Text style={{ color: colors.textMuted }}>
          {loading
            ? 'Loading your plan…'
            : milestones.length
              ? `${completed}/${milestones.length} milestones complete today`
              : 'Generate your plan after assessment results.'}
        </Text>
        {milestones[0] && milestones[0].status !== 'completed' ? (
          <Button
            label={`Do: ${milestones[0].title}`}
            onPress={() => void completeMilestone(milestones[0].id)}
            style={{ marginTop: spacing.md }}
          />
        ) : null}
      </Card>

      <Card accent="blue">
        <Text style={[styles.cardTitle, { color: colors.text }]}>Talk to your AI friend</Text>
        <Text style={{ color: colors.textMuted, marginBottom: spacing.md }}>
          Practise natural conversation with honest, supportive feedback.
        </Text>
        <Button label="Open Speak" variant="ai" onPress={() => router.push('/conversation')} />
      </Card>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stats: { flex: 1, gap: spacing.sm },
  cardTitle: { ...typography.h3, marginBottom: spacing.xs },
  statLabel: { ...typography.caption },
  statValue: { ...typography.h3 },
});
