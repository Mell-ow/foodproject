import React, { useEffect } from 'react';
import { Plus, Leaf } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useMenuStore from '../store/useMenuStore';
import useUnsplash from '../hooks/useUnsplash';
import toast from 'react-hot-toast';

// Curated Unsplash fallback images per category (no API needed)
const FALLBACKS = {
  'Burger':        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  'Pizza':         'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
  'Falooda':       'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&q=80',
  'Ice Cream':     'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&q=80',
  'Cake & Brownie':'https://images.unsplash.com/photo-1606313564200-e75d5e31872e?w=400&q=80',
  'Sandwich':      'https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400&q=80',
  'Pasta & Momos': 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=80',
  'BBQ':           'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
  'Maggi & Rolls': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80',
};

const FoodCard = ({ item }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { imageCache, setImageCache } = useMenuStore();

  const cached = imageCache[item.id];
  // Only hit API if not already cached
  const { imageUrl, loading } = useUnsplash(cached ? null : item.name, item.category);

  // Cache when API returns a result
  useEffect(() => {
    if (imageUrl && !cached) {
      setImageCache(item.id, imageUrl);
    }
  }, [imageUrl, item.id, cached, setImageCache]);

  const displayImage =
    cached ||
    imageUrl ||
    FALLBACKS[item.category] ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80';

  const isVeg = !['BBQ', 'Burger'].includes(item.category)
    ? true
    : item.name.toLowerCase().includes('chicken') ||
      item.name.toLowerCase().includes('boneless')
      ? false
      : true;

  const handleAdd = () => {
    addItem({
      id:       item.id,
      name:     item.name,
      price:    item.price,
      category: item.category,
      image:    displayImage,
      qty:      1,
    });
    toast.success(`${item.name} added!`, {
      style: {
        background: '#1a6b5a',
        color:      '#fff',
        fontWeight: '600',
        borderRadius: '12px',
      },
      iconTheme: { primary: '#f5c518', secondary: '#fff' },
      duration: 1800,
    });
  };

  return (
    <div className="food-card bg-zan-cream rounded-2xl overflow-hidden shadow-sm border border-amber-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-amber-50">
        {loading && !cached ? (
          <div className="w-full h-full skeleton" />
        ) : (
          <img
            src={displayImage}
            alt={item.name}
            className="food-card-img w-full h-full object-cover"
            onError={(e) => { e.target.src = FALLBACKS[item.category] || FALLBACKS['Burger']; }}
          />
        )}

        {/* Veg/Non-veg badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Leaf
            size={11}
            className={isVeg ? 'text-green-600' : 'text-red-500'}
            fill="currentColor"
          />
          <span className="text-[10px] font-bold uppercase tracking-tight text-gray-700">
            {isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        {/* Category pill */}
        <div className="absolute top-3 right-3 bg-zan-teal text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
          {item.category}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-playfair text-base font-bold text-zan-dark leading-tight flex-1 mr-2">
            {item.name}
          </h3>
          <span className="text-zan-teal font-bold text-lg shrink-0">
            ₹{item.price}
          </span>
        </div>

        <button
          onClick={handleAdd}
          id={`add-${item.id}`}
          className="w-full bg-zan-gold hover:bg-gold-500 active:scale-95 text-zan-dark font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm"
        >
          <Plus size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodCard;
