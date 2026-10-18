export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials')) {
    return 'That email or password is incorrect. Please try again.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Please verify your email before signing in. Check your inbox.';
  }
  if (lower.includes('user already registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (lower.includes('network')) {
    return 'Network error. Check your connection and try again.';
  }
  return message;
}

export function friendlyApiError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Failed to fetch')) {
      return 'Could not reach the server. Check your connection or Supabase configuration.';
    }
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
