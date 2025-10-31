import { Hono } from 'hono';
import { Env, Variables } from '../types';
import { formatEmailForResponse, generateUUID, getCurrentTimestamp } from '../utils';
import { requireAuth } from '../middleware';

export const emailRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Get all emails for a specific email address
emailRoutes.get('/address/:addressId', requireAuth, async (c) => {
  const user = c.get('user');
  const addressId = c.req.param('addressId');

  try {
    // Verify ownership
    const address = await c.env.DB.prepare(
      'SELECT id FROM email_addresses WHERE id = ? AND user_id = ?'
    ).bind(addressId, user.id).first();

    if (!address) {
      return c.json({ error: 'Email address not found or unauthorized' }, 404);
    }

    // Get emails
    const emails = await c.env.DB.prepare(
      `SELECT id, from_address, to_address, subject, received_at, expires_at 
       FROM emails WHERE address_id = ? ORDER BY received_at DESC LIMIT 100`
    ).bind(addressId).all();

    return c.json({ emails: emails.results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch emails' }, 500);
  }
});

// Get a specific email by ID
emailRoutes.get('/:emailId', requireAuth, async (c) => {
  const user = c.get('user');
  const emailId = c.req.param('emailId');

  try {
    // Get email with ownership verification
    const email = await c.env.DB.prepare(
      `SELECT e.* FROM emails e
       INNER JOIN email_addresses ea ON e.address_id = ea.id
       WHERE e.id = ? AND ea.user_id = ?`
    ).bind(emailId, user.id).first();

    if (!email) {
      return c.json({ error: 'Email not found' }, 404);
    }

    return c.json({ email: formatEmailForResponse(email) });
  } catch (error) {
    return c.json({ error: 'Failed to fetch email' }, 500);
  }
});

// Delete an email
emailRoutes.delete('/:emailId', requireAuth, async (c) => {
  const user = c.get('user');
  const emailId = c.req.param('emailId');

  try {
    // Verify ownership
    const email = await c.env.DB.prepare(
      `SELECT e.id FROM emails e
       INNER JOIN email_addresses ea ON e.address_id = ea.id
       WHERE e.id = ? AND ea.user_id = ?`
    ).bind(emailId, user.id).first();

    if (!email) {
      return c.json({ error: 'Email not found' }, 404);
    }

    await c.env.DB.prepare('DELETE FROM emails WHERE id = ?').bind(emailId).run();

    return c.json({ success: true, message: 'Email deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete email' }, 500);
  }
});

// Request permission to send emails from an address
emailRoutes.post('/address/:addressId/request-send', requireAuth, async (c) => {
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

    // Check if request already exists
    const existing = await c.env.DB.prepare(
      'SELECT id, status FROM send_permissions WHERE address_id = ?'
    ).bind(addressId).first();

    if (existing) {
      return c.json({ 
        message: 'Request already exists', 
        status: (existing as any).status 
      });
    }

    // Create permission request
    const permissionId = generateUUID();
    const now = getCurrentTimestamp();

    await c.env.DB.prepare(
      'INSERT INTO send_permissions (id, address_id, status, requested_at) VALUES (?, ?, ?, ?)'
    ).bind(permissionId, addressId, 'pending', now).run();

    return c.json({
      success: true,
      permission: {
        id: permissionId,
        status: 'pending',
        requested_at: now,
      },
    });
  } catch (error) {
    return c.json({ error: 'Failed to request send permission' }, 500);
  }
});

// Send an email (requires approved permission)
emailRoutes.post('/send', requireAuth, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { from, to, subject, text, html } = body;

  try {
    // Verify from address ownership
    const address = await c.env.DB.prepare(
      'SELECT id FROM email_addresses WHERE address = ? AND user_id = ?'
    ).bind(from, user.id).first();

    if (!address) {
      return c.json({ error: 'From address not found or unauthorized' }, 404);
    }

    // Check send permission
    const permission = await c.env.DB.prepare(
      'SELECT status FROM send_permissions WHERE address_id = ? AND status = ?'
    ).bind((address as any).id, 'approved').first();

    if (!permission) {
      return c.json({ error: 'Send permission not approved for this address' }, 403);
    }

    // Send email using Cloudflare's email sending
    // Note: This requires the send_email binding to be properly configured
    try {
      await c.env.SEND_EMAIL.send({
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html,
      });

      return c.json({ success: true, message: 'Email sent' });
    } catch (sendError) {
      return c.json({ error: 'Failed to send email' }, 500);
    }
  } catch (error) {
    return c.json({ error: 'Failed to process send request' }, 500);
  }
});
