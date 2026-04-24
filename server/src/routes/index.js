const { Router } = require('express');

const authRoutes = require('./auth');
const homeRoutes = require('./home');
const animeRoutes = require('./animes');
const searchRoutes = require('./search');
const rssRoutes = require('./rss');
const profileRoutes = require('./profile');
const userListRoutes = require('./userList');
const adminRoutes = require('./admin');

const router = Router();

// Public routes
router.use('/', homeRoutes);              // GET /api/home
router.use('/auth', authRoutes);          // POST /api/auth/*
router.use('/', animeRoutes);             // GET /api/latest-releases, /api/recently-added, /api/anime-series, /api/trending, /api/anime/:id
router.use('/', searchRoutes);            // GET /api/search
router.use('/', rssRoutes);               // GET /api/rss

// Authenticated routes
router.use('/', profileRoutes);           // GET/PUT /api/user/profile
router.use('/', userListRoutes);          // GET/POST/DELETE /api/user/list/*

// Admin routes
router.use('/', adminRoutes);             // /api/admin/*

module.exports = router;
