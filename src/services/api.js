/**
 * Frontend API Service
 * Handles all communication with the backend
 */

const API_BASE = '/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  async request(method, path, body) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (this.token) {
      opts.headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (body !== undefined) {
      opts.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${path}`, opts);

    // Handle 401 - redirect to login
    if (res.status === 401) {
      this.setToken(null);
      window.location.href = '/login';
      throw new Error('登录已过期，请重新登录');
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || data.error || '请求失败');
    }

    return data;
  }

  get(path) { return this.request('GET', path); }
  post(path, body) { return this.request('POST', path, body); }
  put(path, body) { return this.request('PUT', path, body); }
  del(path) { return this.request('DELETE', path); }

  // ===== Home =====
  getHome() { return this.get('/home'); }

  // ===== Animes (public) =====
  getLatestReleases(page = 1, limit = 20) {
    return this.get(`/latest-releases?page=${page}&limit=${limit}`);
  }
  getRecentlyAdded(page = 1, limit = 20) {
    return this.get(`/recently-added?page=${page}&limit=${limit}`);
  }
  getAnimeSeries(page = 1, limit = 20) {
    return this.get(`/anime-series?page=${page}&limit=${limit}`);
  }
  getTrending(page = 1, limit = 20) {
    return this.get(`/trending?page=${page}&limit=${limit}`);
  }
  getAnime(id) { return this.get(`/anime/${id}`); }

  // ===== Search =====
  search(q, page = 1, limit = 20) {
    return this.get(`/search?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
  }

  // ===== Auth =====
  register(email, password, nickname) {
    return this.post('/auth/register', { email, password, nickname });
  }
  login(email, password) {
    return this.post('/auth/login', { email, password });
  }

  // ===== User Profile =====
  getProfile() { return this.get('/user/profile'); }
  updateProfile(data) { return this.put('/user/profile', data); }

  // ===== User List =====
  getUserList() { return this.get('/user/list'); }
  addToList(animeId) { return this.post('/user/list', { anime_id: animeId }); }
  removeFromList(animeId) { return this.del(`/user/list/${animeId}`); }
}

const api = new ApiService();
export default api;
