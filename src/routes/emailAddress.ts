import { Hono } from 'hono';
import { Env, Variables } from '../types';
import {
  generateUUID,
  getCurrentTimestamp,
  generateRandomEmailPrefix,
  isValidEmailPrefix,
} from '../utils';
import { requireAuth } from '../middleware';

export const emailAddressRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Create a new email address
emailAddressRoutes.post('/', requireAuth, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { prefix } = body;

  try {
    // Get domain from settings
    const domainSetting = await c.env.DB.prepare('SELECT value FROM settings WHERE key = ?')
      .bind('domain')
      .first<{ value: string }>();

    const domain = domainSetting?.value || 'your-domain.com';

    // Generate or validate prefix
    let emailPrefix: string;
    if (prefix) {
      if (!isValidEmailPrefix(prefix)) {
        return c.json({ error: 'Invalid email prefix format' }, 400);
      }
      emailPrefix = prefix.toLowerCase();
    } else {
      emailPrefix = generateRandomEmailPrefix();
    }

    const emailAddress = `${emailPrefix}@${domain}`;

    // Check if address already exists
    const existing = await c.env.DB.prepare(
      'SELECT id FROM email_addresses WHERE address = ?'
    ).bind(emailAddress).first();

    if (existing) {
      return c.json({ error: 'Email address already exists' }, 409);
    }

    // Create the email address
    const addressId = generateUUID();
    const now = getCurrentTimestamp();

    await c.env.DB.prepare(
      'INSERT INTO email_addresses (id, user_id, address, created_at) VALUES (?, ?, ?, ?)'
    ).bind(addressId, user.id, emailAddress, now).run();

    return c.json({
      success: true,
      address: {
        id: addressId,
        address: emailAddress,
        created_at: now,
      },
    });
  } catch (error) {
    return c.json({ error: 'Failed to create email address' }, 500);
  }
});

// Get all email addresses for current user
emailAddressRoutes.get('/', requireAuth, async (c) => {
  const user = c.get('user');

  try {
    const addresses = await c.env.DB.prepare(
      'SELECT id, address, created_at FROM email_addresses WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(user.id).all();

    return c.json({ addresses: addresses.results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch email addresses' }, 500);
  }
});

// Delete an email address
emailAddressRoutes.delete('/:addressId', requireAuth, async (c) => {
  const user = c.get('user');
  const addressId = c.req.param('addressId');

  try {
    // Verify ownership
    const address = await c.env.DB.prepare(
      'SELECT id FROM email_addresses WHERE id = ? AND user_id = ?'
    ).bind(addressId, user.id).first();

    if (!address) {
      return c.json({ error: 'Email address not found' }, 404);
    }

    await c.env.DB.prepare('DELETE FROM email_addresses WHERE id = ?').bind(addressId).run();

    return c.json({ success: true, message: 'Email address deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete email address' }, 500);
  }
});
