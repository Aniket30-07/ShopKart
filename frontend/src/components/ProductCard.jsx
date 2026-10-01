import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, IndianRupee, Heart } from 'lucide-react';
import { toggleWishlist } from '../services/api';

const ProductCard = ({ product, initialIsSaved = false }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep in sync if initialIsSaved changes
  useEffect(() => {
    setIsSaved(initialIsSaved);
  }, [initialIsSaved]);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await toggleWishlist(product._id);
      if (data.success) {
        setIsSaved(data.saved);
        window.dispatchEvent(new Event('wishlistChanged'));
      } else {
        setError('Failed to save');
      }
    } catch (err) {
      setError('Failed to save');
    } finally {
      setIsLoading(false);
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        {/* Using a placeholder aesthetic in case image is missing or invalid, though it's required */}
        <img 
          src={product.image} 
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'; // Fallback aesthetic image
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-4 right-4">
             <span className="px-3 py-1 bg-orange-100/90 backdrop-blur-sm text-xs font-semibold text-orange-700 rounded-full shadow-sm border border-orange-200">
               Only {product.stock} left!
             </span>
          </div>
        )}
        {product.stock === 0 && (
           <div className="absolute top-4 right-4">
             <span className="px-3 py-1 bg-red-100/90 backdrop-blur-sm text-xs font-semibold text-red-700 rounded-full shadow-sm border border-red-200">
               Out of Stock
             </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <div className="flex flex-col gap-2 mt-2">
          {error && <span className="text-xs text-red-500 text-center">{error}</span>}
          <button
            onClick={handleToggleWishlist}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-xl font-medium text-sm border flex items-center justify-center gap-2 transition-colors ${
              isSaved 
                ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">⏳ Saving...</span>
            ) : isSaved ? (
              <span className="flex items-center gap-2">♥ Remove from Wishlist</span>
            ) : (
              <span className="flex items-center gap-2">♡ Add to Wishlist</span>
            )}
          </button>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
          <div className="flex items-center text-2xl font-bold text-gray-900">
            <span className="text-sm text-gray-500 font-normal mr-1">₹</span>
            {product.price.toLocaleString('en-IN')}
          </div>
          
          <button
            onClick={() => navigate(`/products/${product._id}`)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-blue-200"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
