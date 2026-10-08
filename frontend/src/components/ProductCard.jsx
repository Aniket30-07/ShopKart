import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, IndianRupee, Heart, ShoppingCart } from 'lucide-react';
import { toggleWishlist } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, initialIsSaved = false }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingCart, setIsAddingCart] = useState(false);
  const [error, setError] = useState(null);
  const { cartItems, addToCart } = useCart();
  
  const inCart = cartItems.find(item => item.product._id === product._id);

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

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isAddingCart) return;
    setIsAddingCart(true);
    try {
      await addToCart(product._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add to cart');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsAddingCart(false);
    }
  };

  return (
    <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#e6e2d6] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 group">
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
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-4 right-4">
             <span className="px-3 py-1.5 bg-[#fdfcf9]/90 backdrop-blur-md text-[10px] font-bold text-[#c4923e] tracking-widest uppercase rounded-full shadow-sm border border-[#e6e2d6]/50">
               Only {product.stock} left
             </span>
          </div>
        )}
        {product.stock === 0 && (
           <div className="absolute top-4 right-4">
             <span className="px-3 py-1.5 bg-red-50/90 backdrop-blur-md text-[10px] font-bold text-red-700 tracking-widest uppercase rounded-full shadow-sm border border-red-100">
               Out of Stock
             </span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-serif font-semibold text-brand-green-dark line-clamp-1 mb-2 group-hover:text-brand-green transition-colors">
          {product.name}
        </h3>
        
        <div className="flex flex-col gap-2 mt-2">
          {error && <span className="text-xs text-red-500 text-center font-medium">{error}</span>}
          <button
            onClick={handleToggleWishlist}
            disabled={isLoading}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-[13px] border flex items-center justify-center gap-2 transition-all ${
              isSaved 
                ? 'bg-brand-cream-light text-brand-green border-brand-green/20 hover:bg-brand-cream' 
                : 'bg-white text-gray-500 border-[#e6e2d6] hover:bg-brand-cream-light hover:text-brand-green'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">⏳ Saving...</span>
            ) : isSaved ? (
              <span className="flex items-center gap-2 text-brand-green"><Heart className="h-4 w-4 fill-brand-green text-brand-green" /> Remove</span>
            ) : (
              <span className="flex items-center gap-2"><Heart className="h-4 w-4" /> Add to Wishlist</span>
            )}
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={isAddingCart || product.stock === 0}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-[13px] border flex items-center justify-center gap-2 transition-all ${
              product.stock === 0 ? 'bg-gray-50 text-gray-400 border-[#e6e2d6] cursor-not-allowed' :
              inCart ? 'bg-brand-cream-light text-brand-green border-brand-green/20 hover:bg-brand-cream' : 'bg-brand-green text-white border-brand-green hover:bg-brand-green-dark shadow-sm'
            }`}
          >
            {isAddingCart ? (
              <span className="flex items-center gap-2">⏳ Adding...</span>
            ) : inCart ? (
              <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Added</span>
            ) : (
              <span className="flex items-center gap-2"><ShoppingCart className="h-4 w-4" /> Add to Cart</span>
            )}
          </button>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#e6e2d6]/50">
          <div className="flex items-center text-2xl font-serif font-bold text-brand-green-dark">
            <span className="text-sm font-sans font-medium text-brand-green/60 mr-1">₹</span>
            {product.price.toLocaleString('en-IN')}
          </div>
          
          <button
            onClick={() => navigate(`/products/${product._id}`)}
            className="px-5 py-2.5 bg-brand-cream text-brand-green text-[13px] font-bold tracking-wide uppercase rounded-xl transition-colors hover:bg-brand-green/10"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
