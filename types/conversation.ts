import { z } from 'zod';

export const correctionSchema = z
  .object({
    original: z.string(),
    improved: z.string(),
    why: z.string(),
    natural_alternative: z.string().optional(),
  })
  .optional();

export const conversationTurnResponseSchema = z.object({
  reply: z.string().min(1),
  correction: correctionSchema,
  session_notes: z.string().optional(),
  suggested_follow_up: z.string().optional(),
});

export type ConversationTurnResponse = z.infer<typeof conversationTurnResponseSchema>;

export type ConversationMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  correction?: z.infer<typeof correctionSchema>;
};
