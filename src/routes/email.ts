import { Hono } from 'hono';
import { Env, Variables } from '../types';
import { formatEmailForResponse, generateUUID, getCurrentTimestamp } from '../utils';
import { requireAuth } from '../middleware';

export const emailRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Get all emails for the current user (across all addresses)
emailRoutes.get('/', requireAuth, async (c) => {
  const user = c.get('user');
  const addressId = c.req.query('address_id');

  try {
    let query;
    let params;

    if (addressId) {
      // Verify ownership of the specific address
      const address = await c.env.DB.prepare(
        'SELECT id FROM email_addresses WHERE id = ? AND user_id = ?'
      ).bind(addressId, user.id).first();

      if (!address) {
        return c.json({ error: 'Email address not found or unauthorized' }, 404);
      }

      query = `SELECT e.id, e.from_address, e.to_address, e.subject, e.received_at, e.expires_at, e.is_read
               FROM emails e
               WHERE e.address_id = ? ORDER BY e.received_at DESC LIMIT 100`;
      params = [addressId];
    } else {
      // Get all emails for all user's addresses
      query = `SELECT e.id, e.from_address, e.to_address, e.subject, e.received_at, e.expires_at, e.is_read
               FROM emails e
               INNER JOIN email_addresses ea ON e.address_id = ea.id
               WHERE ea.user_id = ? ORDER BY e.received_at DESC LIMIT 100`;
      params = [user.id];
    }

    const emails = await c.env.DB.prepare(query).bind(...params).all();

    return c.json({ emails: emails.results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch emails' }, 500);
  }
});

// Get all emails for a specific email address (Legacy/Specific route)
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
      `SELECT id, from_address, to_address, subject, received_at, expires_at, is_read
       FROM emails WHERE address_id = ? ORDER BY received_at DESC LIMIT 100`
    ).bind(addressId).all();

    // Get send permission status
    const permission = await c.env.DB.prepare(
      'SELECT status FROM send_permissions WHERE address_id = ?'
    ).bind(addressId).first();

    return c.json({
      emails: emails.results,
      send_permission_status: permission ? (permission as any).status : null
    });
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

// Mark an email as read
emailRoutes.post('/:emailId/mark-read', requireAuth, async (c) => {
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

    // Mark as read
    const now = getCurrentTimestamp();
    await c.env.DB.prepare(
      'UPDATE emails SET is_read = 1, read_at = ? WHERE id = ?'
    ).bind(now, emailId).run();

    return c.json({ success: true, message: 'Email marked as read' });
  } catch (error) {
    return c.json({ error: 'Failed to mark email as read' }, 500);
  }
});

// Mark an email as unread
emailRoutes.post('/:emailId/mark-unread', requireAuth, async (c) => {
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

    // Mark as unread
    await c.env.DB.prepare(
      'UPDATE emails SET is_read = 0, read_at = NULL WHERE id = ?'
    ).bind(emailId).run();

    return c.json({ success: true, message: 'Email marked as unread' });
  } catch (error) {
    return c.json({ error: 'Failed to mark email as unread' }, 500);
  }
});
