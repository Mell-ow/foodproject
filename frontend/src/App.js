import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Reservation from './pages/Reservation';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/AdminDashboard';

export const UIContext = React.createContext({
  toggleCart: () => {},
});

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" />
      <UIContext.Provider value={{ toggleCart }}>
        <Navbar toggleCart={toggleCart} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <main className="min-h-screen pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track/:orderId" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/reserve" element={<Reservation />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </UIContext.Provider>
    </Router>
  );
}

export default App;
