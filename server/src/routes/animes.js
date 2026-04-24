const { Router } = require('express');
const db = require('../db/connection');
const { formatAnimeItem, paginationMeta } = require('../utils/helpers');

const router = Router();

// GET /api/latest-releases
router.get('/latest-releases', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [{ count }] = await db('animes').count('* as count');
    const total = count;

    const rows = await db('animes')
      .orderBy('upload_date', 'desc')
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

// GET /api/recently-added
router.get('/recently-added', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [{ count }] = await db('animes').count('* as count');
    const total = count;

    const rows = await db('animes')
      .orderBy('created_at', 'desc')
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

// GET /api/anime-series
router.get('/anime-series', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [{ count }] = await db('animes')
      .whereNotNull('poster_vertical_url')
      .count('* as count');
    const total = count;

    const rows = await db('animes')
      .whereNotNull('poster_vertical_url')
      .orderBy('created_at', 'desc')
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

// GET /api/trending
router.get('/trending', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [{ count }] = await db('animes').count('* as count');
    const total = count;

    const rows = await db('animes')
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

// GET /api/anime/:id
router.get('/anime/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const anime = await db('animes').where({ id }).first();

    if (!anime) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '动漫不存在' });
    }

    // Increment views
    await db('animes').where({ id }).increment('views', 1);

    const episodes = await db('episodes')
      .where({ anime_id: id })
      .orderBy('episode_number', 'asc');

    res.json({
      ...formatAnimeItem(anime),
      synopsis: anime.synopsis,
      poster_horizontal_url: anime.poster_horizontal_url,
      poster_vertical_url: anime.poster_vertical_url,
      type: anime.type,
      status: anime.status,
      release_date: anime.release_date,
      views: anime.views + 1,
      episodes: episodes.map((ep) => ({
        id: ep.id,
        episode_number: ep.episode_number,
        title: ep.title,
        video_url: ep.video_url,
        duration: ep.duration,
      })),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
