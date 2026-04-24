const { Router } = require('express');
const db = require('../db/connection');
const { formatAnimeItem, formatBannerItem } = require('../utils/helpers');

const router = Router();

// GET /api/home
router.get('/home', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const [latestReleases, recentlyAdded, animeSeries, trending, banners] = await Promise.all([
      db('animes').orderBy('upload_date', 'desc').limit(limit),
      db('animes').orderBy('created_at', 'desc').limit(limit),
      db('animes').whereNotNull('poster_vertical_url').limit(limit),
      db('animes').orderBy('views', 'desc').limit(limit),
      db('animes').where('is_banner', true).orderBy('banner_order', 'asc'),
    ]);

    res.json({
      latestReleases: latestReleases.map(formatAnimeItem),
      recentlyAdded: recentlyAdded.map(formatAnimeItem),
      animeSeries: animeSeries.map(formatAnimeItem),
      trending: trending.map(formatAnimeItem),
      heroBanner: banners.map(formatBannerItem),
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
