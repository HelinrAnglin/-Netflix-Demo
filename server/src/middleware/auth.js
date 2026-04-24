const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'anime-netflix-jwt-secret-key-2024';

function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'UNAUTHORIZED', message: '未提供认证令牌' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'TOKEN_INVALID', message: '令牌无效或已过期' });
  }
}

module.exports = { authenticate };
