import { corsHeaders } from '../_shared/cors.ts';
import { requireUser } from '../_shared/auth.ts';
import { groqChat } from '../_shared/groq.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    await requireUser(req);
    const { words, learnerLevel } = await req.json();

    const content = await groqChat({
      responseFormat: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Generate vocabulary review cards as JSON: { items: [{ word, definition, example_sentence, usage_note }] }',
        },
        { role: 'user', content: JSON.stringify({ words, learnerLevel }) },
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
