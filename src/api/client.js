const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('lmb_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  if (response.status === 204) {
    return {};
  }

  return response.json();
};
