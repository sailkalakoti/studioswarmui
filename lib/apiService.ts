import axios from 'axios';

// Create an Axios instance
const isProduction = process.env.NODE_ENV === 'production';

const axiosInstance = axios.create({
  baseURL: isProduction ? 'http://178.156.143.254:8001/studioswarm' : 'http://178.156.143.254:8001/studioswarm',
});

// Request interceptor to add the token to headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('swarm_token'); // Or wherever you store your token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error?.request?.responseURL;
    if (error.response && (error.response.status === 401) && !url.includes('/auth/signin')) {
      // Redirect to login page or handle token refresh
      window.location.href = '/login'; // Or use a history push in React Router
      // login();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;