const { authenticate } = require('./auth');

const adminRequired = [
  authenticate,
  (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'FORBIDDEN', message: '需要管理员权限' });
    }
    next();
  },
];

module.exports = adminRequired;
