const DashboardPage = {
  async render() {
    document.getElementById('page-title').textContent = '仪表盘';
    const body = document.getElementById('content-body');

    body.innerHTML = '<div class="loading">加载中...</div>';

    try {
      const stats = await AdminAPI.getStats();

      const getBadge = (type) => {
        const badges = {
          series: '<span class="badge badge-ongoing">番剧</span>',
          movie: '<span class="badge badge-completed">电影</span>',
        };
        return badges[type] || '';
      };

      body.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.animeCount}</div>
            <div class="stat-label">动漫总数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.episodeCount}</div>
            <div class="stat-label">剧集总数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.userCount}</div>
            <div class="stat-label">注册用户</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.bannerCount}</div>
            <div class="stat-label">轮播海报</div>
          </div>
        </div>
        <div class="table-container">
          <div class="table-header">
            <h3>最近动漫</h3>
          </div>
          <div id="recent-animes-table">
            <div class="loading">加载中...</div>
          </div>
        </div>
      `;

      // Load recent animes
      const animesData = await AdminAPI.getAnimes(1);
      const animes = animesData.data || [];

      document.getElementById('recent-animes-table').innerHTML = animes.length === 0
        ? '<div class="empty-state"><h3>暂无数据</h3></div>'
        : `
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>标题</th>
                <th>类型</th>
                <th>状态</th>
                <th>轮播</th>
                <th>浏览量</th>
                <th>上传时间</th>
              </tr>
            </thead>
            <tbody>
              ${animes.slice(0, 10).map(a => `
                <tr>
                  <td>${a.id}</td>
                  <td><strong>${escapeHtml(a.title)}</strong></td>
                  <td>${getBadge(a.type)}</td>
                  <td><span class="badge badge-${a.status}">${statusLabel(a.status)}</span></td>
                  <td><span class="badge ${a.is_banner ? 'badge-yes' : 'badge-no'}">${a.is_banner ? '是' : '否'}</span></td>
                  <td>${a.views || 0}</td>
                  <td>${formatDate(a.upload_date || a.created_at)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
    } catch (err) {
      body.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(err.message)}</p></div>`;
    }
  },
};

function statusLabel(s) {
  const map = { ongoing: '连载中', completed: '已完结', upcoming: '即将上映' };
  return map[s] || s;
}

function formatDate(d) {
  if (!d) return '-';
  const date = new Date(d);
  return date.toLocaleDateString('zh-CN');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] || c;
  });
}
