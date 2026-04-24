const { Router } = require('express');
const db = require('../db/connection');
const { authenticate } = require('../middleware/auth');

const router = Router();

// GET /api/user/profile
router.get('/user/profile', authenticate, async (req, res, next) => {
  try {
    const user = await db('users')
      .select('id', 'email', 'nickname', 'avatar_url', 'role', 'status', 'created_at')
      .where({ id: req.user.userId })
      .first();

    if (!user) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '用户不存在' });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/profile
router.put('/user/profile', authenticate, async (req, res, next) => {
  try {
    const { nickname, avatar_url } = req.body;
    const updateData = {};
    if (nickname !== undefined) updateData.nickname = nickname;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: '没有需要更新的字段' });
    }

    await db('users').where({ id: req.user.userId }).update(updateData);

    const user = await db('users')
      .select('id', 'email', 'nickname', 'avatar_url', 'role', 'status', 'created_at')
      .where({ id: req.user.userId })
      .first();

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
