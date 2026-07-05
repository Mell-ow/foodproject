import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalAmount, getItemsCount, clearCart } =
    useCartStore();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-zan-cream z-[70] shadow-2xl flex flex-col transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-5 bg-zan-teal text-white shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingBag size={22} />
            <h2 className="font-playfair text-xl font-bold">
              Your Cart
              {getItemsCount() > 0 && (
                <span className="ml-2 text-sm font-dm bg-white/20 px-2 py-0.5 rounded-full">
                  {getItemsCount()} item{getItemsCount() !== 1 ? 's' : ''}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/15 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </header>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                <ShoppingBag size={36} className="text-zan-teal opacity-50" />
              </div>
              <p className="font-playfair text-lg font-semibold text-gray-600">
                Your cart is feeling light…
              </p>
              <p className="text-gray-400 text-sm max-w-[200px]">
                Add something delicious from the menu!
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-zan-teal text-white rounded-full font-bold text-sm hover:bg-primary-600 transition-colors"
              >
                Explore Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 bg-white rounded-2xl border border-amber-50 shadow-sm animate-fade-in"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-amber-50">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-amber-100 flex items-center justify-center text-2xl">
                      🍽️
                    </div>
                  )}
                </div>

                {/* Info + controls */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-sm text-zan-dark truncate pr-1">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-zan-teal font-bold text-sm mt-0.5">
                    ₹{Number(item.price).toFixed(2)}
                    {item.qty > 1 && (
                      <span className="text-gray-400 font-normal ml-1 text-xs">
                        × {item.qty} = ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                    )}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-bold text-sm w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-green-50 hover:border-green-200 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {items.length > 0 && (
          <div className="shrink-0 p-4 bg-white border-t border-amber-100 space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center px-1">
              <span className="text-gray-500 font-medium">Grand Total</span>
              <span className="text-2xl font-playfair font-bold text-zan-teal">
                ₹{getTotalAmount().toFixed(2)}
              </span>
            </div>

            {/* Loyalty hint */}
            <p className="text-xs text-center text-gray-400">
              🌟 Earn <strong>{Math.floor(getTotalAmount() / 10)}</strong> loyalty points with this order
            </p>

            {/* CTA */}
            <button
              onClick={handleCheckout}
              className="w-full bg-zan-gold hover:bg-gold-500 active:scale-[0.98] text-zan-dark font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-base"
            >
              Proceed to Order
              <ArrowRight size={18} />
            </button>

            {/* Clear cart */}
            <button
              onClick={() => { clearCart(); }}
              className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-1"
            >
              Clear all items
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
