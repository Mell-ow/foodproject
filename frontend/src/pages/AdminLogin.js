import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Hardcoded fallback for demonstration if API isn't seeded with an admin yet
    if (email === 'admin' && password === 'admin') {
      localStorage.setItem('zan_admin_token', 'demo-admin-token');
      toast.success('Demo Admin Authenticated');
      navigate('/admin/dashboard');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      if (res.data.user && res.data.user.role === 'admin') {
        localStorage.setItem('zan_admin_token', res.data.accessToken);
        toast.success('Welcome back, Admin');
        navigate('/admin/dashboard');
      } else {
        toast.error('Access Denied: You do not have admin privileges.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <ShieldCheck className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h1 className="text-4xl font-black text-white font-outfit tracking-tight">Zan Console</h1>
          <p className="text-gray-400 mt-2">Restricted Area. Authorized Personnel Only.</p>
        </div>

        <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Admin Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="admin@zancafe.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 text-white border border-gray-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${loading ? 'bg-primary-800 text-primary-200 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/30 active:scale-95'}`}
            >
              {loading ? 'Authenticating...' : <>Access Dashboard <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-500 mt-8">
          &copy; {new Date().getFullYear()} Zan Cafe Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
