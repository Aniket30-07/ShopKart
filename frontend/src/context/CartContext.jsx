import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCart, addToCart as apiAddToCart, updateCartQuantity, removeFromCart as apiRemoveFromCart } from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCart();
      if (data.success) {
        setCartItems(data.cart);
      } else {
        setError('Failed to fetch cart');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cart');
      if (err.response?.status === 401) {
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId) => {
    try {
      const data = await apiAddToCart(productId);
      if (data.success) {
        setCartItems(data.cart);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const data = await updateCartQuantity(productId, quantity);
      if (data.success) {
        setCartItems(data.cart);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const data = await apiRemoveFromCart(productId);
      if (data.success) {
        setCartItems(data.cart);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
