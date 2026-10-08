import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Update this if your backend port is different
  withCredentials: true, // This is crucial for sending and receiving HttpOnly cookies
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Avoid redirecting if the 401 came from a login attempt itself
      if (error.config && !error.config.url.includes('/customers/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

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

export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId) => {
  const response = await api.post(`/cart/${productId}`);
  return response.data;
};

export const updateCartQuantity = async (productId, quantity) => {
  const response = await api.patch(`/cart/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

export const createPaymentOrder = async (shippingAddress) => {
  const response = await api.post('/orders/create-payment-order', { shippingAddress });
  return response.data;
};

export const verifyPayment = async (paymentData) => {
  const response = await api.post('/orders/verify-payment', paymentData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrder = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export default api;
