import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrder } from '../services/api';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id);
        if (data.success) {
          setOrder(data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching order details');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-xl text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)] gap-4">
          <p className="text-xl text-red-500 font-medium">{error || 'Order not found'}</p>
          <button onClick={() => navigate('/products')} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-24 h-24 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-lg mx-auto text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-semibold text-gray-900">{order._id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Total Amount:</span>
            <span className="font-semibold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Payment Status:</span>
            <span className="font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">{order.paymentStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Order Status:</span>
            <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{order.status}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => navigate('/orders')} className="px-8 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition">
            View My Orders
          </button>
          <button onClick={() => navigate('/products')} className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2">
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
