import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { typography } from '@/constants/theme';
import { sendPasswordReset } from '@/lib/auth';
import { forgotPasswordSchema } from '@/lib/validation';
import { useTheme } from '@/providers/ThemeProvider';

type Values = { email: string };

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [message, setMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(null);
    try {
      await sendPasswordReset(email);
      setMessage('If an account exists, a reset link has been sent to your email.');
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Request failed');
    }
  });

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Reset password</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input label="Email" autoCapitalize="none" keyboardType="email-address" onBlur={onBlur} onChangeText={onChange} value={value} error={errors.email?.message} />
        )}
      />
      {formError ? <Text style={{ color: colors.error }}>{formError}</Text> : null}
      {message ? <Text style={{ color: colors.primary }}>{message}</Text> : null}
      <Button label="Send reset link" onPress={() => void onSubmit()} loading={isSubmitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1 },
});
