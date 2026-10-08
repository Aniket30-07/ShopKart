import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { ArrowRight, Mail, Phone, Award } from 'lucide-react';

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
      <div className="min-h-screen bg-brand-cream-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-green"></div>
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="min-h-screen bg-brand-cream-light font-sans relative">
      <Navbar />
      
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-cream to-transparent pointer-events-none -z-10"></div>

      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-24">
        
        {/* Greeting Section */}
        <div className="text-center md:text-left mb-16">
          <p className="text-sm font-bold tracking-widest text-brand-green/60 uppercase mb-3 flex items-center justify-center md:justify-start gap-2">
            <Award className="w-4 h-4 text-brand-green" /> Premium Member
          </p>
          <h1 className="text-5xl md:text-6xl font-serif text-brand-green-dark tracking-tight leading-tight">
            Welcome back, <br/>
            <span className="italic font-light">{customer.fullName}</span>
          </h1>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Start Shopping Card */}
          <div 
            onClick={() => navigate('/products')}
            className="group cursor-pointer bg-white rounded-3xl p-8 border border-[#e6e2d6] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all flex items-center justify-between"
          >
            <div>
              <h2 className="text-2xl font-serif text-brand-green-dark mb-1 group-hover:text-brand-green transition-colors">Start Shopping</h2>
              <p className="text-sm font-medium text-gray-500">Explore our latest products</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-cream border border-[#e6e2d6] flex items-center justify-center group-hover:bg-brand-green/5 group-hover:border-brand-green/20 transition-all">
              <ArrowRight className="w-5 h-5 text-brand-green" strokeWidth={1.5} />
            </div>
          </div>

          {/* My Orders Card */}
          <div 
            onClick={() => navigate('/orders')}
            className="group cursor-pointer bg-white rounded-3xl p-8 border border-[#e6e2d6] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all flex items-center justify-between"
          >
            <div>
              <h2 className="text-2xl font-serif text-brand-green-dark mb-1 group-hover:text-brand-green transition-colors">My Orders</h2>
              <p className="text-sm font-medium text-gray-500">Track your recent purchases</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-brand-cream border border-[#e6e2d6] flex items-center justify-center group-hover:bg-brand-green/5 group-hover:border-brand-green/20 transition-all">
              <ArrowRight className="w-5 h-5 text-brand-green" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="bg-white rounded-3xl p-8 border border-[#e6e2d6] shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h3 className="text-lg font-serif font-semibold text-brand-green-dark mb-6">Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-brand-green" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-1">Email Address</h4>
                <p className="text-[15px] font-medium text-gray-900">{customer.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-cream flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-brand-green" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-1">Phone Number</h4>
                <p className="text-[15px] font-medium text-gray-900">{customer.phone}</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Home;
