const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
  } catch (error) {
    throw new Error('API server is not running. Restart with npm run dev and try again.');
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Request failed.');
    error.status = response.status;
    error.errors = data.errors || {};
    throw error;
  }
  return data;
}

export const api = {
  getMe: () => request('/auth/me'),
  signup: (payload) => request('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getEvents: (params = {}) => request(`/events?${new URLSearchParams(params).toString()}`),
  getEvent: (id) => request(`/events/${id}`),
  createEvent: (payload) => request('/events', { method: 'POST', body: JSON.stringify(payload) }),
  updateEvent: (id, payload) => request(`/events/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  rsvp: (id) => request(`/events/${id}/rsvp`, { method: 'POST' }),
  cancelRsvp: (id) => request(`/events/${id}/rsvp`, { method: 'DELETE' }),
  getDashboard: () => request('/events/dashboard'),
  updateProfile: (payload) => request('/users/profile', { method: 'PUT', body: JSON.stringify(payload) })
};
