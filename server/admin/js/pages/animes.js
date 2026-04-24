const AnimesPage = {
  currentPage: 1,
  editingId: null,

  async render() {
    document.getElementById('page-title').textContent = '动漫管理';
    const body = document.getElementById('content-body');

    body.innerHTML = `
      <div class="table-container">
        <div class="table-header">
          <h3>所有动漫</h3>
          <button id="add-anime-btn" class="btn btn-primary btn-sm">+ 添加动漫</button>
        </div>
        <div id="animes-table"><div class="loading">加载中...</div></div>
      </div>

      <!-- Anime Modal -->
      <div id="anime-modal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3 id="anime-modal-title">添加动漫</h3>
            <button class="modal-close" onclick="AnimesPage.closeModal()">&times;</button>
          </div>
          <form id="anime-form">
            <input type="hidden" id="anime-id">
            <div class="form-group">
              <label>标题 *</label>
              <input type="text" id="anime-title" required>
            </div>
            <div class="form-group">
              <label>简介</label>
              <textarea id="anime-synopsis" rows="3"></textarea>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>横版海报 URL</label>
                <input type="text" id="anime-horizontal">
              </div>
              <div class="form-group">
                <label>竖版海报 URL</label>
                <input type="text" id="anime-vertical">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>类型</label>
                <select id="anime-type">
                  <option value="series">番剧 (Series)</option>
                  <option value="movie">电影 (Movie)</option>
                </select>
              </div>
              <div class="form-group">
                <label>状态</label>
                <select id="anime-status">
                  <option value="ongoing">连载中</option>
                  <option value="completed">已完结</option>
                  <option value="upcoming">即将上映</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>发布日期</label>
              <input type="date" id="anime-release">
            </div>
            <div class="form-group form-checkbox">
              <input type="checkbox" id="anime-banner">
              <label for="anime-banner">加入轮播</label>
            </div>
            <div class="form-group" id="banner-order-group" style="display:none">
              <label>轮播排序</label>
              <input type="number" id="anime-banner-order" min="0" value="0">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" onclick="AnimesPage.closeModal()">取消</button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.bindEvents();
    await this.loadTable();
  },

  bindEvents() {
    document.getElementById('add-anime-btn').onclick = () => this.openModal();
    document.getElementById('anime-form').onsubmit = (e) => this.handleSubmit(e);
    document.getElementById('anime-banner').onchange = (e) => {
      document.getElementById('banner-order-group').style.display = e.target.checked ? 'block' : 'none';
    };
  },

  async loadTable() {
    const container = document.getElementById('animes-table');
    try {
      const data = await AdminAPI.getAnimes(this.currentPage);
      const animes = data.data || [];

      if (animes.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>暂无动漫数据</h3></div>';
        return;
      }

      container.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>标题</th>
              <th>类型</th>
              <th>状态</th>
              <th>轮播</th>
              <th>浏览量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${animes.map(a => `
              <tr>
                <td>${a.id}</td>
                <td><strong>${escapeHtml(a.title)}</strong></td>
                <td><span class="badge badge-${a.type === 'movie' ? 'completed' : 'ongoing'}">${a.type === 'movie' ? '电影' : '番剧'}</span></td>
                <td><span class="badge badge-${a.status}">${statusLabel(a.status)}</span></td>
                <td><span class="badge ${a.is_banner ? 'badge-yes' : 'badge-no'}">${a.is_banner ? '是' : '否'}</span></td>
                <td>${a.views || 0}</td>
                <td class="action-cell">
                  <button class="btn-icon" onclick="AnimesPage.editAnime(${a.id})" title="编辑">&#9998;</button>
                  <button class="btn-icon danger" onclick="AnimesPage.deleteAnime(${a.id})" title="删除">&#10005;</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="pagination">
          <button onclick="AnimesPage.prevPage()" ${this.currentPage <= 1 ? 'disabled' : ''}>&laquo; 上一页</button>
          <span>第 ${data.page} / ${Math.ceil(data.total / data.limit)} 页 (共 ${data.total} 条)</span>
          <button onclick="AnimesPage.nextPage()" ${this.currentPage >= Math.ceil(data.total / data.limit) ? 'disabled' : ''}>下一页 &raquo;</button>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(err.message)}</p></div>`;
    }
  },

  prevPage() {
    if (this.currentPage > 1) { this.currentPage--; this.loadTable(); }
  },

  nextPage() {
    this.currentPage++;
    this.loadTable();
  },

  openModal(anime) {
    this.editingId = anime ? anime.id : null;
    document.getElementById('anime-modal-title').textContent = anime ? '编辑动漫' : '添加动漫';
    document.getElementById('anime-id').value = anime ? anime.id : '';
    document.getElementById('anime-title').value = anime ? anime.title : '';
    document.getElementById('anime-synopsis').value = anime ? (anime.synopsis || '') : '';
    document.getElementById('anime-horizontal').value = anime ? (anime.poster_horizontal_url || '') : '';
    document.getElementById('anime-vertical').value = anime ? (anime.poster_vertical_url || '') : '';
    document.getElementById('anime-type').value = anime ? anime.type : 'series';
    document.getElementById('anime-status').value = anime ? anime.status : 'ongoing';
    document.getElementById('anime-release').value = anime ? (anime.release_date ? anime.release_date.split('T')[0] : '') : '';
    document.getElementById('anime-banner').checked = anime ? !!anime.is_banner : false;
    document.getElementById('anime-banner-order').value = anime ? (anime.banner_order || 0) : 0;
    document.getElementById('banner-order-group').style.display = anime && anime.is_banner ? 'block' : 'none';

    document.getElementById('anime-modal').classList.add('show');
  },

  closeModal() {
    document.getElementById('anime-modal').classList.remove('show');
    this.editingId = null;
  },

  async handleSubmit(e) {
    e.preventDefault();
    const data = {
      title: document.getElementById('anime-title').value.trim(),
      synopsis: document.getElementById('anime-synopsis').value.trim(),
      poster_horizontal_url: document.getElementById('anime-horizontal').value.trim(),
      poster_vertical_url: document.getElementById('anime-vertical').value.trim(),
      type: document.getElementById('anime-type').value,
      status: document.getElementById('anime-status').value,
      release_date: document.getElementById('anime-release').value || null,
      is_banner: document.getElementById('anime-banner').checked,
      banner_order: parseInt(document.getElementById('anime-banner-order').value) || 0,
    };

    if (!data.title) return alert('标题不能为空');

    try {
      if (this.editingId) {
        await AdminAPI.updateAnime(this.editingId, data);
      } else {
        await AdminAPI.createAnime(data);
      }
      this.closeModal();
      await this.loadTable();
    } catch (err) {
      alert('操作失败: ' + err.message);
    }
  },

  async editAnime(id) {
    try {
      const anime = await AdminAPI.getAnime(id);
      this.openModal(anime);
    } catch (err) {
      alert('获取数据失败: ' + err.message);
    }
  },

  async deleteAnime(id) {
    if (!confirm('确定要删除这部动漫吗？所有剧集也将被删除。')) return;
    try {
      await AdminAPI.deleteAnime(id);
      await this.loadTable();
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  },
};
