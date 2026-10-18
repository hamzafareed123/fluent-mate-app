const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export function getGroqConfig() {
  const apiKey = Deno.env.get('GROQ_API_KEY');
  const model = Deno.env.get('GROQ_CHAT_MODEL') ?? 'llama-3.3-70b-versatile';
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  return { apiKey, model };
}

export async function groqChat(params: {
  messages: { role: string; content: string }[];
  temperature?: number;
  responseFormat?: { type: 'json_object' };
}): Promise<string> {
  const { apiKey, model } = getGroqConfig();

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: params.temperature ?? 0.4,
      response_format: params.responseFormat,
      messages: params.messages,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq error (${response.status}): ${text.slice(0, 300)}`);
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('Empty Groq response');
  }
  return content;
}

export async function groqTranscribe(audioBytes: Uint8Array, mimeType: string): Promise<string> {
  const apiKey = Deno.env.get('GROQ_API_KEY');
  const model = Deno.env.get('GROQ_STT_MODEL') ?? 'whisper-large-v3-turbo';
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

  const form = new FormData();
  const blob = new Blob([audioBytes], { type: mimeType });
  form.append('file', blob, 'recording.m4a');
  form.append('model', model);
  form.append('language', 'en');

  const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq STT error (${response.status}): ${text.slice(0, 300)}`);
  }

  const json = await response.json();
  return json.text ?? '';
}
