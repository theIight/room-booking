import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    Accept: 'application/json',
  },
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('booking_auth')
      setAuthToken(null)
      window.dispatchEvent(new Event('auth:expired'))
    }

    return Promise.reject(error)
  },
)

const storedAuth = JSON.parse(localStorage.getItem('booking_auth') || 'null')
setAuthToken(storedAuth?.token)

export default api
