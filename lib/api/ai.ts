import { invokeEdgeFunction } from '@/lib/api/edge';
import type { AssessmentReport } from '@/types/assessment';
import type { AssessmentTurn } from '@/types/assessment';
import type { ConversationTurnResponse } from '@/types/conversation';
import type { DailyPlanPayload } from '@/types/learning';

export async function assessEnglish(payload: {
  turns: AssessmentTurn[];
  learnerContext?: Record<string, unknown>;
}): Promise<AssessmentReport> {
  return invokeEdgeFunction<AssessmentReport>('assess-english', { body: payload });
}

export async function generateDailyPlan(payload: {
  assessment: AssessmentReport;
  profile: Record<string, unknown>;
  planDate: string;
}): Promise<DailyPlanPayload> {
  return invokeEdgeFunction<DailyPlanPayload>('generate-daily-plan', { body: payload });
}

export async function conversationTurn(payload: {
  sessionId?: string;
  message: string;
  learnerContext?: Record<string, unknown>;
  recentMessages?: { role: string; content: string }[];
}): Promise<ConversationTurnResponse & { sessionId?: string }> {
  return invokeEdgeFunction('conversation-turn', { body: payload });
}

export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<{ text: string }> {
  return invokeEdgeFunction('analyse-speaking', {
    body: { audioBase64: base64Audio, mimeType, mode: 'transcribe' },
  });
}

export async function weeklyReview(payload: Record<string, unknown>) {
  return invokeEdgeFunction('weekly-review', { body: payload });
}
