import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Heart } from 'lucide-react';
import api, { getWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const { totalItems } = useCart();

  const fetchWishlistCount = async () => {
    try {
      const data = await getWishlist();
      if (data.success) {
        setWishlistCount(data.count);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist count:', error);
    }
  };

  useEffect(() => {
    fetchWishlistCount();

    const handleWishlistChange = () => {
      fetchWishlistCount();
    };

    window.addEventListener('wishlistChanged', handleWishlistChange);
    return () => window.removeEventListener('wishlistChanged', handleWishlistChange);
  }, []);

  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
            <ShoppingCart className="h-8 w-8 text-blue-600" />
            <span className="font-bold text-2xl tracking-tight text-gray-900">ShopKart</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Products
            </Link>
            <Link to="/wishlist" className="flex items-center gap-1 text-gray-600 hover:text-red-600 font-medium transition-colors">
              <Heart className="h-5 w-5" />
              <span>Wishlist {wishlistCount > 0 && `(${wishlistCount})`}</span>
            </Link>
            <Link to="/cart" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
              <ShoppingCart className="h-5 w-5" />
              <span>Cart {totalItems > 0 && `(${totalItems})`}</span>
            </Link>
            <Link to="/orders" className="flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium transition-colors">
              <span>Orders</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
