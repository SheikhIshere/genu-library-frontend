const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

function getTokens() {
  if (typeof window === 'undefined') return null;
  const access = localStorage.getItem('access_token');
  const refresh = localStorage.getItem('refresh_token');
  if (!access) return null;
  return { access, refresh };
}

function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
}

function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/v1/api/users/get/access-token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    setTokens(data.access, refreshToken);
    return data.access;
  } catch { return null; }
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const tokens = getTokens();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };
  if (tokens?.access) {
    headers['Authorization'] = `Bearer ${tokens.access}`;
  }
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  let res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401 && tokens?.refresh) {
    const newAccess = await refreshAccessToken(tokens.refresh);
    if (newAccess) {
      headers['Authorization'] = `Bearer ${newAccess}`;
      res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    }
  }

  return res;
}

export async function apiJson<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, options);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '/placeholder-book.svg';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const auth = {
  login: async (email: string, password: string) => {
    const data = await apiJson<{ access: string; refresh: string; user?: Record<string, unknown> }>(
      '/v1/api/users/login/',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    );
    setTokens(data.access, data.refresh);
    return data;
  },
  register: async (email: string, password: string, password2: string) => {
    const data = await apiJson<{ access: string; refresh: string; user?: Record<string, unknown> }>(
      '/v1/api/users/register/',
      { method: 'POST', body: JSON.stringify({ email, password, password2 }) }
    );
    setTokens(data.access, data.refresh);
    return data;
  },
  logout: () => { clearTokens(); },
  isLoggedIn: () => typeof window !== 'undefined' && !!localStorage.getItem('access_token'),
};

export const books = {
  list: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiJson<Record<string, unknown>[]>(`/v1/api/books/${q}`);
  },
  detail: (slug: string) => apiJson<Record<string, unknown>>(`/v1/api/books/${slug}/`),
  create: (formData: FormData) => apiFetch('/v1/api/books/add/', { method: 'POST', body: formData }),
  update: (slug: string, formData: FormData) => apiFetch(`/v1/api/books/${slug}/edit/`, { method: 'PATCH', body: formData }),
  delete: (slug: string) => apiFetch(`/v1/api/books/${slug}/delete/`, { method: 'DELETE' }),
  favorite: (slug: string) => apiJson(`/v1/api/books/${slug}/favorite/`, { method: 'POST' }),
  comment: (slug: string, data: Record<string, string>) => apiJson(`/v1/api/books/${slug}/comment/`, { method: 'POST', body: JSON.stringify(data) }),
  rate: (slug: string, rating: number) => apiJson(`/v1/api/books/${slug}/rate/`, { method: 'POST', body: JSON.stringify({ rating }) }),
  addToPlaylist: (slug: string, data: Record<string, unknown>) => apiJson(`/v1/api/books/${slug}/add_to_playlist/`, { method: 'POST', body: JSON.stringify(data) }),
  report: (slug: string, data: Record<string, string>) => apiJson(`/v1/api/books/${slug}/report/`, { method: 'POST', body: JSON.stringify(data) }),
  suggestions: (q: string) => apiJson(`/v1/api/books/suggestions/?q=${encodeURIComponent(q)}`),
  home: () => apiJson<Record<string, unknown>>('/v1/api/books/home/'),
  featured: () => apiJson('/v1/api/books/featured/'),
  bulkUpload: (formData: FormData) => apiFetch('/v1/api/books/bulk-upload/', { method: 'POST', body: formData }),
  bulkTagUpload: (formData: FormData) => apiFetch('/v1/api/books/bulk-tag-upload/', { method: 'POST', body: formData }),
  addTag: (data: Record<string, string>) => apiJson('/v1/api/books/tag/add/', { method: 'POST', body: JSON.stringify(data) }),
  playlists: () => apiJson('/v1/api/books/playlists/'),
  playlistDetail: (slug: string) => apiJson(`/v1/api/books/playlists/${slug}/`),
  playlistCreate: (data: Record<string, unknown>) => apiJson('/v1/api/books/playlists/add/', { method: 'POST', body: JSON.stringify(data) }),
  playlistUpdate: (slug: string, data: Record<string, unknown>) => apiJson(`/v1/api/books/playlists/${slug}/edit/`, { method: 'PATCH', body: JSON.stringify(data) }),
};

export const profile = {
  list: () => apiJson('/v1/api/profile/list'),
  me: () => apiJson('/v1/api/profile/me/'),
  update: (formData: FormData) => apiFetch('/v1/api/profile/me/', { method: 'PATCH', body: formData }),
  detail: (username: string) => apiJson(`/v1/api/profile/${username}/`),
};
