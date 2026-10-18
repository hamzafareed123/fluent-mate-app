import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = signInSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});

export const onboardingSchema = z.object({
  display_name: z.string().min(1, 'What should we call you?').max(60),
  primary_goal: z.enum([
    'everyday_conversation',
    'job_interviews',
    'professional',
    'studying_abroad',
    'presentations',
    'general_fluency',
  ]),
  daily_goal_minutes: z.union([
    z.literal(5),
    z.literal(10),
    z.literal(15),
    z.literal(20),
    z.literal(30),
  ]),
  self_reported_level: z.enum([
    'beginner',
    'elementary',
    'intermediate',
    'upper_intermediate',
    'advanced',
  ]),
  main_difficulty: z.enum([
    'speaking_confidence',
    'grammar',
    'vocabulary',
    'pronunciation',
    'listening',
    'forming_sentences',
  ]),
  correction_preference: z.enum(['gentle', 'direct']),
  preferred_accent: z.string().optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type OnboardingValues = z.infer<typeof onboardingSchema>;
