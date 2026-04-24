const { Router } = require('express');
const db = require('../db/connection');
const { authenticate } = require('../middleware/auth');
const { formatAnimeItem } = require('../utils/helpers');

const router = Router();

// GET /api/user/list
router.get('/user/list', authenticate, async (req, res, next) => {
  try {
    const rows = await db('user_anime_list as ul')
      .join('animes as a', 'ul.anime_id', 'a.id')
      .select('ul.id as list_id', 'ul.added_at', 'a.*')
      .where('ul.user_id', req.user.userId)
      .orderBy('ul.added_at', 'desc');

    res.json({
      data: rows.map((row) => ({
        list_id: row.list_id,
        added_at: row.added_at,
        ...formatAnimeItem(row),
      })),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/user/list
router.post('/user/list', authenticate, async (req, res, next) => {
  try {
    const { anime_id } = req.body;

    if (!anime_id) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: '请指定动漫ID' });
    }

    const anime = await db('animes').where({ id: anime_id }).first();
    if (!anime) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '动漫不存在' });
    }

    const existing = await db('user_anime_list')
      .where({ user_id: req.user.userId, anime_id })
      .first();

    if (existing) {
      return res.status(409).json({ error: 'ALREADY_EXISTS', message: '已在列表中' });
    }

    const [id] = await db('user_anime_list').insert({
      user_id: req.user.userId,
      anime_id,
    });

    res.status(201).json({
      message: '添加成功',
      list_id: id,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/user/list/:animeId
router.delete('/user/list/:animeId', authenticate, async (req, res, next) => {
  try {
    const animeId = parseInt(req.params.animeId);

    const deleted = await db('user_anime_list')
      .where({ user_id: req.user.userId, anime_id: animeId })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '列表中不存在该动漫' });
    }

    res.json({ message: '移除成功' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
