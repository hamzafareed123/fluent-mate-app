import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { spacing, typography } from '@/constants/theme';
import { useProfile } from '@/hooks/useProfile';
import type { OnboardingValues } from '@/lib/validation';
import { useTheme } from '@/providers/ThemeProvider';

const GOALS: { value: OnboardingValues['primary_goal']; label: string }[] = [
  { value: 'everyday_conversation', label: 'Everyday conversation' },
  { value: 'job_interviews', label: 'Job interviews' },
  { value: 'professional', label: 'Professional communication' },
  { value: 'studying_abroad', label: 'Studying abroad' },
  { value: 'presentations', label: 'Presentations' },
  { value: 'general_fluency', label: 'General fluency' },
];

const MINUTES = [5, 10, 15, 20, 30] as const;

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { saveOnboarding } = useProfile();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Partial<OnboardingValues>>({
    correction_preference: 'gentle',
    daily_goal_minutes: 15,
    self_reported_level: 'intermediate',
    main_difficulty: 'speaking_confidence',
    primary_goal: 'everyday_conversation',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finish = async () => {
    if (!values.display_name) {
      setError('Please enter your name.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveOnboarding(values as OnboardingValues);
      router.replace('/assessment');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save onboarding');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Let&apos;s personalize FluentMate</Text>
      <Text style={[styles.step, { color: colors.textMuted }]}>Step {step + 1} of 4</Text>

      {step === 0 ? (
        <Input
          label="What is your name?"
          value={values.display_name ?? ''}
          onChangeText={(display_name) => setValues((v) => ({ ...v, display_name }))}
        />
      ) : null}

      {step === 1 ? (
        <View style={styles.options}>
          {GOALS.map((g) => (
            <Chip
              key={g.value}
              label={g.label}
              selected={values.primary_goal === g.value}
              onPress={() => setValues((v) => ({ ...v, primary_goal: g.value }))}
            />
          ))}
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.options}>
          {MINUTES.map((m) => (
            <Chip
              key={m}
              label={`${m} min / day`}
              selected={values.daily_goal_minutes === m}
              onPress={() => setValues((v) => ({ ...v, daily_goal_minutes: m }))}
            />
          ))}
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.options}>
          {(['gentle', 'direct'] as const).map((pref) => (
            <Chip
              key={pref}
              label={pref === 'gentle' ? 'Gentle corrections' : 'Direct, detailed corrections'}
              selected={values.correction_preference === pref}
              onPress={() => setValues((v) => ({ ...v, correction_preference: pref }))}
            />
          ))}
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            You can skip accent preference for now and change these later in Profile.
          </Text>
        </View>
      ) : null}

      {error ? <Text style={{ color: colors.error }}>{error}</Text> : null}

      <View style={styles.actions}>
        {step > 0 ? <Button label="Back" variant="secondary" onPress={() => setStep((s) => s - 1)} /> : null}
        {step < 3 ? (
          <Button label="Continue" onPress={() => setStep((s) => s + 1)} />
        ) : (
          <Button label="Start assessment" onPress={() => void finish()} loading={saving} />
        )}
      </View>
    </Screen>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}>
      <Text style={{ color: selected ? '#fff' : colors.text, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1 },
  step: { ...typography.caption },
  options: { gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  hint: { ...typography.caption, marginTop: spacing.sm },
  actions: { gap: spacing.sm, marginTop: spacing.lg },
});
