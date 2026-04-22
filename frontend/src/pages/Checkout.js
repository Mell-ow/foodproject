import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, UtensilsCrossed, CreditCard, ArrowLeft, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '../store/useCartStore';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalAmount, clearCart } = useCartStore();
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'dine-in'
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states 
  const [address, setAddress] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(50); // MOCKED for UI

  const subtotal = getTotalAmount();
  const taxes = subtotal * 0.05;
  const deliveryCharge = orderType === 'delivery' ? 5.00 : 0;
  const total = subtotal + taxes + deliveryCharge - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'ZAN10') {
      setDiscount(subtotal * 0.10);
      toast.success('10% Discount Applied!');
    } else {
      toast.error('Invalid Coupon Code');
      setDiscount(0);
    }
  };

  const handleRedeemLoyalty = () => {
    if (loyaltyPoints >= 10) {
      const discountVal = Math.floor(loyaltyPoints / 10);
      setDiscount(prev => prev + discountVal);
      setLoyaltyPoints(loyaltyPoints % 10);
      toast.success(`Redeemed ${discountVal * 10} points for $${discountVal} off!`);
    } else {
      toast.error('Not enough points to redeem');
    }
  };

  const handlePayment = () => {
    if (orderType === 'delivery' && !address) {
      toast.error('Please enter a delivery address');
      return;
    }

    setIsProcessing(true);
    // Simulate Razorpay and Backend creation latency
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
      navigate('/track/mock_id_992');
      toast.success('Payment Successful! Order Placed.');
    }, 2500);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Utensils className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <button onClick={() => navigate('/menu')} className="mt-4 text-primary-600 hover:text-primary-700 font-bold">Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/menu')} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft className="w-6 h-6 text-gray-600" /></button>
        <h1 className="text-3xl font-bold text-gray-900 font-outfit">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side - Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Order Type Toggle */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-slide-up">
             <h2 className="text-xl font-bold mb-4 font-outfit">Order Preference</h2>
             <div className="flex gap-4">
               <button 
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 border-2 transition-all ${orderType === 'delivery' ? 'bg-primary-50 border-primary-500 text-primary-700 font-bold shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-primary-200'}`}
               >
                 <Utensils className="w-5 h-5"/> Home Delivery
               </button>
               <button 
                  onClick={() => setOrderType('dine-in')}
                  className={`flex-1 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 border-2 transition-all ${orderType === 'dine-in' ? 'bg-primary-50 border-primary-500 text-primary-700 font-bold shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:border-primary-200'}`}
               >
                 <UtensilsCrossed className="w-5 h-5"/> Dine-In
               </button>
             </div>

             {orderType === 'delivery' && (
               <div className="mt-6 animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
                  <textarea 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your full street address, apartment number, etc."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none"
                    rows="3"
                  />
               </div>
             )}
          </div>

          {/* Cart Breakdown */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-slide-up" style={{animationDelay: '0.1s'}}>
             <h2 className="text-xl font-bold mb-4 font-outfit">Review Items</h2>
             <div className="space-y-4">
               {items.map(item => (
                 <div key={item.menuItem._id} className="flex gap-4 items-center p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                    <img src={item.menuItem.image} alt="dish" className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* Right Side - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 text-white p-6 md:p-8 rounded-3xl shadow-xl sticky top-24 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-xl font-bold mb-6 font-outfit text-white">Payment Summary</h2>
            
            <div className="space-y-4 text-sm text-gray-300 mb-6">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxes (5%)</span><span>${taxes.toFixed(2)}</span></div>
              {orderType === 'delivery' && <div className="flex justify-between"><span>Delivery Fee</span><span>${deliveryCharge.toFixed(2)}</span></div>}
              {discount > 0 && <div className="flex justify-between text-green-400 font-medium"><span>Discount Applied</span><span>-${discount.toFixed(2)}</span></div>}
            </div>

            <div className="border-t border-gray-700 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg text-white">Total</span>
                <span className="text-3xl font-black text-primary-500 font-outfit">${Math.max(0, total).toFixed(2)}</span>
              </div>
            </div>

            {/* Coupons & Loyalty */}
            <div className="space-y-4 mb-8">
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={couponCode}
                   onChange={(e) => setCouponCode(e.target.value)}
                   placeholder="ZAN10" 
                   className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary-500 text-white"
                 />
                 <button onClick={handleApplyCoupon} className="bg-gray-700 hover:bg-gray-600 px-4 rounded-lg text-sm font-bold transition">Apply</button>
               </div>
               
               <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Ticket className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-bold text-white">Loyalty Points</p>
                      <p className="text-xs text-gray-400">Balance: {loyaltyPoints} pts</p>
                    </div>
                  </div>
                  <button onClick={handleRedeemLoyalty} disabled={loyaltyPoints < 10} className="text-sm font-bold text-primary-500 hover:text-primary-400 disabled:text-gray-600">Redeem</button>
               </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${isProcessing ? 'bg-primary-800 text-primary-200 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'}`}
            >
              {isProcessing ? 'Connecting to Gateway...' : <>Pay securely via Razorpay <CreditCard className="w-5 h-5" /></>}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">100% secure encrypted payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;