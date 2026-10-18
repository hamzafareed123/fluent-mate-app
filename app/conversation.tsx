import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Screen } from '@/components/ui/Screen';
import { useConversation } from '@/hooks/useConversation';
import { useTheme } from '@/providers/ThemeProvider';

export default function ConversationScreen() {
  const { colors } = useTheme();
  const { messages, busy, error, sendMessage, endSession } = useConversation();
  const [draft, setDraft] = useState('');

  const send = async () => {
    const message = draft.trim();
    if (!message || busy) return;
    setDraft('');
    await sendMessage(message);
  };

  return (
    <Screen>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700' }}>Your AI conversation</Text>
      <Text style={{ color: colors.textMuted }}>Write naturally. Your coach will reply with one helpful next step.</Text>
      {messages.length === 0 ? <Text style={{ color: colors.aiBlue, fontSize: 17 }}>Hi! What did you do today?</Text> : null}
      {messages.map((message) => (
        <View key={message.id} style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 14 }}>
          <Text style={{ color: colors.text, fontWeight: '600' }}>{message.role === 'assistant' ? 'FluentMate' : 'You'}</Text>
          <Text style={{ color: colors.text, marginTop: 5 }}>{message.text}</Text>
          {message.correction ? <Text style={{ color: colors.textMuted, marginTop: 8 }}>Try: {message.correction.improved}{'\n'}{message.correction.why}</Text> : null}
        </View>
      ))}
      <Input label="Your message" value={draft} onChangeText={setDraft} onSubmitEditing={() => void send()} returnKeyType="send" />
      {error ? <Text accessibilityRole="alert" style={{ color: colors.error }}>{error}</Text> : null}
      <Button label="Send" onPress={() => void send()} loading={busy} variant="ai" />
      <Button label="End conversation" onPress={() => void endSession()} variant="secondary" />
    </Screen>
  );
}
