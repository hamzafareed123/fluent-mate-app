import { corsHeaders } from '../_shared/cors.ts';
import { requireUser } from '../_shared/auth.ts';
import { groqChat } from '../_shared/groq.ts';

const TUTOR_PROMPT = Deno.env.get('FLUENTMATE_SYSTEM_PROMPT') ??
  `You are FluentMate, a warm English-speaking coach. Ask one question at a time. Correct meaningfully when needed.
Return JSON: { "reply": string, "correction": optional { original, improved, why, natural_alternative? }, "session_notes": optional string }`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    await requireUser(req);
    const { message, learnerContext, recentMessages } = await req.json();

    const content = await groqChat({
      responseFormat: { type: 'json_object' },
      messages: [
        { role: 'system', content: TUTOR_PROMPT },
        {
          role: 'user',
          content: JSON.stringify({ learnerContext, recentMessages, message }),
        },
      ],
      temperature: 0.6,
    });

    return new Response(content, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
