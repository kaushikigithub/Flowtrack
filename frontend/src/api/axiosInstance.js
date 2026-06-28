import axios from 'axios';

// One central place that knows where our backend lives
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This runs automatically BEFORE every single request sent through axiosInstance
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;