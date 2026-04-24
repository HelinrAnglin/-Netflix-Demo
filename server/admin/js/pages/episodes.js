const EpisodesPage = {
  selectedAnimeId: null,
  editingId: null,

  async render() {
    document.getElementById('page-title').textContent = '剧集管理';
    const body = document.getElementById('content-body');

    body.innerHTML = `
      <div class="table-container">
        <div class="table-header">
          <h3>剧集列表</h3>
          <div class="table-controls">
            <select id="episode-anime-select">
              <option value="">-- 请选择动漫 --</option>
            </select>
            <button id="add-episode-btn" class="btn btn-primary btn-sm" disabled>+ 添加剧集</button>
          </div>
        </div>
        <div id="episodes-table"><div class="empty-state"><h3>请先选择一部动漫</h3></div></div>
      </div>

      <!-- Episode Modal -->
      <div id="episode-modal" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h3 id="episode-modal-title">添加剧集</h3>
            <button class="modal-close" onclick="EpisodesPage.closeModal()">&times;</button>
          </div>
          <form id="episode-form">
            <input type="hidden" id="episode-id">
            <div class="form-row">
              <div class="form-group">
                <label>集数 *</label>
                <input type="number" id="episode-number" min="1" required>
              </div>
              <div class="form-group">
                <label>时长 (秒)</label>
                <input type="number" id="episode-duration" min="0">
              </div>
            </div>
            <div class="form-group">
              <label>标题 *</label>
              <input type="text" id="episode-title" required>
            </div>
            <div class="form-group">
              <label>视频 URL</label>
              <input type="text" id="episode-video-url" placeholder="https://...">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" onclick="EpisodesPage.closeModal()">取消</button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    `;

    await this.loadAnimeSelect();
    this.bindEvents();
  },

  bindEvents() {
    document.getElementById('episode-anime-select').onchange = (e) => {
      this.selectedAnimeId = e.target.value ? parseInt(e.target.value) : null;
      document.getElementById('add-episode-btn').disabled = !this.selectedAnimeId;
      this.loadEpisodes();
    };

    document.getElementById('add-episode-btn').onclick = () => this.openModal();
    document.getElementById('episode-form').onsubmit = (e) => this.handleSubmit(e);
  },

  async loadAnimeSelect() {
    try {
      const data = await AdminAPI.getAnimes(1);
      const animes = data.data || [];
      const select = document.getElementById('episode-anime-select');
      select.innerHTML = '<option value="">-- 请选择动漫 --</option>' +
        animes.map(a => `<option value="${a.id}">${escapeHtml(a.title)}</option>`).join('');
    } catch (err) {
      console.error('加载动漫列表失败:', err);
    }
  },

  async loadEpisodes() {
    const container = document.getElementById('episodes-table');

    if (!this.selectedAnimeId) {
      container.innerHTML = '<div class="empty-state"><h3>请先选择一部动漫</h3></div>';
      return;
    }

    container.innerHTML = '<div class="loading">加载中...</div>';

    try {
      const data = await AdminAPI.getEpisodes(this.selectedAnimeId);
      const episodes = data.data || [];

      if (episodes.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>暂无剧集</h3></div>';
        return;
      }

      container.innerHTML = `
        <table>
          <thead>
            <tr>
              <th>集数</th>
              <th>标题</th>
              <th>时长</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${episodes.map(ep => `
              <tr>
                <td>第 ${ep.episode_number} 集</td>
                <td><strong>${escapeHtml(ep.title)}</strong></td>
                <td>${formatDuration(ep.duration)}</td>
                <td class="action-cell">
                  <button class="btn-icon" onclick="EpisodesPage.editEpisode(${ep.id})" title="编辑">&#9998;</button>
                  <button class="btn-icon danger" onclick="EpisodesPage.deleteEpisode(${ep.id})" title="删除">&#10005;</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      container.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(err.message)}</p></div>`;
    }
  },

  openModal(episode) {
    this.editingId = episode ? episode.id : null;
    document.getElementById('episode-modal-title').textContent = episode ? '编辑剧集' : '添加剧集';
    document.getElementById('episode-id').value = episode ? episode.id : '';
    document.getElementById('episode-number').value = episode ? episode.episode_number : '';
    document.getElementById('episode-title').value = episode ? episode.title : '';
    document.getElementById('episode-duration').value = episode ? (episode.duration || '') : '';
    document.getElementById('episode-video-url').value = episode ? (episode.video_url || '') : '';
    document.getElementById('episode-modal').classList.add('show');
  },

  closeModal() {
    document.getElementById('episode-modal').classList.remove('show');
    this.editingId = null;
  },

  async handleSubmit(e) {
    e.preventDefault();
    const data = {
      anime_id: this.selectedAnimeId,
      episode_number: parseInt(document.getElementById('episode-number').value),
      title: document.getElementById('episode-title').value.trim(),
      duration: parseInt(document.getElementById('episode-duration').value) || null,
      video_url: document.getElementById('episode-video-url').value.trim() || null,
    };

    if (!data.title || !data.episode_number) return alert('集数和标题不能为空');

    try {
      if (this.editingId) {
        await AdminAPI.updateEpisode(this.editingId, data);
      } else {
        await AdminAPI.createEpisode(data);
      }
      this.closeModal();
      await this.loadEpisodes();
      await this.loadAnimeSelect();
    } catch (err) {
      alert('操作失败: ' + err.message);
    }
  },

  async editEpisode(id) {
    try {
      const data = await AdminAPI.getEpisodes(this.selectedAnimeId);
      const episode = (data.data || []).find(ep => ep.id === id);
      if (episode) this.openModal(episode);
    } catch (err) {
      alert('获取数据失败: ' + err.message);
    }
  },

  async deleteEpisode(id) {
    if (!confirm('确定要删除这集吗？')) return;
    try {
      await AdminAPI.deleteEpisode(id);
      await this.loadEpisodes();
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  },
};

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
