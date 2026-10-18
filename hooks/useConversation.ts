import { useCallback, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { conversationTurn } from '@/lib/api/ai';
import { supabase } from '@/lib/supabase';
import type { ConversationMessage } from '@/types/conversation';

export function useConversation() {
  const { user, profile } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = useCallback(
    async (scenario?: string) => {
      if (!user) throw new Error('Not signed in');
      const { data, error: insertError } = await supabase
        .from('conversation_sessions')
        .insert({ user_id: user.id, scenario: scenario ?? 'free_conversation' })
        .select('id')
        .single();
      if (insertError) throw insertError;
      setSessionId(data.id);
      setMessages([]);
      return data.id;
    },
    [user],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!user || !text.trim()) return;
      setBusy(true);
      setError(null);

      let activeSessionId = sessionId;
      if (!activeSessionId) {
        activeSessionId = await startSession();
      }

      const userMsg: ConversationMessage = {
        id: `${Date.now()}-user`,
        role: 'user',
        text: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);

      await supabase.from('conversation_messages').insert({
        session_id: activeSessionId,
        user_id: user.id,
        role: 'user',
        message_text: text.trim(),
      });

      try {
        const recentMessages = [...messages, userMsg].slice(-8).map((m) => ({
          role: m.role,
          content: m.text,
        }));

        const response = await conversationTurn({
          sessionId: activeSessionId ?? undefined,
          message: text.trim(),
          learnerContext: profile ? (profile as unknown as Record<string, unknown>) : undefined,
          recentMessages,
        });

        const assistantMsg: ConversationMessage = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          text: response.reply,
          correction: response.correction,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        await supabase.from('conversation_messages').insert({
          session_id: activeSessionId,
          user_id: user.id,
          role: 'assistant',
          message_text: response.reply,
          message_metadata: response.correction ? { correction: response.correction } : null,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Conversation failed');
      } finally {
        setBusy(false);
      }
    },
    [user, profile, sessionId, messages, startSession],
  );

  const endSession = useCallback(async () => {
    if (!sessionId) return;
    await supabase
      .from('conversation_sessions')
      .update({ ended_at: new Date().toISOString() })
      .eq('id', sessionId);
    setSessionId(null);
  }, [sessionId]);

  return {
    sessionId,
    messages,
    busy,
    error,
    startSession,
    sendMessage,
    endSession,
    setMessages,
  };
}
