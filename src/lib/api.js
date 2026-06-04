const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    err.errors = data.errors
    throw err
  }
  return data
}

// ── Contact ──────────────────────────────────────────────────────────────
export const submitContact = (body) =>
  request('/api/contact', { method: 'POST', body: JSON.stringify(body) })

// ── Membership ────────────────────────────────────────────────────────────
export const submitMembership = (body) =>
  request('/api/membership', { method: 'POST', body: JSON.stringify(body) })

// ── Newsletter ────────────────────────────────────────────────────────────
export const subscribeNewsletter = (body) =>
  request('/api/newsletter', { method: 'POST', body: JSON.stringify(body) })

export const unsubscribeNewsletter = (email) =>
  request('/api/newsletter/unsubscribe', { method: 'POST', body: JSON.stringify({ email }) })

// ── Classes ───────────────────────────────────────────────────────────────
export const fetchClasses = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return request(`/api/classes${query ? '?' + query : ''}`)
}

// ── Trainers ──────────────────────────────────────────────────────────────
export const fetchTrainers = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return request(`/api/trainers${query ? '?' + query : ''}`)
}

// ── Health ────────────────────────────────────────────────────────────────
export const checkHealth = () => request('/health')
