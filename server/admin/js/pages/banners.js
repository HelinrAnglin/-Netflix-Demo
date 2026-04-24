const BannersPage = {
  async render() {
    document.getElementById('page-title').textContent = '轮播管理';
    const body = document.getElementById('content-body');

    body.innerHTML = '<div class="loading">加载中...</div>';

    try {
      const data = await AdminAPI.getBanners();
      const banners = data.data || [];

      body.innerHTML = `
        <div class="table-container">
          <div class="table-header">
            <h3>轮播海报设置</h3>
            <p style="color:var(--text-muted);font-size:13px;">勾选要显示在主页轮播区的动漫，并设定排序</p>
          </div>
          ${banners.length === 0
            ? '<div class="empty-state"><h3>暂无数据</h3></div>'
            : `
            <table>
              <thead>
                <tr>
                  <th style="width:60px;">ID</th>
                  <th>标题</th>
                  <th>海报预览</th>
                  <th style="width:100px;">加入轮播</th>
                  <th style="width:120px;">排序</th>
                  <th style="width:120px;">操作</th>
                </tr>
              </thead>
              <tbody>
                ${banners.map(b => `
                  <tr>
                    <td>${b.id}</td>
                    <td><strong>${escapeHtml(b.title)}</strong></td>
                    <td>
                      <img src="${b.poster_horizontal_url || 'https://placehold.co/80x45/1a1a1a/E50914?text=No'}"
                           alt="${escapeHtml(b.title)}"
                           style="width:80px;height:45px;object-fit:cover;border-radius:2px;">
                    </td>
                    <td>
                      <input type="checkbox"
                             class="banner-check"
                             data-id="${b.id}"
                             ${b.is_banner ? 'checked' : ''}>
                    </td>
                    <td>
                      <input type="number"
                             class="banner-order"
                             data-id="${b.id}"
                             value="${b.banner_order || 0}"
                             min="0"
                             style="width:80px;padding:6px 8px;"
                             ${!b.is_banner ? 'disabled' : ''}>
                    </td>
                    <td class="action-cell">
                      <button class="btn btn-sm ${b.is_banner ? 'btn-danger' : 'btn-success'}"
                              onclick="BannersPage.toggleBanner(${b.id}, ${!b.is_banner})">
                        ${b.is_banner ? '移除轮播' : '加入轮播'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="padding:16px;border-top:1px solid var(--border);display:flex;gap:12px;justify-content:flex-end;">
              <button class="btn btn-primary" onclick="BannersPage.saveAll()">保存所有更改</button>
            </div>
            `}
        </div>
      `;

      // Bind checkbox events
      document.querySelectorAll('.banner-check').forEach(cb => {
        cb.addEventListener('change', function () {
          const orderInput = document.querySelector(`.banner-order[data-id="${this.dataset.id}"]`);
          if (orderInput) orderInput.disabled = !this.checked;
        });
      });
    } catch (err) {
      body.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(err.message)}</p></div>`;
    }
  },

  async toggleBanner(id, isBanner) {
    try {
      const orderInput = document.querySelector(`.banner-order[data-id="${id}"]`);
      const checkInput = document.querySelector(`.banner-check[data-id="${id}"]`);

      await AdminAPI.updateBanner(id, {
        is_banner: isBanner,
        banner_order: isBanner ? parseInt(orderInput?.value || 0) : null,
      });

      if (checkInput) checkInput.checked = isBanner;
      if (orderInput) orderInput.disabled = !isBanner;
    } catch (err) {
      alert('操作失败: ' + err.message);
    }
  },

  async saveAll() {
    try {
      const checks = document.querySelectorAll('.banner-check');
      const updates = [];

      checks.forEach(cb => {
        const id = parseInt(cb.dataset.id);
        const isBanner = cb.checked;
        const orderInput = document.querySelector(`.banner-order[data-id="${id}"]`);
        const order = parseInt(orderInput?.value || 0);
        updates.push(AdminAPI.updateBanner(id, { is_banner: isBanner, banner_order: isBanner ? order : null }));
      });

      await Promise.all(updates);
      alert('保存成功');
    } catch (err) {
      alert('保存失败: ' + err.message);
    }
  },
};
