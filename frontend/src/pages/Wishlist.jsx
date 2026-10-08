import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getWishlist } from '../services/api';
import { Heart, AlertCircle, ShoppingBag } from 'lucide-react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWishlist();
      if (data.success) {
        setWishlist(data.wishlist);
      } else {
        setError('Failed to load wishlist.');
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Something went wrong.\nWe couldn\'t load your wishlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    
    const handleWishlistChange = () => {
      fetchWishlist();
    };
    window.addEventListener('wishlistChanged', handleWishlistChange);
    return () => window.removeEventListener('wishlistChanged', handleWishlistChange);
  }, []);

  const handleRemove = async (productId) => {
    try {
      // Optimistic update
      const prevWishlist = [...wishlist];
      setWishlist(wishlist.filter(item => item._id !== productId));
      
      const data = await toggleWishlist(productId);
      if (!data.success) {
        // Revert on failure
        setWishlist(prevWishlist);
      } else {
        window.dispatchEvent(new Event('wishlistChanged'));
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      fetchWishlist();
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans relative">
      <Navbar />
      
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-cream to-transparent pointer-events-none -z-10"></div>

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-dark tracking-tight flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4">
            <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center border border-[#e6e2d6]">
              <Heart className="w-7 h-7 text-brand-green fill-brand-green" />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span>My Wishlist</span>
              {!loading && !error && (
                <span className="text-[15px] font-sans font-medium text-brand-green/60 mt-1">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                </span>
              )}
            </div>
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mb-4"></div>
             <p className="text-brand-green/70 font-medium animate-pulse">Loading your wishlist...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-8 whitespace-pre-line text-sm">{error}</p>
            <button 
              onClick={fetchWishlist}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="bg-white border border-[#e6e2d6] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[2rem] p-16 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-brand-green/40" />
             </div>
             <h3 className="text-3xl font-serif font-bold text-brand-green-dark mb-3">Your wishlist is empty</h3>
             <p className="text-brand-green/60 max-w-md mx-auto mb-10 whitespace-pre-line text-[15px]">
               Save products you love and find them here later.
             </p>
             <button 
                onClick={() => navigate('/products')}
                className="px-8 py-4 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-green-dark transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
             </button>
          </div>
        )}

        {/* Wishlist Items */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map(product => (
              <div key={product._id} className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#e6e2d6] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 group">
                <div className="relative h-64 overflow-hidden bg-[#f9f7f1] flex items-center justify-center p-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-[10px] font-bold text-brand-green tracking-widest uppercase rounded-full shadow-sm border border-[#e6e2d6]/50">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-serif font-semibold text-brand-green-dark line-clamp-1 mb-2 group-hover:text-brand-green transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-6 flex flex-col gap-3 border-t border-[#e6e2d6]/50">
                    <div className="flex items-center text-2xl font-serif font-bold text-brand-green-dark mb-2">
                      <span className="text-sm font-sans font-medium text-brand-green/60 mr-1">₹</span>
                      {product.price?.toLocaleString('en-IN') || 0}
                    </div>
                    
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="w-full py-2.5 bg-brand-cream text-brand-green text-[13px] font-bold tracking-widest uppercase rounded-xl transition-colors hover:bg-brand-green/10"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="w-full py-2.5 bg-white border border-[#e6e2d6] text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-[13px] font-bold tracking-widest uppercase rounded-xl transition-colors"
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
