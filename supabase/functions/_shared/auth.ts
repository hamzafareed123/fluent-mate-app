import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

export async function requireUser(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Missing Authorization header');
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error('Unauthorized');
  }

  return { user: data.user, supabase };
}
