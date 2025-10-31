import { Hono } from 'hono';
import { Env, Variables } from '../types';
import { generateToken, generateUUID, getCurrentTimestamp, formatUserForResponse } from '../utils';
import { requireAuth } from '../middleware';

export const userRoutes = new Hono<{ Bindings: Env; Variables: Variables }>();

// Register a new user
userRoutes.post('/register', async (c) => {
  try {
    const userId = generateUUID();
    const token = generateToken();
    const now = getCurrentTimestamp();

    await c.env.DB.prepare(
      'INSERT INTO users (id, token, is_admin, is_banned, created_at, updated_at) VALUES (?, ?, 0, 0, ?, ?)'
    ).bind(userId, token, now, now).run();

    return c.json({
      success: true,
      user: {
        id: userId,
        token: token,
        is_admin: false,
        created_at: now,
      },
    });
  } catch (error) {
    return c.json({ error: 'Failed to register user' }, 500);
  }
});

// Get current user info
userRoutes.get('/me', requireAuth, async (c) => {
  const user = c.get('user');
  return c.json(formatUserForResponse(user));
});

// Delete current user account
userRoutes.delete('/me', requireAuth, async (c) => {
  const user = c.get('user');

  try {
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(user.id).run();
    return c.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    return c.json({ error: 'Failed to delete account' }, 500);
  }
});
