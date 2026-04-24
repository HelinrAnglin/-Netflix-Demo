const AdminAPI = {
  baseURL: '/api',

  getToken() {
    return localStorage.getItem('admin_token');
  },

  setToken(token) {
    if (token) localStorage.setItem('admin_token', token);
    else localStorage.removeItem('admin_token');
  },

  async request(method, path, body) {
    const token = this.getToken();
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    }
    if (body !== undefined) {
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(this.baseURL + path, opts);

    // Always try to parse JSON body first, even for error responses
    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try { data = await res.json(); } catch (e) { /* ignore parse errors */ }
    }

    if (res.status === 401) {
      this.setToken(null);
      window.location.hash = '';
      document.getElementById('login-page').classList.add('active');
      document.getElementById('admin-page').classList.remove('active');
      throw new Error(data?.message || data?.error || '未授权，请重新登录');
    }

    if (!res.ok) throw new Error(data?.message || data?.error || '请求失败');
    return data;
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body) { return this.request('PUT', path, body); },
  del(path) { return this.request('DELETE', path); },

  // Auth
  login(email, password) {
    return this.post('/auth/login', { email, password });
  },

  // Dashboard
  getStats() { return this.get('/admin/stats'); },

  // Animes
  getAnimes(page = 1) { return this.get(`/admin/animes?page=${page}&limit=50`); },
  getAnime(id) { return this.get(`/admin/animes/${id}`); },
  createAnime(data) { return this.post('/admin/animes', data); },
  updateAnime(id, data) { return this.put(`/admin/animes/${id}`, data); },
  deleteAnime(id) { return this.del(`/admin/animes/${id}`); },

  // Episodes
  getEpisodes(animeId) { return this.get(`/admin/episodes?anime_id=${animeId}`); },
  createEpisode(data) { return this.post('/admin/episodes', data); },
  updateEpisode(id, data) { return this.put(`/admin/episodes/${id}`, data); },
  deleteEpisode(id) { return this.del(`/admin/episodes/${id}`); },

  // Banners
  getBanners() { return this.get('/admin/banners'); },
  updateBanner(id, data) { return this.put(`/admin/banners/${id}`, data); },

  // Users
  getUsers(page = 1) { return this.get(`/admin/users?page=${page}&limit=50`); },
  updateUser(id, data) { return this.put(`/admin/users/${id}`, data); },
  deleteUser(id) { return this.del(`/admin/users/${id}`); },
};
