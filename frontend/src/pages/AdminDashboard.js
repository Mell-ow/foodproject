import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, CalendarDays, Utensils, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
     { id: 'overview', label: 'Overview', icon: LayoutDashboard },
     { id: 'orders', label: 'Order Board', icon: ShoppingCart },
     { id: 'reservations', label: 'Reservations', icon: CalendarDays },
     { id: 'menu', label: 'Menu Manager', icon: Utensils },
     { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6">
           <h2 className="text-2xl font-bold font-outfit text-primary-500">Zan Admin</h2>
           <p className="text-xs text-gray-400 mt-1">Management Console</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
           {menuItems.map(item => {
             const Icon = item.icon;
             return (
               <button 
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === item.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
               >
                 <Icon className="w-5 h-5" /> {item.label}
               </button>
             )
           })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 animate-fade-in">
         <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 font-outfit capitalize">{activeTab.replace('-', ' ')}</h1>
            <div className="flex items-center gap-4">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> System Online</span>
            </div>
         </div>

         {/* Overview Tab content stub */}
         {activeTab === 'overview' && (
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Today's Revenue</p>
                <p className="text-3xl font-black text-gray-900">$1,245.50</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Active Orders</p>
                <p className="text-3xl font-black text-primary-600">12</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Reservations</p>
                <p className="text-3xl font-black text-blue-600">8</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">New Customers</p>
                <p className="text-3xl font-black text-green-600">24</p>
              </div>
           </div>
         )}

         {/* Others logic... */}
         {activeTab !== 'overview' && (
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-96 flex items-center justify-center text-gray-400">
              {activeTab} module implementation is pending.
           </div>
         )}
      </div>

    </div>
  );
};

export default AdminDashboard;
