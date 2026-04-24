require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

const app = require('./app');

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
  console.log(`[Server] 后端服务器运行在 http://localhost:${PORT}`);
  console.log(`[Server] 管理后台 http://localhost:${PORT}/admin`);
  console.log(`[Server] API 基础路径 http://localhost:${PORT}/api`);
});
