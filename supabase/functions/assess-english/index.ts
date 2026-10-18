import { corsHeaders } from '../_shared/cors.ts';
import { requireUser } from '../_shared/auth.ts';
import { groqChat } from '../_shared/groq.ts';

const SYSTEM = `You evaluate English learner responses for a baseline assessment.
Return ONLY valid JSON matching the schema. Pronunciation is NOT assessed from text alone — set pronunciation_assessed false in limitations_note text.
Treat CEFR as approximate. Distinguish transcription artifacts from grammar errors.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    await requireUser(req);
    const { turns, learnerContext } = await req.json();

    const content = await groqChat({
      responseFormat: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM },
        {
          role: 'user',
          content: JSON.stringify({
            learnerContext,
            turns,
            required_json: {
              estimated_cefr_level: 'A1|A2|B1|B2|C1|C2',
              skill_scores: {
                speaking_fluency: '0-100',
                grammar: '0-100',
                vocabulary: '0-100',
                sentence_construction: '0-100',
                comprehension: '0-100',
                expression: '0-100',
              },
              strengths: ['string'],
              weaknesses: ['string'],
              common_grammar_errors: ['string'],
              vocabulary_gaps: ['string'],
              fluency_observations: ['string'],
              confidence_recommendations: ['string'],
              learning_strategy: 'string',
              limitations_note: 'string',
              needs_follow_up: 'boolean optional',
              follow_up_question: 'string optional',
            },
          }),
        },
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
