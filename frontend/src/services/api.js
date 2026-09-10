import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Update this if your backend port is different
  withCredentials: true, // This is crucial for sending and receiving HttpOnly cookies
});

export default api;
