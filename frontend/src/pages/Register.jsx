import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const { checkAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
      setError('All fields are mandatory');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/customers/register', formData);
      if (response.data.success) {
        await checkAuth(); // Refresh user state
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream-light flex flex-col font-sans relative">
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="w-full max-w-[420px] bg-gradient-to-b from-[#f9f7f1] to-[#f4f1e8] rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e6e2d6] relative overflow-hidden">
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-green/10 via-brand-green/30 to-brand-green/10"></div>
          
          <div className="text-center mb-10 mt-2">
            <h2 className="text-[2.75rem] leading-tight text-brand-green-dark mb-3 flex flex-col items-center justify-center">
              <span className="font-serif font-bold tracking-tight">Create</span>
              <span className="font-serif italic font-medium -mt-2">Account</span>
            </h2>
            <p className="text-[13px] text-brand-green/60 tracking-wide font-medium">
              Join us to discover quality products
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl flex items-start gap-3 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <p className="text-[13px] text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-[10px] font-bold text-brand-green tracking-[0.2em] uppercase ml-1">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="block w-full px-5 py-4 bg-white/70 border border-[#e6e2d6] rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:bg-white text-[15px] transition-all placeholder:text-gray-400 outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-bold text-brand-green tracking-[0.2em] uppercase ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-5 py-4 bg-white/70 border border-[#e6e2d6] rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:bg-white text-[15px] transition-all placeholder:text-gray-400 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-bold text-brand-green tracking-[0.2em] uppercase ml-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-5 py-4 bg-white/70 border border-[#e6e2d6] rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:bg-white text-[15px] transition-all placeholder:text-gray-400 outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-[10px] font-bold text-brand-green tracking-[0.2em] uppercase ml-1">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-5 py-4 bg-white/70 border border-[#e6e2d6] rounded-xl focus:ring-1 focus:ring-brand-green focus:border-brand-green focus:bg-white text-[15px] transition-all placeholder:text-gray-400 outline-none"
                placeholder="+1 (555) 987-6543"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-[15px] font-semibold text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green focus:ring-offset-[#f4f1e8] transition-all disabled:opacity-70 mt-10 active:scale-[0.98]"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-10 text-center text-[13px] text-brand-green/70">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-green hover:text-brand-green-dark underline underline-offset-[5px] decoration-2 decoration-brand-green/30 hover:decoration-brand-green transition-all">
              Sign in now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
