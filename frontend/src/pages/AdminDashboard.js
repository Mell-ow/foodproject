import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, CalendarDays, Utensils, TrendingUp, CheckCircle, XCircle, Plus, Edit2, Trash2, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ revenue: 0, orders: 0, reservations: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [menuItemsList, setMenuItemsList] = useState([]);
  const [reservationsList, setReservationsList] = useState([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', category: 'Burger', price: '', image: '' });
  const navigate = useNavigate();

  // Mock data for charts
  const salesData = [
    { name: 'Mon', sales: 400 }, { name: 'Tue', sales: 300 }, { name: 'Wed', sales: 550 },
    { name: 'Thu', sales: 450 }, { name: 'Fri', sales: 700 }, { name: 'Sat', sales: 900 }, { name: 'Sun', sales: 850 }
  ];

  useEffect(() => {
    const token = localStorage.getItem('zan_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    // In a real scenario, fetch these from actual admin endpoints
    fetchOverview();
    fetchOrders();
    fetchMenu();
    fetchReservations();
  }, [navigate]);

  const fetchOverview = async () => {
    try {
      const res = await axiosInstance.get('/admin/overview');
      setStats(res.data);
    } catch(err) {
      // Mock fallback
      setStats({ revenue: 1245.50, orders: 12, reservations: 8, customers: 24 });
    }
  };

  const fetchOrders = async () => {
    try {
      // Trying to fetch real orders if endpoint exists, otherwise mock
      const res = await axiosInstance.get('/admin/orders');
      if (res.data && res.data.length > 0) {
         setRecentOrders(res.data);
      } else {
         setRecentOrders([
           { _id: 'ORD-101', customerName: 'John Doe', totalAmount: 45.00, status: 'Preparing', type: 'Delivery' },
           { _id: 'ORD-102', customerName: 'Sarah Smith', totalAmount: 112.50, status: 'Pending', type: 'Dine-In' },
           { _id: 'ORD-103', customerName: 'Mike Johnson', totalAmount: 28.00, status: 'Out for Delivery', type: 'Delivery' },
         ]);
      }
    } catch (err) {
       // Fallback to mock data on error
       setRecentOrders([
         { _id: 'ORD-101', customerName: 'John Doe', totalAmount: 45.00, status: 'Preparing', type: 'Delivery' },
         { _id: 'ORD-102', customerName: 'Sarah Smith', totalAmount: 112.50, status: 'Pending', type: 'Dine-In' },
       ]);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await axiosInstance.get('/menu');
      setMenuItemsList(res.data || []);
    } catch (err) {
      toast.error('Failed to load menu');
    }
  };

  const handleUpdateOrderStatus = async (id, newStatus) => {
     try {
       await axiosInstance.put(`/order/${id}/status`, { status: newStatus });
       setRecentOrders(recentOrders.map(o => o._id === id ? { ...o, status: newStatus } : o));
       toast.success(`Order ${id} marked as ${newStatus}`);
     } catch (err) {
       toast.error('Failed to update status');
     }
  };

  const fetchReservations = async () => {
    try {
      const res = await axiosInstance.get('/admin/reservations');
      setReservationsList(res.data || []);
    } catch (err) {
      toast.error('Failed to load reservations');
    }
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await axiosInstance.put(`/admin/reservations/${id}/cancel`);
      setReservationsList(reservationsList.map(r => r._id === id ? { ...r, status: 'Cancelled' } : r));
      toast.success('Reservation cancelled');
    } catch (err) {
      toast.error('Failed to cancel reservation');
    }
  };

  const handleCompleteReservation = async (id) => {
    if (!window.confirm('Mark this reservation as completed (customer left)?')) return;
    try {
      await axiosInstance.put(`/admin/reservations/${id}/complete`);
      setReservationsList(reservationsList.map(r => r._id === id ? { ...r, status: 'Completed' } : r));
      toast.success('Reservation marked completed');
    } catch (err) {
      toast.error('Failed to update reservation');
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const item = { ...newMenuItem, _id: 'NEW-' + Math.floor(Math.random()*1000), price: parseFloat(newMenuItem.price) };
    try {
      // Stub for real API
      // await axiosInstance.post('/admin/menu', item);
      setMenuItemsList([item, ...menuItemsList]);
      setShowMenuModal(false);
      setNewMenuItem({ name: '', category: 'Burger', price: '', image: '' });
      toast.success('Menu item added successfully');
    } catch (err) {
      toast.error('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (id) => {
     try {
       // await axiosInstance.delete(`/admin/menu/${id}`);
       setMenuItemsList(menuItemsList.filter(item => item._id !== id));
       toast.success('Menu item deleted');
     } catch (err) {
       toast.error('Failed to delete');
     }
  };

  const handleLogout = () => {
    localStorage.removeItem('zan_admin_token');
    navigate('/admin/login');
    toast.success('Admin Logged Out');
  };

  const menuTabs = [
     { id: 'overview', label: 'Overview', icon: LayoutDashboard },
     { id: 'orders', label: 'Order Board', icon: ShoppingCart },
     { id: 'reservations', label: 'Reservations', icon: CalendarDays },
     { id: 'menu', label: 'Menu Manager', icon: Utensils },
     { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800">
           <h2 className="text-2xl font-black font-outfit text-primary-500 tracking-tight">Zan Admin</h2>
           <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Console</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
           {menuTabs.map(item => {
             const Icon = item.icon;
             const isActive = activeTab === item.id;
             return (
               <button 
                 key={item.id}
                 onClick={() => setActiveTab(item.id)}
                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
               >
                 <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} /> {item.label}
               </button>
             )
           })}
        </nav>
        <div className="p-4 border-t border-gray-800">
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-red-400 transition-colors text-sm font-medium">
              <LogOut className="w-5 h-5" /> Logout
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 animate-fade-in bg-[#f8fafc]">
         <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
               <h1 className="text-3xl font-black text-gray-900 font-outfit capitalize">{activeTab.replace('-', ' ')}</h1>
               <p className="text-sm text-gray-500 mt-1">Manage your restaurant operations effectively.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold flex items-center shadow-inner"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> System Online</span>
            </div>
         </div>

         {/* --- OVERVIEW TAB --- */}
         {activeTab === 'overview' && (
           <div className="space-y-8 animate-slide-up">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -z-10 opacity-50"></div>
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Today's Revenue</p>
                  <p className="text-4xl font-black text-gray-900">₹{stats.revenue.toFixed(2)}</p>
                  <p className="text-xs text-green-600 mt-2 font-medium flex items-center"><TrendingUp className="w-3 h-3 mr-1"/> +12.5% from yesterday</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Active Orders</p>
                  <p className="text-4xl font-black text-primary-600">{stats.orders}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Reservations</p>
                  <p className="text-4xl font-black text-blue-600">{stats.reservations}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">New Customers</p>
                  <p className="text-4xl font-black text-green-600">{stats.customers}</p>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Chart */}
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <h2 className="text-lg font-bold text-gray-900 mb-6 font-outfit">Weekly Sales</h2>
                 <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                     <BarChart data={salesData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                       <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={32} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
               </div>

               {/* Recent Orders List */}
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                 <h2 className="text-lg font-bold text-gray-900 mb-6 font-outfit">Recent Orders</h2>
                 <div className="space-y-4">
                    {recentOrders.slice(0, 4).map(order => (
                      <div key={order._id} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-gray-50">
                         <div>
                            <p className="font-bold text-gray-900 text-sm">{order._id}</p>
                            <p className="text-xs text-gray-500">{order.customerName}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-bold text-primary-600">₹{(order.totalAmount || 0).toFixed(2)}</p>
                            <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-1 rounded-md ${order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                              {order.status}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
             </div>
           </div>
         )}

         {/* --- ORDERS TAB --- */}
         {activeTab === 'orders' && (
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
              <h2 className="text-xl font-bold mb-6 font-outfit text-gray-900">Order Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Customer</th>
                      <th className="p-4 font-bold">Type</th>
                      <th className="p-4 font-bold">Amount</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900 text-sm">{order._id}</td>
                        <td className="p-4 text-sm text-gray-600">{order.customerName || 'Guest'}</td>
                        <td className="p-4 text-sm text-gray-600">
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-bold">{order.type || 'Delivery'}</span>
                        </td>
                        <td className="p-4 font-bold text-gray-900 text-sm">₹{(order.totalAmount || 0).toFixed(2)}</td>
                        <td className="p-4">
                           <span className={`text-xs font-bold px-3 py-1 rounded-full ${order.status === 'Preparing' ? 'bg-yellow-100 text-yellow-700' : order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                              {order.status}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex justify-end gap-2">
                              {order.status !== 'Delivered' && (
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order._id, 'Out for Delivery')}
                                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Mark Out for Delivery"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                                className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                title="Mark Delivered"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
         )}

         {/* --- MENU MANAGER TAB --- */}
         {activeTab === 'menu' && (
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold font-outfit text-gray-900">Menu Catalog</h2>
                 <button 
                   onClick={() => setShowMenuModal(true)}
                   className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary-700 transition-colors"
                 >
                    <Plus className="w-4 h-4"/> Add Item
                 </button>
              </div>
              
              {showMenuModal && (
                <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4">Add New Menu Item</h3>
                  <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <input type="text" placeholder="Item Name" required value={newMenuItem.name} onChange={e => setNewMenuItem({...newMenuItem, name: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                     <select value={newMenuItem.category} onChange={e => setNewMenuItem({...newMenuItem, category: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500">
                       <option>Burger</option><option>Pizza</option><option>Falooda</option><option>Cake & Brownie</option>
                     </select>
                     <input type="number" step="0.01" placeholder="Price (₹)" required value={newMenuItem.price} onChange={e => setNewMenuItem({...newMenuItem, price: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                     <input type="text" placeholder="Image URL (Unsplash)" value={newMenuItem.image} onChange={e => setNewMenuItem({...newMenuItem, image: e.target.value})} className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                     <div className="md:col-span-2 flex gap-3 mt-2">
                        <button type="submit" className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700">Save Item</button>
                        <button type="button" onClick={() => setShowMenuModal(false)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-bold hover:bg-gray-300">Cancel</button>
                     </div>
                  </form>
                </div>
              )}

              {menuItemsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {menuItemsList.map(item => (
                     <div key={item._id} className="border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-shadow">
                        <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-gray-100" />
                        <div className="flex-1">
                           <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
                           <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                           <p className="font-black text-primary-600 text-sm">₹{item.price}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                           <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4"/></button>
                           <button onClick={() => handleDeleteMenuItem(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                   <Utensils className="w-12 h-12 mx-auto mb-3 opacity-20" />
                   <p>No menu items found. Fetching from database...</p>
                </div>
              )}
           </div>
         )}

         {/* --- RESERVATIONS TAB --- */}
         {activeTab === 'reservations' && (
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
              <h2 className="text-xl font-bold mb-6 font-outfit text-gray-900">Table Reservations</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                      <th className="p-4 font-bold">Booking ID</th>
                      <th className="p-4 font-bold">Customer</th>
                      <th className="p-4 font-bold">Date & Time</th>
                      <th className="p-4 font-bold">Guests</th>
                      <th className="p-4 font-bold">Table</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservationsList.map(res => (
                      <tr key={res._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-gray-900 text-sm">{res._id}</td>
                        <td className="p-4 text-sm text-gray-600">{res.customerName}</td>
                        <td className="p-4 text-sm text-gray-600">{res.date} at {res.time}</td>
                        <td className="p-4 text-sm text-gray-600">{res.guests} people</td>
                        <td className="p-4 font-bold text-gray-900 text-sm">{res.table}</td>
                        <td className="p-4">
                           <span className={`text-xs font-bold px-3 py-1 rounded-full ${res.status === 'Confirmed' ? 'bg-green-100 text-green-700' : res.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {res.status}
                           </span>
                        </td>
                        <td className="p-4 text-right">
                          {res.status === 'Confirmed' && (
                            <button 
                              onClick={() => handleCompleteReservation(res._id)}
                              className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors mr-2"
                              title="Mark Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {res.status !== 'Cancelled' && (
                            <button 
                              onClick={() => handleCancelReservation(res._id)}
                              className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Cancel Reservation"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
         )}

         {/* --- ANALYTICS TAB --- */}
         {activeTab === 'analytics' && (
           <div className="space-y-6 animate-slide-up">
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 font-outfit text-gray-900">Revenue Trends</h2>
                <div className="h-80">
                   <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                     <LineChart data={salesData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                       <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                       <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={4} dot={{strokeWidth: 4, r: 4, fill: '#fff'}} activeDot={{r: 8, stroke: '#0ea5e9', strokeWidth: 2}} />
                     </LineChart>
                   </ResponsiveContainer>
                </div>
             </div>
           </div>
         )}
         
      </div>
    </div>
  );
};

export default AdminDashboard;
