import { Hono } from 'hono';
import { Env, Variables } from '../types';
import { getCurrentTimestamp, formatUserForResponse } from '../utils';
import { requireAdmin } from '../middleware';

export const adminRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Get all users
adminRoutes.get('/users', requireAdmin, async (c) => {
  try {
    const users = await c.env.DB.prepare(
      'SELECT id, is_admin, is_banned, created_at FROM users ORDER BY created_at DESC'
    ).all();

    return c.json({ users: users.results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Ban a user
adminRoutes.post('/users/:userId/ban', requireAdmin, async (c) => {
  const userId = c.req.param('userId');
  const now = getCurrentTimestamp();

  try {
    await c.env.DB.prepare(
      'UPDATE users SET is_banned = 1, updated_at = ? WHERE id = ?'
    ).bind(now, userId).run();

    return c.json({ success: true, message: 'User banned' });
  } catch (error) {
    return c.json({ error: 'Failed to ban user' }, 500);
  }
});

// Unban a user
adminRoutes.post('/users/:userId/unban', requireAdmin, async (c) => {
  const userId = c.req.param('userId');
  const now = getCurrentTimestamp();

  try {
    await c.env.DB.prepare(
      'UPDATE users SET is_banned = 0, updated_at = ? WHERE id = ?'
    ).bind(now, userId).run();

    return c.json({ success: true, message: 'User unbanned' });
  } catch (error) {
    return c.json({ error: 'Failed to unban user' }, 500);
  }
});

// Delete a user
adminRoutes.delete('/users/:userId', requireAdmin, async (c) => {
  const userId = c.req.param('userId');

  try {
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(userId).run();
    return c.json({ success: true, message: 'User deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Get all emails (admin view)
adminRoutes.get('/emails', requireAdmin, async (c) => {
  const limit = parseInt(c.req.query('limit') || '100');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    const emails = await c.env.DB.prepare(
      `SELECT e.id, e.from_address, e.to_address, e.subject, e.received_at, ea.user_id
       FROM emails e
       INNER JOIN email_addresses ea ON e.address_id = ea.id
       ORDER BY e.received_at DESC
       LIMIT ? OFFSET ?`
    ).bind(limit, offset).all();

    return c.json({ emails: emails.results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch emails' }, 500);
  }
});

// Get all email addresses
adminRoutes.get('/addresses', requireAdmin, async (c) => {
  try {
    const addresses = await c.env.DB.prepare(
      'SELECT id, user_id, address, created_at FROM email_addresses ORDER BY created_at DESC'
    ).all();

    return c.json({ addresses: addresses.results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch email addresses' }, 500);
  }
});

// Get email TTL setting
adminRoutes.get('/settings/ttl', requireAdmin, async (c) => {
  try {
    const setting = await c.env.DB.prepare(
      'SELECT value FROM settings WHERE key = ?'
    ).bind('email_ttl_days').first<{ value: string }>();

    return c.json({ ttl_days: setting?.value || '30' });
  } catch (error) {
    return c.json({ error: 'Failed to fetch TTL setting' }, 500);
  }
});

// Update email TTL setting
adminRoutes.put('/settings/ttl', requireAdmin, async (c) => {
  const body = await c.req.json();
  const { ttl_days } = body;

  if (!ttl_days || isNaN(parseInt(ttl_days))) {
    return c.json({ error: 'Invalid TTL value' }, 400);
  }

  try {
    const now = getCurrentTimestamp();
    await c.env.DB.prepare(
      'UPDATE settings SET value = ?, updated_at = ? WHERE key = ?'
    ).bind(ttl_days.toString(), now, 'email_ttl_days').run();

    return c.json({ success: true, ttl_days: ttl_days });
  } catch (error) {
    return c.json({ error: 'Failed to update TTL setting' }, 500);
  }
});

// Get domain setting
adminRoutes.get('/settings/domain', requireAdmin, async (c) => {
  try {
    const setting = await c.env.DB.prepare(
      'SELECT value FROM settings WHERE key = ?'
    ).bind('domain').first<{ value: string }>();

    return c.json({ domain: setting?.value || 'your-domain.com' });
  } catch (error) {
    return c.json({ error: 'Failed to fetch domain setting' }, 500);
  }
});

// Update domain setting
adminRoutes.put('/settings/domain', requireAdmin, async (c) => {
  const body = await c.req.json();
  const { domain } = body;

  if (!domain) {
    return c.json({ error: 'Domain is required' }, 400);
  }

  try {
    const now = getCurrentTimestamp();
    await c.env.DB.prepare(
      'UPDATE settings SET value = ?, updated_at = ? WHERE key = ?'
    ).bind(domain, now, 'domain').run();

    return c.json({ success: true, domain: domain });
  } catch (error) {
    return c.json({ error: 'Failed to update domain setting' }, 500);
  }
});

// Get pending send permission requests
adminRoutes.get('/permissions/pending', requireAdmin, async (c) => {
  try {
    const permissions = await c.env.DB.prepare(
      `SELECT sp.id, sp.address_id, sp.status, sp.requested_at, ea.address, ea.user_id
       FROM send_permissions sp
       INNER JOIN email_addresses ea ON sp.address_id = ea.id
       WHERE sp.status = 'pending'
       ORDER BY sp.requested_at DESC`
    ).all();

    return c.json({ permissions: permissions.results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch pending permissions' }, 500);
  }
});

// Approve send permission
adminRoutes.post('/permissions/:permissionId/approve', requireAdmin, async (c) => {
  const permissionId = c.req.param('permissionId');
  const admin = c.get('user');
  const now = getCurrentTimestamp();

  try {
    await c.env.DB.prepare(
      'UPDATE send_permissions SET status = ?, reviewed_at = ?, reviewed_by = ? WHERE id = ?'
    ).bind('approved', now, admin.id, permissionId).run();

    return c.json({ success: true, message: 'Permission approved' });
  } catch (error) {
    return c.json({ error: 'Failed to approve permission' }, 500);
  }
});

// Reject send permission
adminRoutes.post('/permissions/:permissionId/reject', requireAdmin, async (c) => {
  const permissionId = c.req.param('permissionId');
  const admin = c.get('user');
  const now = getCurrentTimestamp();

  try {
    await c.env.DB.prepare(
      'UPDATE send_permissions SET status = ?, reviewed_at = ?, reviewed_by = ? WHERE id = ?'
    ).bind('rejected', now, admin.id, permissionId).run();

    return c.json({ success: true, message: 'Permission rejected' });
  } catch (error) {
    return c.json({ error: 'Failed to reject permission' }, 500);
  }
});

// Get system statistics
adminRoutes.get('/stats', requireAdmin, async (c) => {
  try {
    const userCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first();
    const addressCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM email_addresses').first();
    const emailCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM emails').first();
    const pendingPermissions = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM send_permissions WHERE status = 'pending'"
    ).first();

    return c.json({
      users: (userCount as any)?.count || 0,
      addresses: (addressCount as any)?.count || 0,
      emails: (emailCount as any)?.count || 0,
      pending_permissions: (pendingPermissions as any)?.count || 0,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});
