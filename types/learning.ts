import { z } from 'zod';
import type { ActivityType } from '@/types/database';

const activityTypes = [
  'speaking_conversation', 'vocabulary_review', 'grammar_correction', 'sentence_building',
  'listening_comprehension', 'pronunciation_practice', 'role_play', 'storytelling',
  'interview_simulation', 'daily_reflection',
] as const satisfies readonly ActivityType[];

export const milestoneSchema = z.object({
  title: z.string(),
  description: z.string(),
  learning_objective: z.string(),
  estimated_minutes: z.number().int().positive(),
  activity_type: z.enum(activityTypes),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  completion_criteria: z.string(),
  xp_reward: z.number().int().positive(),
});

export const dailyPlanSchema = z.object({
  summary: z.string(),
  milestones: z.array(milestoneSchema).min(1),
});

export type DailyPlanPayload = z.infer<typeof dailyPlanSchema>;

export type MilestoneView = {
  id: string;
  title: string;
  description: string | null;
  activity_type: ActivityType;
  difficulty: string;
  estimated_minutes: number;
  completion_criteria: string | null;
  xp_reward: number;
  status: string;
};
