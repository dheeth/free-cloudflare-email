import PostalMime from 'postal-mime';
import { Env } from './types';
import { generateUUID, getCurrentTimestamp, calculateExpirationTimestamp } from './utils';

async function streamToBuffer(stream: ReadableStream): Promise<Uint8Array> {
  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  let length = 0;
  for (const chunk of chunks) length += chunk.length;
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export async function handleIncomingEmail(context: any): Promise<void> {
  const { env, message } = context;
  const db = env.DB as D1Database;

  try {
    // Read the raw email stream into a buffer
    const rawBuffer = await streamToBuffer(message.raw);
    const parser = new PostalMime();
    const email = await parser.parse(rawBuffer);

    const toAddress = message.to.toLowerCase();
    const fromAddress = message.from.toLowerCase();

    // Check if the email address exists in our system
    const addressRecord = await db
      .prepare('SELECT id FROM email_addresses WHERE address = ?')
      .bind(toAddress)
      .first();

    if (!addressRecord) {
      console.log(`Email address not found: ${toAddress}`);
      return;
    }

    // Get TTL setting
    const ttlSetting = await db
      .prepare('SELECT value FROM settings WHERE key = ?')
      .bind('email_ttl_days')
      .first<{ value: string }>();

    const ttlDays = ttlSetting ? parseInt(ttlSetting.value) : 30;
    const expiresAt = calculateExpirationTimestamp(ttlDays);

    // Store the email
    const emailId = generateUUID();
    await db
      .prepare(
        `INSERT INTO emails (
          id, address_id, from_address, to_address, subject, 
          body_text, body_html, headers, raw_email, received_at, expires_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        emailId,
        addressRecord.id,
        fromAddress,
        toAddress,
        email.subject || '',
        email.text || '',
        email.html || '',
        JSON.stringify(email.headers),
        rawBuffer,
        getCurrentTimestamp(),
        expiresAt
      )
      .run();

    console.log(`Email stored: ${emailId}`);
  } catch (error) {
    console.error('Error handling incoming email:', error);
    throw error;
  }
}

// Cleanup expired emails (can be called via cron trigger)
export async function cleanupExpiredEmails(env: Env): Promise<number> {
  const db = env.DB;
  const now = getCurrentTimestamp();

  try {
    const result = await db
      .prepare('DELETE FROM emails WHERE expires_at IS NOT NULL AND expires_at < ?')
      .bind(now)
      .run();

    return result.meta.changes;
  } catch (error) {
    console.error('Error cleaning up expired emails:', error);
    return 0;
  }
}
