import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { menuData } from '../data/menuData';
import useMenuStore from '../store/useMenuStore';
import FoodCard from '../components/FoodCard';
import CategoryTabs from '../components/CategoryTabs';

const Menu = () => {
  const [search, setSearch] = useState('');
  const { activeCategory } = useMenuStore();

  const filteredItems = useMemo(() => {
    return menuData.filter((item) => {
      const matchCat  = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = search.trim() === '' ||
        item.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  return (
    <div className="min-h-screen bg-zan-cream">
      {/* Page header */}
      <div className="bg-gradient-to-br from-zan-teal via-primary-600 to-primary-800 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">
            Our Menu
          </h1>
          <p className="text-primary-200 text-lg mb-8">
            Authentic flavours · Fresh ingredients · Karaikal's finest
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              id="menu-search"
              type="text"
              placeholder="Search dishes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 shadow-xl focus:outline-none focus:ring-2 focus:ring-zan-gold text-gray-800 bg-white placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryTabs menuItems={menuData} />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredItems.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-xl font-semibold">No dishes found</p>
            <p className="text-sm mt-2">Try a different search or category</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 font-medium mb-6">
              Showing <span className="text-zan-teal font-bold">{filteredItems.length}</span> item{filteredItems.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && (
                <span> in <span className="text-zan-teal font-bold">{activeCategory}</span></span>
              )}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, i) => (
                <div
                  key={item.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s` }}
                >
                  <FoodCard item={item} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
