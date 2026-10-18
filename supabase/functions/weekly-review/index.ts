import { corsHeaders } from '../_shared/cors.ts';
import { requireUser } from '../_shared/auth.ts';
import { groqChat } from '../_shared/groq.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    await requireUser(req);
    const payload = await req.json();

    const content = await groqChat({
      responseFormat: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Summarize weekly English learning progress as JSON with improved, still_difficult, repeated_errors, vocabulary, next_week_focus.',
        },
        { role: 'user', content: JSON.stringify(payload) },
      ],
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
