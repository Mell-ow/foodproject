import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UtensilsCrossed, MapPin, Star, Clock, Phone } from 'lucide-react';
import { menuData } from '../data/menuData';
import FoodCard from '../components/FoodCard';

const PILLS = [
  { emoji: '🍔', label: 'Burger' },
  { emoji: '🍕', label: 'Pizza' },
  { emoji: '🍜', label: 'Noodles' },
  { emoji: '🥪', label: 'Sandwich' },
  { emoji: '🍨', label: 'Falooda' },
  { emoji: '🍰', label: 'Brownie' },
];

const HERO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', label: 'Burger' },
  { url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80', label: 'Pizza' },
  { url: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&q=80', label: 'Falooda' },
  { url: 'https://images.unsplash.com/photo-1606313564200-e75d5e31872e?w=400&q=80', label: 'Brownie' },
];

const FEATURED_IDS = ['b8', 'p2', 'f5', 'br3'];
const featured = menuData.filter((item) => FEATURED_IDS.includes(item.id));

const Home = () => {
  const navigate = useNavigate();
  const [activePill, setActivePill] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActivePill((p) => (p + 1) % PILLS.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zan-cream">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#0d4a3a] via-[#1a6b5a] to-[#111]">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 flex flex-col lg:flex-row items-center gap-12 w-full">
          {/* Left */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 animate-fade-in">
              <MapPin size={12} className="text-zan-gold" />
              <span>Karaikal Bazaar</span>
              <span className="w-px h-3 bg-white/30" />
              <Star size={12} className="text-zan-gold" fill="currentColor" />
              <span>4.6 (16 reviews)</span>
              <span className="w-px h-3 bg-white/30" />
              <span className="text-green-300 font-bold">Open Now</span>
            </div>

            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in delay-100">
              Taste the<br />
              <span className="text-zan-gold">Flavours</span> of<br />
              Karaikal
            </h1>

            <p className="text-primary-200 text-lg max-w-lg mx-auto lg:mx-0 mb-8 animate-fade-in delay-200">
              Burgers, Pizzas, Faloodas and more — crafted fresh at{' '}
              <strong className="text-white">Zan Cafe</strong>, Karaikal's favourite hangout.
            </p>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-10 animate-fade-in delay-300">
              {PILLS.map((pill, i) => (
                <span key={pill.label}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border transition-all duration-500 ${
                    activePill === i
                      ? 'bg-zan-gold text-zan-dark border-zan-gold scale-110 shadow-lg'
                      : 'bg-white/10 text-white border-white/20'
                  }`}>
                  {pill.emoji} {pill.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in delay-400">
              <button id="hero-order-btn" onClick={() => navigate('/menu')}
                className="group px-8 py-4 bg-zan-gold hover:bg-gold-500 text-zan-dark font-bold rounded-full flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95">
                Order Now For Delivery
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button id="hero-reserve-btn" onClick={() => navigate('/reserve')}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/25 text-white font-bold rounded-full flex items-center justify-center gap-2 hover:bg-white/20 transition-all active:scale-95">
                Reserve a Table
                <UtensilsCrossed size={18} />
              </button>
            </div>
          </div>

          {/* Right: 2x2 grid */}
          <div className="flex-1 max-w-md w-full animate-fade-in delay-300">
            <div className="grid grid-cols-2 gap-3">
              {HERO_IMAGES.map((img) => (
                <div key={img.label} className="relative overflow-hidden rounded-2xl shadow-2xl group">
                  <img src={img.url} alt={img.label}
                    className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-2 left-3 text-white text-xs font-bold">{img.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" className="fill-zan-cream w-full">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* OUR MASTERPIECES */}
      <section className="py-20 px-4 bg-zan-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <span className="text-zan-gold font-bold text-sm uppercase tracking-widest">Chef's Picks</span>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-zan-dark mt-2 mb-4">Our Masterpieces</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Signature dishes that define Zan Cafe — made fresh in Karaikal.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featured.map((item, i) => (
              <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <FoodCard item={item} />
              </div>
            ))}
          </div>
          <div className="text-center">
            <button onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-zan-teal hover:bg-primary-600 text-white font-bold rounded-full shadow-lg transition-all active:scale-95">
              View Full Menu <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-zan-dark text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed size={20} className="text-zan-gold" />
                <h3 className="font-playfair text-2xl font-bold text-zan-gold">Zan Cafe</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">Karaikal's favourite hangout for burgers, pizzas, faloodas and more. Fresh ingredients, authentic flavours.</p>
              <div className="flex items-center gap-1 mt-4">
                {[1,2,3,4].map(s => <Star key={s} size={14} className="text-zan-gold" fill="#f5c518" />)}
                <Star size={14} className="text-zan-gold" fill="none" stroke="#f5c518" />
                <span className="text-gray-400 text-sm ml-1">4.6 · 16 reviews</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-zan-gold mb-5">Contact & Location</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-zan-gold shrink-0 mt-0.5" />
                  <span>5, Chinna Kannu Chetty St,<br />Karaikal Bazaar, Karaikal,<br />Puducherry 609601</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-zan-gold shrink-0" />
                  <a href="tel:+919442082246" className="hover:text-white transition-colors">+91 94420 82246</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-zan-gold mb-5">Opening Hours</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                  <span className="flex items-center gap-2 text-gray-400"><Clock size={14} /> Mon – Fri</span>
                  <span className="text-white font-medium">10 AM – 10 PM</span>
                </li>
                <li className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
                  <span className="flex items-center gap-2 text-gray-400"><Clock size={14} /> Sat – Sun</span>
                  <span className="text-white font-medium">9 AM – 11 PM</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Zan Cafe Karaikal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
