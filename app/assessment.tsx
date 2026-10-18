import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { useAuth } from '@/hooks/useAuth';
import { useLearningPlan } from '@/hooks/useLearningPlan';
import { assessEnglish } from '@/lib/api/ai';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/providers/ThemeProvider';
import type { AssessmentTurn } from '@/types/assessment';

const question = 'Tell me about yourself and why you want to improve your English.';

export default function AssessmentScreen() {
  const { colors } = useTheme();
  const { user, profile } = useAuth();
  const { ensureDailyPlan } = useLearningPlan();
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!user || !answer.trim()) {
      setError('Write a few sentences so we can assess your English.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const turn: AssessmentTurn = {
        stage: 'warmup', question, answer: answer.trim(), answeredAt: new Date().toISOString(), inputMode: 'text',
      };
      const report = await assessEnglish({ turns: [turn], learnerContext: profile ?? undefined });
      const { error: saveError } = await supabase.from('assessments').insert({
        user_id: user.id,
        assessment_type: 'initial',
        estimated_cefr_level: report.estimated_cefr_level,
        skill_scores: report.skill_scores,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendations: report.learning_strategy,
        pronunciation_assessed: false,
        assessment_version: '1.0.0',
        raw_report: report,
      });
      if (saveError) throw saveError;
      const { error: profileError } = await supabase.from('profiles')
        .update({ estimated_cefr_level: report.estimated_cefr_level }).eq('id', user.id);
      if (profileError) throw profileError;
      await ensureDailyPlan(report);
      router.replace('/(tabs)');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Assessment failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>Let&apos;s find your starting point</Text>
      <Text style={{ color: colors.textMuted }}>Answer in your own words. This is a learning estimate, not a certification.</Text>
      <View style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 18 }}>
        <Text style={{ color: colors.text, fontSize: 17, fontWeight: '600' }}>{question}</Text>
      </View>
      <Input label="Your answer" multiline value={answer} onChangeText={setAnswer} placeholder="Write a few sentences…" style={{ minHeight: 140, textAlignVertical: 'top' }} />
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
      <Button label="Get my baseline" onPress={() => void submit()} loading={busy} />
    </Screen>
  );
}
