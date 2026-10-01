import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getWishlist, toggleWishlist } from '../services/api';
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
            <Heart className="w-10 h-10 text-red-500 fill-red-500" />
            My Wishlist
          </h1>
          {!loading && !error && (
             <p className="mt-4 text-lg text-gray-500 max-w-2xl">
               {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
             </p>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 flex flex-col items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
             <p className="text-gray-500 font-medium animate-pulse">Loading your wishlist...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong.</h3>
            <p className="text-red-600 mb-6 whitespace-pre-line">{error}</p>
            <button 
              onClick={fetchWishlist}
              className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors shadow-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-16 flex flex-col items-center justify-center text-center">
             <div className="text-6xl mb-6">❤️</div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
             <p className="text-gray-500 max-w-md mx-auto mb-8 whitespace-pre-line">
               Save products you love and
               find them here later.
             </p>
             <button 
                onClick={() => navigate('/products')}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
             </button>
          </div>
        )}

        {/* Wishlist Items */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map(product => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
                <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'; 
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full shadow-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="mt-auto pt-4 flex flex-col gap-3 border-t border-gray-50">
                    <div className="flex items-center text-2xl font-bold text-gray-900 mb-2">
                      <span className="text-sm text-gray-500 font-normal mr-1">₹</span>
                      {product.price?.toLocaleString('en-IN') || 0}
                    </div>
                    
                    <button
                      onClick={() => navigate(`/products/${product._id}`)}
                      className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-medium rounded-xl transition-colors border border-gray-200"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-xl transition-colors border border-red-200"
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
