// Admin SPA - Main Application

const PAGE_RENDERERS = {
  dashboard: () => DashboardPage.render(),
  animes: () => AnimesPage.render(),
  episodes: () => EpisodesPage.render(),
  banners: () => BannersPage.render(),
  users: () => UsersPage.render(),
};

document.addEventListener('DOMContentLoaded', function () {
  initLoginForm();
  initLogout();
  initNavigation();
  initRefresh();

  // Check if already logged in
  const token = AdminAPI.getToken();
  if (token) {
    showAdmin();
    navigateTo(getCurrentPage());
  }
});

function initLoginForm() {
  document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    errorEl.classList.remove('show');
    errorEl.textContent = '';

    if (!email || !password) {
      errorEl.textContent = '请输入邮箱和密码';
      errorEl.classList.add('show');
      return;
    }

    try {
      const data = await AdminAPI.login(email, password);

      if (data.user.role !== 'admin') {
        errorEl.textContent = '此账户没有管理权限';
        errorEl.classList.add('show');
        return;
      }

      AdminAPI.setToken(data.token);
      updateAdminInfo(data.user);
      showAdmin();
      navigateTo('dashboard');
    } catch (err) {
      errorEl.textContent = err.message || '登录失败';
      errorEl.classList.add('show');
    }
  });
}

function initLogout() {
  document.getElementById('logout-btn').addEventListener('click', function () {
    if (!confirm('确定要退出登录吗？')) return;
    AdminAPI.setToken(null);
    document.getElementById('login-page').classList.add('active');
    document.getElementById('admin-page').classList.remove('active');
    window.location.hash = '';
  });
}

function initNavigation() {
  // Handle sidebar nav clicks
  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const page = this.dataset.page;
      navigateTo(page);
    });
  });

  // Handle hash changes
  window.addEventListener('hashchange', function () {
    const page = getCurrentPage();
    if (page && PAGE_RENDERERS[page]) {
      updateActiveNav(page);
      PAGE_RENDERERS[page]();
    }
  });
}

function initRefresh() {
  document.getElementById('refresh-btn').addEventListener('click', function () {
    const page = getCurrentPage();
    if (page && PAGE_RENDERERS[page]) {
      PAGE_RENDERERS[page]();
    }
  });
}

function navigateTo(page) {
  if (!page || !PAGE_RENDERERS[page]) return;
  window.location.hash = page;
  updateActiveNav(page);
  PAGE_RENDERERS[page]();
}

function updateActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(function (item) {
    item.classList.toggle('active', item.dataset.page === page);
  });
}

function getCurrentPage() {
  const hash = window.location.hash.replace('#', '');
  return hash || 'dashboard';
}

function showAdmin() {
  document.getElementById('login-page').classList.remove('active');
  document.getElementById('admin-page').classList.add('active');
}

function updateAdminInfo(user) {
  const avatarEl = document.getElementById('admin-avatar');
  const nameEl = document.getElementById('admin-name');
  if (avatarEl) avatarEl.textContent = (user.nickname || user.email || 'A').charAt(0).toUpperCase();
  if (nameEl) nameEl.textContent = user.nickname || user.email || '管理员';
}
