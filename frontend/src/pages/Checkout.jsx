import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { createPaymentOrder, verifyPayment } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalItems, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      navigate('/cart');
    }
  }, [cartItems, loading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
      setError("Please fill all the required fields.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits.");
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      setError("Pincode must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load Razorpay. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // 1. Create Order on Backend
      const orderData = await createPaymentOrder(formData);
      
      if (!orderData.success) {
        setError(orderData.message || "Failed to create order");
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "ShopKart",
        description: "ShopKart Order Checkout",
        order_id: orderData.razorpayOrderId,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verificationData = await verifyPayment({
              shopKartOrderId: orderData.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationData.success) {
              clearCart();
              navigate(`/order-success/${orderData.shopKartOrderId}`);
            } else {
              setError("Payment verification failed.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            setError(err.response?.data?.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: formData.fullName,
          contact: formData.phone
        },
        theme: {
          color: "#2563eb" // blue-600
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response) {
        console.error("Payment failed", response.error);
        setError(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();

    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.response?.data?.message || "Failed to process checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Details</h2>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input type="text" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.product._id} className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</span>
                      <span className="text-xs text-gray-500">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                  <span>Total</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all shadow-md shadow-blue-200 disabled:bg-gray-400 disabled:shadow-none"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
