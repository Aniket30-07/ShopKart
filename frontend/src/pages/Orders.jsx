import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrders } from '../services/api';
import { Package, ArrowRight, Calendar, CreditCard, Box } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-xl text-gray-500 flex items-center gap-2">⏳ Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] gap-4">
          <p className="text-xl text-red-500 font-medium">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] gap-4 text-center">
          <Package className="w-20 h-20 text-gray-300" />
          <h2 className="text-3xl font-bold text-gray-800">No orders yet</h2>
          <p className="text-gray-500">You haven't placed any orders.</p>
          <button onClick={() => navigate('/products')} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            Start Shopping <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gray-50 border-b border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Order Placed</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Total</p>
                    <p className="text-sm font-semibold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Order #</p>
                  <p className="text-sm font-mono text-gray-600">{order._id}</p>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-4 sm:p-6 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" 
                              onError={(e) => e.target.style.display='none'} 
                            />
                          ) : (
                            <Box className="w-8 h-8 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1">₹{item.price.toLocaleString('en-IN')} x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping Address</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.addressLine1}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p className="pt-2 flex items-center gap-1">📞 {order.shippingAddress.phone}</p>
                  </div>
                  <button 
                    onClick={() => navigate(`/order-success/${order._id}`)}
                    className="mt-6 w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition text-sm"
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
