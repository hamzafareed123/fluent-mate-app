import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { typography } from '@/constants/theme';
import { signInWithEmail } from '@/lib/auth';
import { signInSchema, type SignInValues } from '@/lib/validation';
import { useTheme } from '@/providers/ThemeProvider';

export default function SignInScreen() {
  const { colors } = useTheme();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await signInWithEmail(values.email, values.password);
      router.replace('/');
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Sign in failed');
    }
  });

  return (
    <Screen>
      <Text style={[styles.title, { color: colors.text }]}>Welcome back</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            error={errors.password?.message}
          />
        )}
      />
      {formError ? <Text style={{ color: colors.error }}>{formError}</Text> : null}
      <Button label="Sign in" onPress={() => void onSubmit()} loading={isSubmitting} />
      <Link href="/(auth)/forgot-password" style={{ color: colors.aiBlue, textAlign: 'center' }}>
        Forgot password?
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1 },
});
