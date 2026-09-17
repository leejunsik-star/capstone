import axios from 'axios';

// Toggle between Mock storage and real Spring Boot REST API
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Standard Axios Instance for Java Spring Boot REST API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dropick_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth errors & API responses
api.interceptors.response.use(
  (response) => {
    // If backend returns standard ApiResponse { success, message, data }
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      if (response.data.success === false) {
        return Promise.reject(new Error(response.data.message || '요청 처리에 실패했습니다.'));
      }
      return response.data.data !== undefined ? response.data.data : response.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - session expired');
    }
    const msg = error.response?.data?.message || error.message || '네트워크 통신 중 오류가 발생했습니다.';
    return Promise.reject(new Error(msg));
  }
);

export default api;
