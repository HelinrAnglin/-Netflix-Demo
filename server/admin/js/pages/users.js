const UsersPage = {
  currentPage: 1,

  async render() {
    document.getElementById('page-title').textContent = '用户管理';
    const body = document.getElementById('content-body');

    body.innerHTML = '<div class="loading">加载中...</div>';

    try {
      const data = await AdminAPI.getUsers(this.currentPage);
      const users = data.data || [];

      if (users.length === 0) {
        body.innerHTML = '<div class="empty-state"><h3>暂无用户数据</h3></div>';
        return;
      }

      body.innerHTML = `
        <div class="table-container">
          <div class="table-header">
            <h3>注册用户 (共 ${data.total} 人)</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>昵称</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>状态</th>
                <th>注册时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr>
                  <td>${u.id}</td>
                  <td><strong>${escapeHtml(u.nickname)}</strong></td>
                  <td>${escapeHtml(u.email)}</td>
                  <td><span class="badge badge-${u.role}">${u.role === 'admin' ? '管理员' : '用户'}</span></td>
                  <td><span class="badge badge-${u.status}">${u.status === 'active' ? '正常' : '已禁用'}</span></td>
                  <td>${formatDate(u.created_at)}</td>
                  <td class="action-cell">
                    ${u.role !== 'admin' ? `
                      <button class="btn-icon ${u.status === 'active' ? 'danger' : ''}"
                              onclick="UsersPage.toggleStatus(${u.id}, '${u.status === 'active' ? 'disabled' : 'active'}')"
                              title="${u.status === 'active' ? '禁用' : '启用'}">
                        ${u.status === 'active' ? '&#128683;' : '&#9989;'}
                      </button>
                      <button class="btn-icon danger"
                              onclick="UsersPage.deleteUser(${u.id})"
                              title="删除">&#10005;</button>
                    ` : '<span style="color:var(--text-muted);font-size:12px;">-</span>'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="pagination">
            <button onclick="UsersPage.prevPage()" ${this.currentPage <= 1 ? 'disabled' : ''}>&laquo; 上一页</button>
            <span>第 ${data.page} / ${Math.ceil(data.total / data.limit)} 页</span>
            <button onclick="UsersPage.nextPage()" ${this.currentPage >= Math.ceil(data.total / data.limit) ? 'disabled' : ''}>下一页 &raquo;</button>
          </div>
        </div>
      `;
    } catch (err) {
      body.innerHTML = `<div class="empty-state"><h3>加载失败</h3><p>${escapeHtml(err.message)}</p></div>`;
    }
  },

  prevPage() {
    if (this.currentPage > 1) { this.currentPage--; this.render(); }
  },
  nextPage() {
    this.currentPage++;
    this.render();
  },

  async toggleStatus(id, newStatus) {
    const action = newStatus === 'disabled' ? '禁用' : '启用';
    if (!confirm(`确定要${action}该用户吗？`)) return;
    try {
      await AdminAPI.updateUser(id, { status: newStatus });
      await this.render();
    } catch (err) {
      alert('操作失败: ' + err.message);
    }
  },

  async deleteUser(id) {
    if (!confirm('确定要删除该用户吗？此操作不可恢复。')) return;
    try {
      await AdminAPI.deleteUser(id);
      await this.render();
    } catch (err) {
      alert('删除失败: ' + err.message);
    }
  },
};
