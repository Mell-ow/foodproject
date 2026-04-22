import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu as MenuIcon, X, UtensilsCrossed } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const NAV_LINKS = [
  { to: '/',        label: 'Home'         },
  { to: '/menu',    label: 'Menu'         },
  { to: '/reserve', label: 'Reservations' },
];

const Navbar = ({ toggleCart }) => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const cartCount = useCartStore((state) => state.getItemsCount());
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 shrink-0"
          >
            <UtensilsCrossed size={22} className="text-zan-teal" strokeWidth={2.5} />
            <span className="font-playfair text-xl font-bold text-zan-teal tracking-tight">
              Zan Cafe
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-semibold transition-colors relative pb-0.5 ${
                  isActive(link.to)
                    ? 'text-zan-teal after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-zan-gold after:rounded-full'
                    : 'text-gray-600 hover:text-zan-teal'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <button
              onClick={toggleCart}
              id="cart-btn"
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-zan-teal hover:bg-primary-50 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-zan-gold text-zan-dark text-[10px] font-black flex items-center justify-center rounded-full px-1 animate-bounce-slow">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate('/profile')}
              id="profile-btn"
              className="p-2.5 rounded-xl text-gray-600 hover:text-zan-teal hover:bg-primary-50 transition-colors"
              aria-label="Go to profile"
            >
              <User size={22} />
            </button>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 px-4 pb-4 animate-fade-in">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm font-semibold border-b border-gray-50 last:border-0 ${
                isActive(link.to) ? 'text-zan-teal' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
