const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'anime-netflix-jwt-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: '邮箱和密码不能为空' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: '密码长度至少6位' });
    }

    const existing = await db('users').where({ email }).first();
    if (existing) {
      return res.status(409).json({ error: 'EMAIL_EXISTS', message: '该邮箱已注册' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [id] = await db('users').insert({
      email,
      password_hash: passwordHash,
      nickname: nickname || email.split('@')[0],
      role: 'user',
      status: 'active',
    });

    const token = jwt.sign(
      { userId: id, email, role: 'user' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      token,
      user: { id, nickname: nickname || email.split('@')[0], email, role: 'user', avatar_url: null },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim();
    const password = req.body.password || '';

    if (!email || !password) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: '邮箱和密码不能为空' });
    }

    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'AUTH_FAILED', message: '邮箱或密码错误' });
    }

    if (user.status === 'disabled') {
      return res.status(403).json({ error: 'ACCOUNT_DISABLED', message: '账户已被禁用' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'AUTH_FAILED', message: '邮箱或密码错误' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
