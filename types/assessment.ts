import { z } from 'zod';

export const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const skillScoresSchema = z.object({
  speaking_fluency: z.number().min(0).max(100),
  grammar: z.number().min(0).max(100),
  vocabulary: z.number().min(0).max(100),
  sentence_construction: z.number().min(0).max(100),
  comprehension: z.number().min(0).max(100),
  expression: z.number().min(0).max(100),
});

export const assessmentReportSchema = z.object({
  estimated_cefr_level: z.enum(cefrLevels),
  skill_scores: skillScoresSchema,
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()).min(1),
  common_grammar_errors: z.array(z.string()),
  vocabulary_gaps: z.array(z.string()),
  fluency_observations: z.array(z.string()),
  confidence_recommendations: z.array(z.string()),
  learning_strategy: z.string(),
  limitations_note: z.string(),
  needs_follow_up: z.boolean().optional(),
  follow_up_question: z.string().optional(),
});

export type AssessmentReport = z.infer<typeof assessmentReportSchema>;
export type SkillScores = z.infer<typeof skillScoresSchema>;

export type AssessmentStage = 'warmup' | 'everyday' | 'describe' | 'practical';

export type AssessmentTurn = {
  stage: AssessmentStage;
  question: string;
  answer: string;
  answeredAt: string;
  inputMode: 'voice' | 'text';
};
