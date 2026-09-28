import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, AlertCircle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Something went wrong while loading the product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
           <div className="bg-red-50 border border-red-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600 mb-6">{error || 'Product not found.'}</p>
            <button 
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => navigate('/products')}
          className="mb-8 flex items-center text-gray-500 hover:text-blue-600 transition-colors font-medium group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden lg:flex">
          {/* Image Section */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-gray-50/50 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
             <div className="relative w-full aspect-square max-w-md mx-auto">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
                  }}
                />
             </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full mb-4">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-extrabold text-gray-900">
                   <span className="text-2xl text-gray-500 font-medium mr-1">₹</span>
                   {product.price.toLocaleString('en-IN')}
                </span>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                {product.description}
              </p>
            </div>

            <div className="mt-auto space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="flex items-center gap-3">
                   <div className={`w-3 h-3 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                   <span className="font-medium text-gray-700">
                     {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                   </span>
                 </div>
              </div>

              <button 
                disabled={product.stock === 0}
                className={`w-full py-4 rounded-2xl flex items-center justify-center text-lg font-semibold transition-all shadow-sm ${
                  product.stock > 0 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:shadow-md hover:-translate-y-0.5' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
               <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                 </div>
                 <span className="text-xs font-medium text-gray-600">1 Year Warranty</span>
               </div>
               <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-3">
                    <Truck className="w-5 h-5 text-green-600" />
                 </div>
                 <span className="text-xs font-medium text-gray-600">Free Delivery</span>
               </div>
               <div className="flex flex-col items-center text-center">
                 <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center mb-3">
                    <RefreshCw className="w-5 h-5 text-amber-600" />
                 </div>
                 <span className="text-xs font-medium text-gray-600">7 Days Return</span>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetails;
