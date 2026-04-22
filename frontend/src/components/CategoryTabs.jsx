import React from 'react';
import useMenuStore from '../store/useMenuStore';

const CATEGORIES = [
  'All', 'Burger', 'Pizza', 'Sandwich', 'Pasta & Momos', 
  'BBQ', 'Maggi & Rolls', 'Falooda', 'Ice Cream', 'Cake & Brownie'
];

const CategoryTabs = ({ menuItems }) => {
  const { activeCategory, setActiveCategory } = useMenuStore();

  return (
    <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar snap-x">
      {CATEGORIES.map((cat) => {
        const count = cat === 'All' 
          ? menuItems.length 
          : menuItems.filter(item => item.category === cat).length;

        if (count === 0 && cat !== 'All') return null;

        return (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap snap-start border-2 ${
              activeCategory === cat
                ? 'bg-[#f5c518] border-[#f5c518] text-[#111] shadow-md scale-105'
                : 'bg-white border-gray-100 text-[#1a6b5a] hover:border-[#1a6b5a]/30'
            }`}
          >
            {cat}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeCategory === cat ? 'bg-white/50' : 'bg-gray-100'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
