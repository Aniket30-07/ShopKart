import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrders } from '../services/api';
import { Package, ArrowRight, Calendar, CreditCard, Box, ShoppingBag } from 'lucide-react';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream-light font-sans relative">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green mb-4"></div>
          <p className="text-brand-green/70 font-medium animate-pulse">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brand-cream-light font-sans relative">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-screen gap-6">
          <p className="text-xl text-red-500 font-serif font-semibold">{error}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-sm font-semibold">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream-light font-sans relative">
        <Navbar />
        
        {/* Background ambient gradient */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-cream to-transparent pointer-events-none -z-10"></div>

        <div className="flex flex-col justify-center items-center h-screen gap-4 text-center px-4">
          <div className="w-24 h-24 bg-brand-cream rounded-full flex items-center justify-center mb-4 border border-[#e6e2d6]">
            <Package className="w-10 h-10 text-brand-green/40" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-brand-green-dark">No orders yet</h2>
          <p className="text-brand-green/60 text-[15px] max-w-md mx-auto mb-6">You haven't placed any orders yet. Discover our collection and treat yourself.</p>
          <button onClick={() => navigate('/products')} className="px-8 py-4 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-green-dark transition-all flex items-center gap-2 shadow-sm hover:-translate-y-0.5">
            <ShoppingBag className="w-5 h-5" /> Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans relative">
      <Navbar />
      
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-brand-cream to-transparent pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
        
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green-dark tracking-tight flex flex-col md:flex-row items-center md:items-start justify-center md:justify-start gap-4">
            <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center border border-[#e6e2d6]">
              <Package className="w-7 h-7 text-brand-green" />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span>My Orders</span>
              <span className="text-[15px] font-sans font-medium text-brand-green/60 mt-1">
                {orders.length} {orders.length === 1 ? 'order' : 'orders'} history
              </span>
            </div>
          </h1>
        </div>
        
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#e6e2d6] overflow-hidden">
              {/* Order Header */}
              <div className="bg-[#f9f7f1] border-b border-[#e6e2d6]/50 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] font-bold text-brand-green tracking-widest uppercase mb-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Placed On
                    </p>
                    <p className="text-sm font-semibold text-brand-green-dark">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-brand-green tracking-widest uppercase mb-1 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" /> Total
                    </p>
                    <p className="text-sm font-semibold text-brand-green-dark">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end">
                  <p className="text-[10px] font-bold text-brand-green tracking-widest uppercase mb-1">Order ID</p>
                  <p className="text-sm font-mono font-medium text-gray-500">#{order._id.slice(-8)}</p>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-6 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                      order.status === 'DELIVERED' ? 'bg-brand-cream text-brand-green border-brand-green/20' :
                      order.status === 'FAILED' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-5">
                        <div className="w-24 h-24 bg-[#f9f7f1] rounded-[1rem] flex items-center justify-center overflow-hidden flex-shrink-0 border border-[#e6e2d6]/50">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 mix-blend-multiply" 
                              onError={(e) => e.target.style.display='none'} 
                            />
                          ) : (
                            <Box className="w-8 h-8 text-brand-green/20" />
                          )}
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="font-serif font-semibold text-lg text-brand-green-dark line-clamp-2">{item.name}</p>
                          <p className="text-sm font-medium text-gray-500 mt-1">₹{item.price.toLocaleString('en-IN')} <span className="text-gray-400 mx-1">×</span> {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-72 border-t md:border-t-0 md:border-l border-[#e6e2d6]/50 pt-6 md:pt-0 md:pl-8 flex flex-col">
                  <h3 className="text-[11px] font-bold text-brand-green tracking-widest uppercase mb-4">Shipping Address</h3>
                  <div className="text-[13px] text-gray-600 space-y-1.5 flex-1">
                    <p className="font-bold text-brand-green-dark text-sm mb-2">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p className="pt-3 font-medium flex items-center gap-2 text-gray-500">
                      <span className="w-6 h-6 rounded-full bg-brand-cream flex items-center justify-center">📞</span> 
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate(`/order-success/${order._id}`)}
                    className="mt-8 w-full py-3 bg-brand-cream text-brand-green text-[13px] font-bold tracking-widest uppercase rounded-xl transition-colors hover:bg-brand-green/10"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
