import { supabase } from '@/lib/supabase';

type EdgeInvokeOptions = {
  body?: Record<string, unknown>;
};

export async function invokeEdgeFunction<T>(
  name: string,
  options: EdgeInvokeOptions = {},
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, {
    body: options.body ?? {},
  });

  if (error) {
    throw new Error(error.message ?? `Edge function "${name}" failed`);
  }

  if (data && typeof data === 'object' && 'error' in data && data.error) {
    throw new Error(String((data as { error: string }).error));
  }

  return data as T;
}
