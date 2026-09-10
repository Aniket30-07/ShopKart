import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, Award } from 'lucide-react';

const Home = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/customers/me');
        setCustomer(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/login'); // Redirect to login if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          
          <div className="relative px-6 pb-8">
            <div className="flex items-center justify-center -mt-16">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome back, {customer.fullName}!
              </h1>
              <p className="text-gray-500 mt-2 flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Premium Member
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{customer.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex items-start gap-4 transition-all hover:shadow-md">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{customer.phone}</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
