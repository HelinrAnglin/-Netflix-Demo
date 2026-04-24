const { Router } = require('express');
const db = require('../db/connection');
const { formatAnimeItem, paginationMeta } = require('../utils/helpers');

const router = Router();

// GET /api/search?q=xxx&page=1&limit=20
router.get('/search', async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: '请输入搜索关键词' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [{ count }] = await db('animes')
      .where('title', 'like', `%${q}%`)
      .orWhere('synopsis', 'like', `%${q}%`)
      .count('* as count');
    const total = count;

    const rows = await db('animes')
      .where('title', 'like', `%${q}%`)
      .orWhere('synopsis', 'like', `%${q}%`)
      .orderBy('views', 'desc')
      .offset(offset)
      .limit(limit);

    res.json({
      data: rows.map(formatAnimeItem),
      pagination: paginationMeta(total, page, limit),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
