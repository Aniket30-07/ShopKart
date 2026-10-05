import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, error, fetchCart, updateQuantity, removeFromCart, totalItems, subtotal } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-xl text-gray-500 flex items-center gap-2">⏳ Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] gap-4">
          <p className="text-xl text-red-500 font-medium">Unable to load your cart.</p>
          <button onClick={fetchCart} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] gap-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Your cart is empty 🛒</h2>
          <p className="text-gray-500">Looks like you haven't added anything yet.</p>
          <button onClick={() => navigate('/products')} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" /> Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-6">
                <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{item.product.name}</h3>
                      <p className="text-sm text-gray-500 mb-1">{item.product.category}</p>
                      <p className={`text-xs font-medium ${item.product.stock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                        {item.product.stock} in stock
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="font-bold text-lg text-gray-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 mt-1">₹{item.product.price.toLocaleString('en-IN')} each</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-600 shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-gray-700 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded bg-white hover:bg-gray-100 disabled:opacity-50 text-gray-600 shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Total Items</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-md shadow-blue-200"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
