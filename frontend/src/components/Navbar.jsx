import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Leaf } from 'lucide-react';
import { getWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [wishlistCount, setWishlistCount] = useState(0);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const fetchWishlistCount = async () => {
    if (!user) return; // Only fetch if logged in
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
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="max-w-7xl mx-auto bg-brand-cream border border-gray-200/50 shadow-sm rounded-full px-6 py-3 transition-all duration-300 flex justify-between items-center">
        
        {/* Left: Logo */}
        <div 
          className="flex-shrink-0 flex items-center gap-2 cursor-pointer text-brand-green" 
          onClick={() => navigate('/home')}
        >
          <Leaf className="h-6 w-6" strokeWidth={2.5} />
          <span className="font-serif font-bold text-xl tracking-wide uppercase">ShopKart</span>
        </div>

        {/* Right: Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/products" className="text-xs font-semibold tracking-widest uppercase text-brand-green hover:text-brand-green-dark transition-colors">
            Shop
          </Link>

          {user && (
            <>
              <Link to="/wishlist" className="text-xs font-semibold tracking-widest uppercase text-brand-green hover:text-brand-green-dark transition-colors">
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link to="/orders" className="text-xs font-semibold tracking-widest uppercase text-brand-green hover:text-brand-green-dark transition-colors">
                Orders
              </Link>
            </>
          )}

          {/* Vertical Divider */}
          <div className="h-4 w-px bg-brand-green/20"></div>

          <Link to="/cart" className="relative text-brand-green hover:text-brand-green-dark transition-colors flex items-center">
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-green text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="text-xs font-semibold tracking-widest uppercase text-brand-green hover:text-brand-green-dark transition-colors bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-xs font-semibold tracking-widest uppercase text-brand-green hover:text-brand-green-dark transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-xs font-semibold tracking-widest uppercase text-brand-green hover:text-brand-green-dark transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
