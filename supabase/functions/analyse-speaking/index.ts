import { decode } from 'https://deno.land/std@0.224.0/encoding/base64.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { requireUser } from '../_shared/auth.ts';
import { groqTranscribe } from '../_shared/groq.ts';

const MAX_BYTES = 8 * 1024 * 1024;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    await requireUser(req);
    const { audioBase64, mimeType = 'audio/m4a' } = await req.json();
    if (!audioBase64 || typeof audioBase64 !== 'string') {
      throw new Error('audioBase64 is required');
    }

    const bytes = decode(audioBase64);
    if (bytes.byteLength > MAX_BYTES) {
      throw new Error('Audio file too large');
    }

    const text = await groqTranscribe(bytes, mimeType);
    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
