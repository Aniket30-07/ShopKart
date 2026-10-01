import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Update this if your backend port is different
  withCredentials: true, // This is crucial for sending and receiving HttpOnly cookies
});

export const getProducts = async (params) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export const toggleWishlist = async (productId) => {
  const response = await api.patch(`/wishlist/${productId}/toggle`);
  return response.data;
};

export default api;
