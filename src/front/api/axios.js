import axios from 'axios';

const API = axios.create({
  baseURL: 'https://redesigned-space-system-r5p76rp757vfp99v-3001.app.github.dev/api',
});

// Si usas autenticación JWT
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token enviado:", token);
  } else {
    console.log("⛔ No hay token");
  }
  return config;
});


export default API;
