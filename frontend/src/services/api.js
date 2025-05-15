import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
});

// Intercept requests to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on auth error
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;