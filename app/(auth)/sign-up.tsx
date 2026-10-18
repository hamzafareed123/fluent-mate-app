import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { typography } from '@/constants/theme';
import { signUpWithEmail } from '@/lib/auth';
import { signUpSchema, type SignUpValues } from '@/lib/validation';
import { useTheme } from '@/providers/ThemeProvider';

export default function SignUpScreen() {
  const { colors } = useTheme();
  const [info, setInfo] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    setInfo(null);
    try {
      const result = await signUpWithEmail(values.email, values.password);
      if (result.session) {
        router.replace('/(onboarding)' as Href);
        return;
      }
      setInfo('Check your email to verify your account, then sign in.');
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Sign up failed');
    }
  });

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Create your account</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Email" autoCapitalize="none" keyboardType="email-address" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Password" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.password?.message} />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Confirm password" secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} error={errors.confirmPassword?.message} />
        )}
      />
      {formError ? <Text style={{ color: colors.error }}>{formError}</Text> : null}
      {info ? <Text style={{ color: colors.primary }}>{info}</Text> : null}
      <Button label="Sign up" onPress={() => void onSubmit()} loading={isSubmitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1 },
});
