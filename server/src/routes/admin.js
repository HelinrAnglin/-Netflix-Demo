const { Router } = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/connection');
const adminRequired = require('../middleware/adminRequired');

const router = Router();
// All routes here use adminRequired middleware

// ===== Dashboard Stats =====
router.get('/admin/stats', adminRequired, async (req, res, next) => {
  try {
    const [{ animeCount }] = await db('animes').count('* as animeCount');
    const [{ episodeCount }] = await db('episodes').count('* as episodeCount');
    const [{ userCount }] = await db('users').count('* as userCount');
    const [{ bannerCount }] = await db('animes').where('is_banner', true).count('* as bannerCount');

    res.json({ animeCount, episodeCount, userCount, bannerCount });
  } catch (err) {
    next(err);
  }
});

// ===== Anime CRUD =====
router.get('/admin/animes', adminRequired, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const [{ count }] = await db('animes').count('* as count');
    const rows = await db('animes').orderBy('created_at', 'desc').offset(offset).limit(limit);

    res.json({ data: rows, total: count, page, limit });
  } catch (err) {
    next(err);
  }
});

router.get('/admin/animes/:id', adminRequired, async (req, res, next) => {
  try {
    const anime = await db('animes').where({ id: req.params.id }).first();
    if (!anime) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '动漫不存在' });
    }
    const episodes = await db('episodes').where({ anime_id: req.params.id }).orderBy('episode_number', 'asc');
    res.json({ ...anime, episodes });
  } catch (err) {
    next(err);
  }
});

router.post('/admin/animes', adminRequired, async (req, res, next) => {
  try {
    const { title, synopsis, poster_horizontal_url, poster_vertical_url, type, status, release_date, is_banner, banner_order } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: '标题不能为空' });
    }
    const [id] = await db('animes').insert({
      title, synopsis, poster_horizontal_url, poster_vertical_url,
      type: type || 'series',
      status: status || 'upcoming',
      release_date: release_date || null,
      is_banner: !!is_banner,
      banner_order: is_banner ? (banner_order || 0) : null,
    });
    res.status(201).json({ id, message: '创建成功' });
  } catch (err) {
    next(err);
  }
});

router.put('/admin/animes/:id', adminRequired, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, synopsis, poster_horizontal_url, poster_vertical_url, type, status, release_date, is_banner, banner_order } = req.body;

    const existing = await db('animes').where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '动漫不存在' });
    }

    await db('animes').where({ id }).update({
      title: title !== undefined ? title : existing.title,
      synopsis: synopsis !== undefined ? synopsis : existing.synopsis,
      poster_horizontal_url: poster_horizontal_url !== undefined ? poster_horizontal_url : existing.poster_horizontal_url,
      poster_vertical_url: poster_vertical_url !== undefined ? poster_vertical_url : existing.poster_vertical_url,
      type: type !== undefined ? type : existing.type,
      status: status !== undefined ? status : existing.status,
      release_date: release_date !== undefined ? release_date : existing.release_date,
      is_banner: is_banner !== undefined ? !!is_banner : existing.is_banner,
      banner_order: is_banner ? (banner_order !== undefined ? banner_order : existing.banner_order) : null,
    });

    res.json({ message: '更新成功' });
  } catch (err) {
    next(err);
  }
});

router.delete('/admin/animes/:id', adminRequired, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await db('animes').where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '动漫不存在' });
    }
    await db('animes').where({ id }).del();
    res.json({ message: '删除成功' });
  } catch (err) {
    next(err);
  }
});

// ===== Episode CRUD =====
router.get('/admin/episodes', adminRequired, async (req, res, next) => {
  try {
    const animeId = req.query.anime_id;
    let query = db('episodes').orderBy('episode_number', 'asc');
    if (animeId) {
      query = query.where({ anime_id: parseInt(animeId) });
    }
    const rows = await query;
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

router.post('/admin/episodes', adminRequired, async (req, res, next) => {
  try {
    const { anime_id, episode_number, title, video_url, duration } = req.body;
    if (!anime_id || !episode_number || !title) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: '动漫ID、集数和标题不能为空' });
    }

    const anime = await db('animes').where({ id: anime_id }).first();
    if (!anime) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '动漫不存在' });
    }

    const [id] = await db('episodes').insert({ anime_id, episode_number, title, video_url, duration });
    res.status(201).json({ id, message: '剧集创建成功' });
  } catch (err) {
    next(err);
  }
});

router.put('/admin/episodes/:id', adminRequired, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { episode_number, title, video_url, duration } = req.body;

    const existing = await db('episodes').where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '剧集不存在' });
    }

    await db('episodes').where({ id }).update({
      episode_number: episode_number !== undefined ? episode_number : existing.episode_number,
      title: title !== undefined ? title : existing.title,
      video_url: video_url !== undefined ? video_url : existing.video_url,
      duration: duration !== undefined ? duration : existing.duration,
    });

    res.json({ message: '更新成功' });
  } catch (err) {
    next(err);
  }
});

router.delete('/admin/episodes/:id', adminRequired, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await db('episodes').where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '剧集不存在' });
    }
    await db('episodes').where({ id }).del();
    res.json({ message: '删除成功' });
  } catch (err) {
    next(err);
  }
});

// ===== Banner Management =====
router.get('/admin/banners', adminRequired, async (req, res, next) => {
  try {
    const rows = await db('animes')
      .select('id', 'title', 'synopsis', 'is_banner', 'banner_order', 'poster_horizontal_url')
      .orderBy('banner_order', 'asc')
      .orderBy('created_at', 'desc');
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
});

router.put('/admin/banners/:id', adminRequired, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { is_banner, banner_order } = req.body;

    const existing = await db('animes').where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '动漫不存在' });
    }

    await db('animes').where({ id }).update({
      is_banner: is_banner !== undefined ? !!is_banner : existing.is_banner,
      banner_order: is_banner ? (banner_order !== undefined ? banner_order : existing.banner_order) : null,
    });

    res.json({ message: '轮播设置已更新' });
  } catch (err) {
    next(err);
  }
});

// ===== User Management =====
router.get('/admin/users', adminRequired, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const [{ count }] = await db('users').count('* as count');
    const rows = await db('users')
      .select('id', 'email', 'nickname', 'avatar_url', 'role', 'status', 'created_at')
      .orderBy('created_at', 'desc')
      .offset(offset)
      .limit(limit);

    res.json({ data: rows, total: count, page, limit });
  } catch (err) {
    next(err);
  }
});

router.put('/admin/users/:id', adminRequired, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { status, role } = req.body;

    const existing = await db('users').where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '用户不存在' });
    }

    const updateData = {};
    if (status !== undefined) {
      if (!['active', 'disabled'].includes(status)) {
        return res.status(400).json({ error: 'VALIDATION_ERROR', message: '状态值无效' });
      }
      updateData.status = status;
    }
    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'VALIDATION_ERROR', message: '角色值无效' });
      }
      updateData.role = role;
    }

    await db('users').where({ id }).update(updateData);
    res.json({ message: '用户信息已更新' });
  } catch (err) {
    next(err);
  }
});

router.delete('/admin/users/:id', adminRequired, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const existing = await db('users').where({ id }).first();
    if (!existing) {
      return res.status(404).json({ error: 'NOT_FOUND', message: '用户不存在' });
    }
    if (existing.role === 'admin') {
      return res.status(403).json({ error: 'FORBIDDEN', message: '不能删除管理员账户' });
    }
    await db('users').where({ id }).del();
    res.json({ message: '用户已删除' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
