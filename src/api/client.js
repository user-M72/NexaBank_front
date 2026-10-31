import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Request interceptor — attach access token
client.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — auto refresh on 401
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

client.interceptors.response.use(
  res => res,
  async error => {
    const orig = error.config

    if (error.response?.status === 401 && !orig._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          orig.headers.Authorization = `Bearer ${token}`
          return client(orig)
        })
      }

      orig._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post('/api/auth/v1/refresh', null, {
          headers: { 'Refresh-Token': refreshToken }
        })
        localStorage.setItem('accessToken', data.accessToken)
        localStorage.setItem('refreshToken', data.refreshToken)
        client.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`
        orig.headers.Authorization = `Bearer ${data.accessToken}`
        processQueue(null, data.accessToken)
        return client(orig)
      } catch (err) {
        processQueue(err, null)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

// --- Auth ---
export const authApi = {
  login: data => client.post('/auth/v1/login', data),
  register: data => client.post('/auth/v1/register', data)
}

// --- User / Profile ---
export const userApi = {
  getMe: () => client.get('/user/v1/me'),
  updateMe: data => client.put('/user/v1/me/update', data),
  changePassword: data => client.patch('/user/v1/me/password', data)
}

// --- Accounts ---
export const accountApi = {
  getMyAccounts: () => client.get('/account/v1/my'),
  getAccount: id => client.get(`/account/v1/${id}`),
  create: data => client.post('/account/v1/create', data),
  block: id => client.patch(`/account/v1/${id}/block`)
}

// --- Cards ---
export const cardApi = {
  getMyCards: () => client.get('/card/v1/my'),
  create: data => client.post('/card/v1/create', data),
  block: id => client.patch(`/card/v1/${id}/block`),
  unblock: id => client.patch(`/card/v1/${id}/unBlock`)
}

// --- Transactions ---
export const transactionApi = {
  transfer: data => client.post('/transaction/v1/transfer', data),
  deposit: data => client.post('/transaction/v1/deposit', data),
  getHistory: () => client.get('/transaction/v1/history')
}

export default client
