// Generate random alphanumeric string for email prefixes
export function generateRandomEmailPrefix(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  for (let i = 0; i < 12; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

// Generate UUID v4
export function generateUUID(): string {
  return crypto.randomUUID();
}

// Generate secure token
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Get current timestamp in seconds
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

// Calculate expiration timestamp based on TTL days
export function calculateExpirationTimestamp(ttlDays: number): number {
  return getCurrentTimestamp() + (ttlDays * 24 * 60 * 60);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

// Validate email prefix (username part)
export function isValidEmailPrefix(prefix: string): boolean {
  // Allow alphanumeric, dots, hyphens, underscores
  const prefixRegex = /^[a-zA-Z0-9._-]{1,64}$/;
  return prefixRegex.test(prefix);
}

// Format email response (remove sensitive data)
export function formatEmailForResponse(email: any) {
  return {
    id: email.id,
    from_address: email.from_address,
    to_address: email.to_address,
    subject: email.subject,
    text_body: email.body_text,
    html_body: email.body_html,
    received_at: email.received_at,
    expires_at: email.expires_at,
    is_read: email.is_read || 0,
  };
}

// Format user response (remove sensitive data)
export function formatUserForResponse(user: any) {
  return {
    id: user.id,
    is_admin: user.is_admin,
    is_banned: user.is_banned,
    created_at: user.created_at,
  };
}
