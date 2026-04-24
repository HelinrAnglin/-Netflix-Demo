# Netflix风格动漫影视内容Web应用（全栈）

这是一个模仿Netflix设计风格的动漫影视内容流媒体平台全栈Demo项目。前端使用 React + Vite 构建，后端使用 Express + SQLite/MySQL + Knex 构建，附带独立管理后台。

## 项目特色

- **Netflix风格设计**：完整实现Netflix的设计语言，包括色彩、字体、动画和交互
- **响应式布局**：适配桌面、平板和移动端设备
- **完整后端系统**：RESTful API、数据库迁移、种子数据、JWT认证
- **管理后台**：独立的SPA管理界面，支持动漫/剧集/轮播/用户管理
- **RSS订阅**：支持RSS 2.0标准输出

## 技术栈

- **前端框架**: React 18 + Vite
- **路由管理**: React Router DOM
- **样式方案**: CSS Modules + 自定义CSS变量
- **后端框架**: Express 4
- **数据库ORM**: Knex.js
- **数据库**: SQLite（开发环境）/ MySQL（生产环境）
- **认证**: JWT + bcryptjs
- **开发工具**: ESLint + Vite HMR + concurrently

## 功能特性

### 1. 页眉导航 (Header)
- 固定顶部导航栏，滚动时背景渐变为深黑色（吸顶效果）
- 左侧Logo和导航链接：首页、最新发布、最新上传、番剧专区、他们在看
- 右侧功能区：搜索按钮（点击展开搜索框）、RSS订阅按钮、个人头像按钮
- 当前页面高亮指示器
- 响应式设计：移动端导航栏自适应

### 2. 海报轮播区 (Hero Banner)
- 从后端API获取轮播数据（数据库is_banner标记）
- 自动轮播展示（间隔6秒）
- 左右切换箭头（悬停显示）
- 底部指示器（Dot indicators）
- 暂停/继续播放控制（鼠标悬停时暂停）

### 3. 内容展示模块
- **最新发布**：16:9横版封面，横向滑动浏览
- **最新上传**：16:9横版封面，横向滑动浏览
- **番剧专区**：2:3竖版封面，横向滑动浏览
- **他们在看**：16:9横版封面，按热度排序

### 4. 独立内容页面（带分页）
- 最新发布列表页（网格布局，分页，每页20条）
- 最新上传列表页（网格布局，分页，每页20条）
- 番剧专区列表页（网格布局，分页，每页20条）
- 他们在看列表页（网格布局，分页，每页20条）

### 5. 用户系统
- **注册/登录**：JWT 7天有效期，密码bcrypt加密
- **个人主页**：个人资料、我的列表（追番管理）
- **添加/移除**：点击添加到我的列表，随时移除

### 6. 管理后台（独立SPA）
- **仪表盘**：数据统计概览（动漫数、剧集数、用户数、轮播数）
- **动漫管理**：CRUD + 分页 + 搜索
- **剧集管理**：按动漫筛选 + CRUD
- **轮播管理**：开关切换 + 排序设置
- **用户管理**：列表 + 状态切换 + 删除

### 7. 其他功能
- **搜索**：支持中文关键词搜索（标题+简介）
- **RSS订阅**：标准RSS 2.0 XML输出
- **浏览次数统计**：每次详情访问自动+1

## 项目结构

```
ai-code-animation-web-test/
├── public/                          # 静态资源
├── src/                             # 前端React应用
│   ├── components/                  # 可复用组件
│   │   ├── Header.jsx               # 顶部导航栏组件
│   │   ├── Header.module.css        # 导航栏样式
│   │   ├── HeroBanner.jsx           # 轮播图组件（从API获取数据）
│   │   ├── HeroBanner.module.css    # 轮播图样式
│   │   ├── MovieRow.jsx             # 电影行组件（横向滑动）
│   │   ├── MovieRow.module.css      # 电影行样式
│   │   ├── Footer.jsx               # 页脚组件
│   │   └── Footer.module.css        # 页脚样式
│   ├── pages/                       # 页面组件
│   │   ├── Home.jsx                 # 主页（从API获取数据）
│   │   ├── Home.module.css          # 主页样式
│   │   ├── LatestReleases.jsx       # 最新发布列表页（分页）
│   │   ├── RecentlyAdded.jsx        # 最新上传列表页（分页）
│   │   ├── AnimeSeries.jsx          # 番剧专区列表页（分页）
│   │   ├── Trending.jsx             # 他们在看列表页（分页）
│   │   ├── ListPage.module.css      # 列表页通用样式
│   │   ├── Login.jsx                # 登录页面（调用API）
│   │   ├── Login.module.css         # 登录页面样式
│   │   ├── Signup.jsx               # 注册页面（调用API）
│   │   ├── Profile.jsx              # 个人主页（从API获取数据）
│   │   └── Profile.module.css       # 个人主页样式
│   ├── services/                    # 后端API服务层
│   │   └── api.js                   # API调用封装（所有fetch请求）
│   ├── context/                     # React上下文
│   │   └── AuthContext.jsx          # 全局认证状态管理
│   ├── utils/                       # 工具函数
│   │   └── data.js                  # 本地模拟数据（未使用API时的后备）
│   ├── assets/                      # 静态资源
│   ├── App.jsx                      # 应用主组件（路由配置）
│   ├── App.css                      # 应用全局样式
│   ├── main.jsx                     # 应用入口文件（含AuthProvider）
│   └── index.css                    # 全局基础样式
├── server/                          # Express后端
│   ├── package.json                 # 后端依赖配置
│   ├── knexfile.js                  # Knex数据库配置（SQLite/MySQL双环境）
│   ├── admin/                       # 管理后台SPA
│   │   ├── index.html               # SPA入口（登录+管理界面）
│   │   ├── css/style.css            # 管理后台样式
│   │   └── js/
│   │       ├── api.js               # API封装（带JWT管理）
│   │       ├── app.js               # Hash路由+登录状态管理
│   │       └── pages/
│   │           ├── dashboard.js     # 仪表盘页面
│   │           ├── animes.js        # 动漫管理页面（CRUD）
│   │           ├── episodes.js      # 剧集管理页面（CRUD）
│   │           ├── banners.js       # 轮播管理页面
│   │           └── users.js         # 用户管理页面
│   └── src/
│       ├── index.js                 # 应用入口（启动Express）
│       ├── app.js                   # Express配置（CORS、路由、静态文件）
│       ├── db/
│       │   ├── connection.js        # Knex单例连接
│       │   ├── migrations/          # 数据库迁移文件
│       │   │   ├── 001_create_users.js
│       │   │   ├── 002_create_animes.js
│       │   │   ├── 003_create_episodes.js
│       │   │   └── 004_create_user_anime_list.js
│       │   └── seeds/
│       │       └── 001_seed_all.js  # 种子数据（10部动漫、37集、3个用户）
│       ├── middleware/
│       │   ├── auth.js              # JWT验证中间件
│       │   ├── adminRequired.js     # 管理员权限检查
│       │   └── errorHandler.js      # 统一错误处理
│       ├── routes/
│       │   ├── index.js             # 路由聚合
│       │   ├── auth.js              # /api/auth/*（注册、登录）
│       │   ├── home.js              # /api/home（主页综合数据）
│       │   ├── animes.js            # /api/anime/* 和 /api/*-releases等
│       │   ├── search.js            # /api/search（搜索）
│       │   ├── rss.js               # /api/rss（RSS输出）
│       │   ├── profile.js           # /api/user/profile（个人信息）
│       │   ├── userList.js          # /api/user/list（追番列表）
│       │   └── admin.js             # /api/admin/*（后台管理CRUD）
│       └── utils/
│           └── helpers.js           # 格式化工具函数
├── .env                             # 环境变量配置（DB、JWT密钥）
├── .gitignore
├── index.html                       # HTML入口
├── package.json                     # 项目依赖（含concurrently并行脚本）
├── vite.config.js                   # Vite配置（端口5174、代理5173）
└── README.md                        # 项目说明文档
```

## 快速开始

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 包管理器
- （可选）MySQL 8.0+（生产环境，默认使用SQLite开发）

### 安装与运行

1. **安装前端依赖**（项目根目录）：
   ```bash
   cd "ai code animation web test"
   npm install
   ```

2. **安装后端依赖**：
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **配置环境变量**（可选，有默认值）：
   项目根目录下 `.env` 文件：
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=anime_db
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

4. **运行迁移和种子数据**：
   ```bash
   cd server
   npx knex migrate:latest
   npx knex seed:run
   cd ..
   ```
   这将自动创建SQLite数据库并填充10部动漫、37集剧集和3个用户。

5. **启动开发服务器**（前后端同时启动）：
   ```bash
   npm run dev
   ```
   或分别启动：
   ```bash
   # 终端1：启动后端（端口5173）
   cd server && node src/index.js

   # 终端2：启动前端（端口5174）
   npm run dev
   ```

6. **访问应用**：
   - 前端界面：http://localhost:5174
   - 管理后台：http://localhost:5174/admin

### 默认管理员账号

- **邮箱**: admin@anime.com
- **密码**: admin123456

### 测试用户账号

- user1@test.com / password123
- user2@test.com / password123

## API端点

| 方法 | 路径 | 认证 | 描述 |
|------|------|------|------|
| GET | /api/home | 无 | 主页综合数据 |
| GET | /api/latest-releases?page=&limit= | 无 | 最新发布 |
| GET | /api/recently-added?page=&limit= | 无 | 最新上传 |
| GET | /api/anime-series?page=&limit= | 无 | 番剧专区 |
| GET | /api/trending?page=&limit= | 无 | 他们在看 |
| GET | /api/anime/:id | 无 | 动漫详情 |
| GET | /api/search?q= | 无 | 搜索 |
| GET | /api/rss | 无 | RSS 2.0 XML |
| POST | /api/auth/register | 无 | 注册 |
| POST | /api/auth/login | 无 | 登录 |
| GET | /api/user/profile | JWT | 用户信息 |
| PUT | /api/user/profile | JWT | 更新资料 |
| GET | /api/user/list | JWT | 我的列表 |
| POST | /api/user/list | JWT | 添加追番 |
| DELETE | /api/user/list/:animeId | JWT | 移除追番 |
| GET | /api/admin/stats | JWT+Admin | 统计概览 |
| GET | /api/admin/animes | JWT+Admin | 动漫列表 |
| POST | /api/admin/animes | JWT+Admin | 创建动漫 |
| PUT | /api/admin/animes/:id | JWT+Admin | 更新动漫 |
| DELETE | /api/admin/animes/:id | JWT+Admin | 删除动漫 |
| GET | /api/admin/animes/:id/episodes | JWT+Admin | 剧集列表 |
| POST | /api/admin/episodes | JWT+Admin | 创建剧集 |
| PUT | /api/admin/episodes/:id | JWT+Admin | 更新剧集 |
| DELETE | /api/admin/episodes/:id | JWT+Admin | 删除剧集 |
| GET | /api/admin/banners | JWT+Admin | 轮播列表 |
| PUT | /api/admin/banners | JWT+Admin | 更新轮播 |
| GET | /api/admin/users | JWT+Admin | 用户列表 |
| PUT | /api/admin/users/:id | JWT+Admin | 更新用户 |
| DELETE | /api/admin/users/:id | JWT+Admin | 删除用户 |

## 管理后台使用

1. 访问 http://localhost:5174/admin
2. 使用管理员账号登录：admin@anime.com / admin123456
3. **仪表盘**：查看数据统计和最近添加的动漫
4. **动漫管理**：添加/编辑/删除动漫作品，设置轮播和排序
5. **剧集管理**：选择动漫后管理其剧集
6. **轮播管理**：开关首页轮播显示，设置播放顺序
7. **用户管理**：查看用户列表，禁用或删除用户

## 响应式设计

### 桌面端 (>1200px)
- 导航栏完整显示所有链接
- 电影行每行显示5个卡片

### 平板端 (768px-1200px)
- 导航栏链接间距调整
- 电影行每行显示3-4个卡片

### 移动端 (<768px)
- 导航栏简化显示
- 电影行每行显示1-2个卡片

## 注意事项

1. **开发环境默认使用SQLite**，无需安装MySQL即可运行
2. **占位图片**使用 placehold.co 服务，需要网络访问
3. **搜索中文**需要URL编码（浏览器自动处理）
4. **生产环境**需配置MySQL并设置 `NODE_ENV=production`

## 许可证

本项目为演示项目，仅供学习和参考使用。
