import React, { useState } from 'react';
import { User, ShoppingBag, Calendar, Award, MapPin, LogOut, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

// Demo order history with ₹ prices
const DEMO_ORDERS = [
  {
    id: 'ZAN-892',
    date: 'Apr 20, 2026',
    total: 450,
    status: 'Delivered',
    items: [
      { id: 'b8',  name: 'ZAN Special Burger',   price: 150, qty: 1, category: 'Burger' },
      { id: 'f5',  name: 'Mixed Ice Cream Falooda', price: 150, qty: 1, category: 'Falooda' },
      { id: 'br3', name: 'Sizzler Brownie',       price: 140, qty: 1, category: 'Cake & Brownie' },
    ],
  },
  {
    id: 'ZAN-751',
    date: 'Apr 15, 2026',
    total: 260,
    status: 'Delivered',
    items: [
      { id: 'b15', name: 'Boneless Chicken Burger', price: 180, qty: 1, category: 'Burger' },
      { id: 'p2',  name: 'Double Cheese Pizza',     price: 130, qty: 1, category: 'Pizza'  },
    ],
  },
];

const DEMO_RESERVATIONS = [
  { id: 'RES-112', date: 'Apr 25, 2026', time: '07:00 PM', guests: 2, status: 'upcoming', table: 4 },
  { id: 'RES-098', date: 'Mar 30, 2026', time: '08:00 PM', guests: 4, status: 'completed', table: 2 },
];

// Loyalty = 1 point per ₹10 spent
const TOTAL_SPENT = DEMO_ORDERS.reduce((sum, o) => sum + o.total, 0);
const LOYALTY_POINTS = Math.floor(TOTAL_SPENT / 10);

const tabs = [
  { id: 'orders',       label: 'Order History',    icon: ShoppingBag },
  { id: 'reservations', label: 'Reservations',     icon: Calendar    },
  { id: 'loyalty',      label: 'Loyalty & Rewards',icon: Award       },
  { id: 'addresses',    label: 'Saved Addresses',  icon: MapPin      },
];

const Profile = () => {
  const navigate   = useNavigate();
  const addItem    = useCartStore((s) => s.addItem);
  const [activeTab, setActiveTab] = useState('orders');

  // "Reorder" — re-adds all items from that order to the cart
  const handleReorder = (order) => {
    order.items.forEach((item) => addItem({ ...item, qty: item.qty || 1 }));
    navigate('/');
    setTimeout(() => {
      const cartBtn = document.getElementById('cart-btn');
      if (cartBtn) cartBtn.click();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-zan-cream pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0 space-y-4">
          {/* Profile card */}
          <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={36} className="text-zan-teal" />
            </div>
            <h2 className="font-playfair text-xl font-bold text-zan-dark">Yousuf Rizwan</h2>
            <p className="text-gray-400 text-sm mt-1 mb-1">yousufsahib4@gmail.com</p>
            <p className="text-gray-400 text-sm mb-6">+91 94420 82246</p>

            <div className="flex justify-center gap-6 text-sm border-t pt-5">
              <div className="text-center">
                <p className="text-2xl font-bold text-zan-dark">{DEMO_ORDERS.length}</p>
                <p className="text-gray-400 text-xs">Orders</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <p className="text-2xl font-bold text-zan-teal">{LOYALTY_POINTS}</p>
                <p className="text-gray-400 text-xs">Points</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="text-center">
                <p className="text-2xl font-bold text-zan-dark">{DEMO_RESERVATIONS.length}</p>
                <p className="text-gray-400 text-xs">Bookings</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <div className="bg-white rounded-3xl shadow-sm border border-amber-100 p-4 animate-fade-in delay-100">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-left text-sm ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-zan-teal font-bold'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} /> {tab.label}
                  </button>
                );
              })}
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-amber-100 p-8 animate-fade-in min-h-[500px]">

          {/* ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="font-playfair text-2xl font-bold text-zan-dark mb-6">Order History</h2>
              <div className="space-y-4">
                {DEMO_ORDERS.map((order) => (
                  <div key={order.id} className="border border-amber-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap justify-between items-start mb-3 gap-4">
                      <div>
                        <p className="font-bold text-zan-dark">
                          {order.id}
                          <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">
                            {order.status}
                          </span>
                        </p>
                        <p className="text-sm text-gray-400 mt-0.5">{order.date}</p>
                      </div>
                      <p className="font-playfair text-xl font-bold text-zan-teal">₹{order.total}</p>
                    </div>

                    <ul className="text-sm text-gray-500 space-y-0.5 mb-4">
                      {order.items.map((item) => (
                        <li key={item.id}>{item.qty}× {item.name} — ₹{item.price * item.qty}</li>
                      ))}
                    </ul>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => handleReorder(order)}
                        className="flex items-center gap-1.5 bg-primary-50 text-zan-teal px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-100 transition"
                      >
                        <RotateCcw size={14} /> Reorder
                      </button>
                      <button
                        onClick={() => navigate(`/track/${order.id}`)}
                        className="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-50 transition"
                      >
                        Track Status
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESERVATIONS */}
          {activeTab === 'reservations' && (
            <div>
              <h2 className="font-playfair text-2xl font-bold text-zan-dark mb-6">Your Bookings</h2>
              <div className="space-y-4">
                {DEMO_RESERVATIONS.map((res) => (
                  <div key={res.id}
                    className={`border rounded-2xl p-6 transition-shadow ${
                      res.status === 'upcoming'
                        ? 'border-primary-200 bg-primary-50/30'
                        : 'border-gray-100'
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div>
                        <p className="font-bold text-zan-dark">
                          {res.id}
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold uppercase ${
                            res.status === 'upcoming'
                              ? 'bg-primary-100 text-zan-teal'
                              : 'bg-gray-100 text-gray-500'
                          }`}>{res.status}</span>
                        </p>
                        <p className="text-sm font-medium text-gray-700 mt-1">
                          {res.date} at {res.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-700">Table {res.table}</p>
                        <p className="text-sm text-gray-400">{res.guests} Guests</p>
                      </div>
                    </div>
                    {res.status === 'upcoming' && (
                      <button className="text-red-500 border border-red-200 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-50 transition">
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LOYALTY */}
          {activeTab === 'loyalty' && (
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Award size={64} className="text-zan-gold mb-6" />
              <h2 className="font-playfair text-3xl font-bold text-zan-dark mb-2">
                You have <span className="text-zan-gold">{LOYALTY_POINTS}</span> Points!
              </h2>
              <p className="text-gray-500 max-w-md mb-8">
                Earn 1 point for every ₹10 spent. Redeem 10 pts = ₹1 discount at checkout.
              </p>

              <div className="bg-zan-cream border border-amber-200 rounded-2xl p-6 w-full max-w-sm text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-zan-teal h-3 rounded-full transition-all"
                    style={{ width: `${Math.min((LOYALTY_POINTS % 100) / 100 * 100, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-zan-teal">{LOYALTY_POINTS % 100}</span>/100 pts to next reward
                </p>
              </div>
            </div>
          )}

          {/* ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <MapPin size={48} className="text-gray-300 mb-4" />
              <h3 className="font-playfair text-xl font-bold text-gray-400 mb-2">No saved addresses yet</h3>
              <p className="text-gray-400 text-sm">Your delivery addresses will appear here after your first order.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
