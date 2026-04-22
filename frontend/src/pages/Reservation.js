import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, CreditCard, Utensils, CheckCircle, ArrowLeft, Download, Share2, Info, Lock, Smartphone, Banknote } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { menuData } from '../data/menuData';

// --- Constants ---
const PACKAGES = [
  { id: 50, label: 'Basic', amount: 50, description: 'Secures your table booking' },
  { id: 100, label: 'Standard', amount: 100, description: 'Recommended for most bookings', recommended: true },
  { id: 200, label: 'Premium', amount: 200, description: 'Best for full group of 6' },
];

const TIME_SLOTS = [
  "11:00 AM", "01:00 PM", "03:00 PM", "06:00 PM", "08:00 PM", "10:00 PM"
];

const CATEGORIES = ["All", "Burger", "Pizza", "Sandwich", "Pasta & Momos", "BBQ", "Maggi & Rolls", "Falooda", "Ice Cream", "Cake & Brownie"];

const PAYMENT_METHODS = [
  { id: 'upi',  label: 'UPI / Online', icon: '📱', desc: 'Pay via UPI, GPay, PhonePe' },
  { id: 'cash', label: 'Cash on Arrival', icon: '💵', desc: 'Pay at the cafe when you arrive' },
];

const Reservation = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState('upi');

  // Logic States
  const [reservationData, setReservationData] = useState({
    date: new Date().toISOString().split('T')[0],
    timeSlot: '06:00 PM',
    tableNumber: null,
    customerName: '',
    customerPhone: '',
    numberOfGuests: 2,
    specialRequests: '',
    preBookedItems: [],
    packageId: 100,
  });

  const [availableTables, setAvailableTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [reservationResult, setReservationResult] = useState(null);

  // --- API Calls ---

  useEffect(() => {
    const fetchTables = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/reserve/available-tables?date=${reservationData.date}&time=${reservationData.timeSlot}`);
        setAvailableTables(res.data.tables);
      } catch (err) {
        // Backend offline — generate 10 local tables with some randomly reserved
        const seed = reservationData.date + reservationData.timeSlot;
        const reservedNums = [2, 5].map((n, i) => ((seed.charCodeAt(i * 3) % 10) + 1));
        const localTables = Array.from({ length: 10 }, (_, i) => ({
          tableNumber: i + 1,
          status: reservedNums.includes(i + 1) ? 'reserved' : 'available',
          seats: i < 4 ? 2 : i < 8 ? 4 : 6,
        }));
        setAvailableTables(localTables);
      } finally {
        setIsLoading(false);
      }
    };
    if (step === 1) fetchTables();
  }, [reservationData.date, reservationData.timeSlot, step]);

  useEffect(() => {
    if (step === 2 && menuItems.length === 0) {
      // Use local menuData — no backend needed
      const localItems = menuData.map(item => ({
        _id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        isVeg: !item.name.toLowerCase().includes('chicken') && !item.name.toLowerCase().includes('boneless'),
        isAvailable: true,
        description: `${item.category} · ₹${item.price}`,
        image: '',
      }));
      setMenuItems(localItems);
    }
  }, [step, menuItems.length]);

  // --- Handlers ---

  const updateData = (fields) => setReservationData(prev => ({ ...prev, ...fields }));

  const handleQtyChange = (item, delta) => {
    const existing = reservationData.preBookedItems.find(i => i.menuItemId === item._id);
    let updated = [...reservationData.preBookedItems];

    if (existing) {
      const newQty = Math.min(10, Math.max(0, existing.quantity + delta));
      if (newQty === 0) {
        updated = updated.filter(i => i.menuItemId !== item._id);
      } else {
        existing.quantity = newQty;
      }
    } else if (delta > 0) {
      updated.push({ menuItemId: item._id, name: item.name, price: item.price, quantity: 1 });
    }
    updateData({ preBookedItems: updated });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const pkg = PACKAGES.find(p => p.id === reservationData.packageId);
      // 1. Create Order
      const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order', { amount: pkg.amount });
      
      // 2. Mock Razorpay Flow (Since we use mock keys in backend)
      const { data: verification } = await axios.post('http://localhost:5000/api/payment/verify', {
        razorpay_order_id: order.id,
        razorpay_payment_id: `pay_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_signature: 'mock_signature'
      });

      if (verification.message.includes('success')) {
        // 3. Create Reservation
        const { data: final } = await axios.post('http://localhost:5000/api/reserve', {
          ...reservationData,
          advanceAmountPaid: pkg.amount,
          razorpayOrderId: order.id,
          razorpayPaymentId: 'mock_payment'
        });
        setReservationResult(final.reservation);
        setStep(4);
        toast.success("Reservation Successful!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Sub-Components ---

  const StepProgressBar = () => (
    <div className="mb-12 max-w-3xl mx-auto px-4">
      <div className="relative flex justify-between">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>
        <div 
          className="absolute top-5 left-0 h-0.5 bg-res-primary -z-10 transition-all duration-500" 
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        ></div>
        {['Details', 'Menu', 'Payment', 'Done'].map((label, i) => {
          const s = i + 1;
          const isDone = step > s || s === 4 && step === 4;
          const isActive = step === s;
          return (
            <div key={label} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all border-4 ${isDone ? 'bg-res-success border-res-success text-white' : isActive ? 'bg-white border-res-primary text-res-primary ring-4 ring-orange-100' : 'bg-white border-gray-200 text-gray-400'}`}>
                {isDone ? <CheckCircle size={20} /> : s}
              </div>
              <span className={`text-[10px] sm:text-xs font-bold mt-2 ${isActive ? 'text-res-primary' : 'text-gray-400'}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const SummaryBar = () => (
    <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md shadow-sm border border-gray-100 rounded-2xl p-4 mb-8 flex items-center justify-between animate-fade-in">
       <div className="flex items-center gap-4 text-sm font-medium">
          <div className="bg-orange-50 text-res-primary p-2 rounded-lg"><Calendar size={18}/></div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Booking Slot</p>
            <p>{reservationData.date} • {reservationData.timeSlot}</p>
          </div>
       </div>
       <div className="h-8 w-px bg-gray-200 mx-4 hidden sm:block"></div>
       <div className="flex items-center gap-4 text-sm font-medium">
          <div className="bg-green-50 text-res-success p-2 rounded-lg"><Users size={18}/></div>
          <div>
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">Group Size</p>
            <p>{reservationData.numberOfGuests} Guests • Table {reservationData.tableNumber || '?'}</p>
          </div>
       </div>
       <button onClick={() => setStep(step - 1)} className="text-gray-400 hover:text-res-primary p-2 transition-colors"><ArrowLeft size={20}/></button>
    </div>
  );

  // --- Step Renders ---

  const renderStep1 = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Select Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="date" 
              min={new Date().toISOString().split('T')[0]}
              value={reservationData.date}
              onChange={(e) => updateData({ date: e.target.value, tableNumber: null })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-res-primary focus:ring-0 transition-all font-medium"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Select Time</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              value={reservationData.timeSlot}
              onChange={(e) => updateData({ timeSlot: e.target.value, tableNumber: null })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-res-primary focus:ring-0 transition-all font-medium appearance-none"
            >
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold font-outfit">Choose Your Table</h3>
          <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-res-success"></div> {availableTables.filter(t => t.status === 'available').length} Available</span>
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-200"></div> {availableTables.filter(t => t.status === 'reserved').length} Sold Out</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            [1,2,3,4,5,6].map(i => <div key={i} className="h-40 rounded-3xl animate-shimmer"></div>)
          ) : (
            availableTables.map(table => (
              <button
                key={table.tableNumber}
                disabled={table.status === 'reserved'}
                onClick={() => updateData({ tableNumber: table.tableNumber })}
                className={`group relative h-44 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 overflow-hidden ${
                  table.status === 'reserved' 
                  ? 'bg-gray-50 border-gray-100 opacity-60 cursor-not-allowed' 
                  : reservationData.tableNumber === table.tableNumber 
                  ? 'bg-orange-50 border-res-primary shadow-lg shadow-orange-100' 
                  : 'bg-white border-gray-100 hover:border-orange-200 hover:scale-[1.02]'
                }`}
              >
                {/* SVG Table Illustration */}
                <svg width="80" height="80" viewBox="0 0 100 100" className={`transition-colors ${table.status === 'reserved' ? 'text-gray-200' : 'text-orange-100 group-hover:text-orange-200'}`}>
                  <circle cx="50" cy="50" r="30" fill="currentColor" stroke="currentColor" strokeWidth="2" />
                  {[0, 60, 120, 180, 240, 300].map(deg => (
                    <circle key={deg} cx={50 + 35 * Math.cos(deg * Math.PI / 180)} cy={50 + 35 * Math.sin(deg * Math.PI / 180)} r="6" fill="white" stroke="#e5e7eb" strokeWidth="1" />
                  ))}
                  <text x="50" y="55" textAnchor="middle" className="text-xs font-bold fill-gray-400">T{table.tableNumber}</text>
                </svg>
                <span className={`text-sm font-bold ${table.status === 'reserved' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Table {table.tableNumber}
                </span>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${table.status === 'reserved' ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-res-success'}`}>
                  {table.status === 'reserved' ? 'Occupied' : 'Select'}
                </span>
                {reservationData.tableNumber === table.tableNumber && (
                   <div className="absolute top-4 right-4 text-res-primary"><CheckCircle fill="currentColor" className="text-white"/></div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-slide-up">
        <h3 className="text-xl font-bold font-outfit mb-6">Guest Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              value={reservationData.customerName}
              onChange={(e) => updateData({ customerName: e.target.value })}
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-res-primary focus:ring-0 transition-all bg-gray-50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">+91</span>
              <input 
                type="tel" 
                placeholder="00000 00000"
                value={reservationData.customerPhone}
                onChange={(e) => updateData({ customerPhone: e.target.value })}
                className="w-full pl-16 pr-6 py-4 rounded-2xl border border-gray-100 focus:border-res-primary focus:ring-0 transition-all bg-gray-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Number of Guests</label>
            <select 
               value={reservationData.numberOfGuests}
               onChange={(e) => updateData({ numberOfGuests: parseInt(e.target.value) })}
               className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-res-primary focus:ring-0 transition-all bg-gray-50 font-medium"
            >
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Special Requests</label>
            <div className="relative">
               <textarea 
                  placeholder="Anniversary, allergy, etc."
                  maxLength={200}
                  value={reservationData.specialRequests}
                  onChange={(e) => updateData({ specialRequests: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:border-res-primary focus:ring-0 transition-all bg-gray-50 resize-none h-[58px]"
               ></textarea>
               <span className="absolute bottom-2 right-4 text-[10px] text-gray-300 font-bold">{reservationData.specialRequests.length}/200</span>
            </div>
          </div>
        </div>
        
        <button 
          disabled={!reservationData.tableNumber || !reservationData.customerName || reservationData.customerPhone.length < 10}
          onClick={() => setStep(2)}
          className="w-full bg-res-primary hover:bg-orange-600 active:scale-[0.98] text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-100 disabled:opacity-50 disabled:shadow-none"
        >
          Continue to Menu Selection <ArrowLeft className="rotate-180" size={20} />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const preMenuTotal = reservationData.preBookedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const filteredMenu = activeCategory === "All" ? menuItems : menuItems.filter(i => i.category === activeCategory);

    return (
      <div className="space-y-8 animate-fade-in pb-24">
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex items-center gap-5 text-orange-800">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-res-primary"><Info/></div>
          <div className="flex-1">
             <p className="font-bold text-sm">Save time with pre-orders!</p>
             <p className="text-xs opacity-80">Book your favorite dishes now and we'll have them ready for your arrival. (Optional)</p>
          </div>
          <button onClick={() => setStep(3)} className="px-6 py-3 bg-white hover:bg-orange-100 rounded-xl text-xs font-bold text-res-primary transition-colors whitespace-nowrap">Skip - Go to Payment</button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-res-primary text-white shadow-lg shadow-orange-100 scale-105' : 'bg-white text-gray-500 border border-gray-100 hover:border-orange-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMenu.map(item => {
            const booked = reservationData.preBookedItems.find(i => i.menuItemId === item._id);
            const qty = booked ? booked.quantity : 0;
            return (
              <div key={item._id} className={`bg-white p-4 rounded-3xl border transition-all flex items-center gap-4 ${item.isAvailable ? 'border-gray-50' : 'opacity-40 grayscale border-transparent'}`}>
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover" />
                  <div className={`absolute top-2 left-2 w-4 h-4 rounded-full border-2 ${item.isVeg ? 'border-green-500 bg-white' : 'border-red-500 bg-white'}`}>
                    <div className={`w-1.5 h-1.5 m-0.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                  <p className="text-xs text-gray-400 line-clamp-1 mb-2">{item.description}</p>
                  <p className="font-black text-res-primary">₹{item.price}</p>
                </div>
                {item.isAvailable ? (
                   <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                      <button onClick={() => handleQtyChange(item, 1)} className="w-8 h-8 rounded-xl bg-white hover:bg-orange-50 text-res-primary shadow-sm flex items-center justify-center font-bold">+</button>
                      <span className={`text-sm font-bold my-1 w-6 text-center animate-fade-in ${qty > 0 ? 'text-res-primary' : 'text-gray-300'}`}>{qty}</span>
                      <button onClick={() => handleQtyChange(item, -1)} disabled={qty === 0} className="w-8 h-8 rounded-xl bg-white hover:bg-gray-100 text-gray-500 disabled:opacity-0 flex items-center justify-center font-bold">-</button>
                   </div>
                ) : (
                  <span className="text-[10px] font-bold text-red-400 uppercase bg-red-50 px-2 py-1 rounded">Stock Out</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Floating Summary Bar */}
        {preMenuTotal > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-gray-900 text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between animate-slide-up z-50">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Pre-Order Total</p>
              <p className="text-xl font-black">₹{preMenuTotal}</p>
            </div>
            <button onClick={() => setStep(3)} className="bg-res-primary hover:bg-orange-600 px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all">
              Next Step <ArrowLeft className="rotate-180" size={18}/>
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderStep3 = () => {
    const preMenuTotal = reservationData.preBookedItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const selectedPkg = PACKAGES.find(p => p.id === reservationData.packageId);

    return (
      <div className="space-y-8 animate-fade-in">
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-gray-50/50 p-8 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-xl font-bold">Booking Confirmation</h3>
              <p className="text-sm text-gray-400">Please review your details before payment</p>
            </div>
            <div className="bg-orange-100 text-res-primary px-6 py-2 rounded-full font-bold text-sm">
              Table {reservationData.tableNumber}
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-8">
              <div><p className="text-[10px] uppercase font-bold text-gray-300 mb-1">Customer</p><p className="font-bold">{reservationData.customerName}</p></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-300 mb-1">Date</p><p className="font-bold">{reservationData.date}</p></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-300 mb-1">Guests</p><p className="font-bold">{reservationData.numberOfGuests} Persons</p></div>
            </div>

            {reservationData.preBookedItems.length > 0 && (
              <div className="space-y-4 border-t pt-8">
                <h4 className="font-bold text-sm text-gray-700 flex items-center gap-2"><Utensils size={16}/> Pre-booked Items</h4>
                <div className="space-y-2">
                  {reservationData.preBookedItems.map(i => (
                    <div key={i.menuItemId} className="flex justify-between text-sm">
                      <span className="text-gray-500">{i.quantity}x {i.name}</span>
                      <span className="font-bold text-gray-700">₹{i.price * i.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t border-dashed font-bold text-res-primary">
                    <span>Food Subtotal</span>
                    <span>₹{preMenuTotal}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold font-outfit px-2">Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                className={`text-left p-5 rounded-3xl border-2 transition-all flex items-start gap-4 ${
                  paymentMethod === pm.id
                    ? 'border-[#1a6b5a] bg-primary-50/30 shadow-lg scale-[1.02]'
                    : 'border-gray-100 bg-white hover:border-[#1a6b5a]/30'
                }`}
              >
                <span className="text-3xl">{pm.icon}</span>
                <div>
                  <p className="font-bold text-gray-900">{pm.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{pm.desc}</p>
                </div>
                {paymentMethod === pm.id && (
                  <CheckCircle size={18} className="ml-auto shrink-0 text-[#1a6b5a]" fill="currentColor" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Advance Package (only for UPI) */}
        {paymentMethod === 'upi' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold font-outfit">Select Advance Package</h3>
            <p className="text-xs text-gray-400 font-bold flex items-center gap-1"><Lock size={12}/> Secure Payment</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PACKAGES.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => updateData({ packageId: pkg.id })}
                className={`text-left p-6 rounded-[32px] border-2 transition-all relative ${reservationData.packageId === pkg.id ? 'border-[#1a6b5a] bg-primary-50/30 shadow-xl scale-[1.03]' : 'border-gray-50 bg-white hover:border-[#1a6b5a]/30'}`}
              >
                {pkg.recommended && <span className="absolute -top-3 left-6 bg-[#1a6b5a] text-white text-[10px] font-black px-3 py-1 rounded-full">POPULAR</span>}
                <p className="text-3xl font-black text-[#1a6b5a] mb-2">₹{pkg.amount}</p>
                <p className="font-bold text-gray-900 text-sm mb-1">{pkg.label}</p>
                <p className="text-xs text-gray-400 line-clamp-2">{pkg.description}</p>
              </button>
            ))}
          </div>
        </div>
        )}

        <div className="bg-gray-900 rounded-[40px] p-8 text-white">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                 <p className="text-sm text-gray-400 font-medium">To be paid {paymentMethod === 'cash' ? 'at cafe' : 'now'}:</p>
                 <h4 className="text-4xl font-black">₹{paymentMethod === 'cash' ? (preMenuTotal || 0) : (selectedPkg.amount + (preMenuTotal > 0 ? preMenuTotal : 0))}</h4>
                 <p className="text-[10px] text-gray-500 mt-2">{paymentMethod === 'cash' ? '*Full amount paid at cafe on arrival' : '*Remaining balance settled at cafe'}</p>
              </div>
              <button
                disabled={isLoading}
                onClick={handlePayment}
                className="w-full sm:w-auto bg-[#1a6b5a] hover:bg-[#155a4c] px-12 py-5 rounded-[24px] font-bold text-lg shadow-2xl shadow-black/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Pay Now <CreditCard/></>
                )}
              </button>
           </div>
        </div>
      </div>
    );
  };

  const renderStep4 = () => (
    <div className="max-w-2xl mx-auto py-12 animate-fade-in">
       <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-50 rounded-[35%] flex items-center justify-center mx-auto mb-8 shadow-inner">
             <svg width="60" height="60" viewBox="0 0 100 100" className="text-res-success">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeDasharray="283" strokeDashoffset="283" className="animate-[drawCheck_1s_ease-out_forwards]" style={{ strokeDashoffset: 0 }} />
                <path d="M30 50 L45 65 L70 35" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="100" strokeDashoffset="100" className="animate-[drawCheck_0.5s_ease-out_0.5s_forwards]" style={{ strokeDashoffset: 0 }} />
             </svg>
          </div>
          <h2 className="text-4xl font-black font-outfit text-gray-900 mb-4">Booking Confirmed!</h2>
          <div className="inline-block px-6 py-2 bg-gray-100 rounded-full font-mono font-bold text-gray-500 text-lg">
            ID: {reservationResult?.reservationId}
          </div>
       </div>

       <div className="bg-white rounded-[48px] shadow-2xl border border-gray-50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-res-primary"></div>
          <div className="p-10 space-y-8">
             <div className="flex justify-between items-start pb-8 border-b border-dashed border-gray-100">
                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-res-primary flex items-center justify-center"><Calendar size={18}/></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-300 uppercase italic">Reserved For</p>
                         <p className="font-bold">{reservationResult?.date?.split('T')[0]} • {reservationResult?.timeSlot}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-green-100 text-res-success flex items-center justify-center"><Users size={18}/></div>
                      <div>
                         <p className="text-[10px] font-black text-gray-300 uppercase italic">Guests & Table</p>
                         <p className="font-bold">{reservationResult?.numberOfGuests} Pers • Table {reservationResult?.tableNumber}</p>
                      </div>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-300 uppercase italic">Customer</p>
                   <p className="font-bold text-xl">{reservationResult?.customerName}</p>
                   <p className="text-sm text-gray-400">{reservationResult?.customerPhone}</p>
                </div>
             </div>

             {reservationResult?.preBookedItems?.length > 0 && (
                <div className="bg-gray-50 rounded-3xl p-6">
                   <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Pre-booked Menu</h4>
                   <div className="space-y-2">
                      {reservationResult.preBookedItems.map(i => (
                         <div key={i._id} className="flex justify-between font-bold text-sm text-gray-700">
                            <span>{i.quantity}x {i.name}</span>
                            <span>✓</span>
                         </div>
                      ))}
                   </div>
                </div>
             )}

             <div className="flex justify-between items-center pt-4">
                <div>
                   <p className="text-[10px] font-black text-gray-300 uppercase italic">Status</p>
                   <p className="font-black text-res-success flex items-center gap-1"><CheckCircle size={14}/> Paid ₹{reservationResult?.advanceAmountPaid}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-300 uppercase italic">Secure Transaction</p>
                   <p className="text-[8px] font-mono text-gray-400">ORD: {reservationResult?.razorpayOrderId}</p>
                </div>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          <button className="bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-res-primary hover:text-res-primary transition-all"><Download size={18}/> Receipt</button>
          <button className="bg-white border-2 border-orange-100 text-res-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-50 transition-all"><Share2 size={18}/> Share</button>
          <button onClick={() => window.location.reload()} className="bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all">New Booking</button>
       </div>

       <div className="mt-12 bg-primary-50 rounded-3xl p-6 text-center border border-primary-100">
          <p className="text-xs text-primary-800 font-medium">Please arrive 10 minutes early. Contact us at <strong>+91 94420 82246</strong> (Zan Cafe, Karaikal Bazaar) for any changes.</p>
       </div>
    </div>
  );

  return (
    <div className="page-wrap bg-res-warm min-h-screen">
      <div className="max-w-5xl mx-auto py-12">
        {step < 4 && (
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-black font-outfit text-gray-900 mb-2">Reserve Your <span className="text-res-primary underline decoration-orange-200">Table</span></h1>
            <p className="text-gray-400 font-medium tracking-tight">Experience premium dining at Zan Cafe</p>
          </div>
        )}

        <StepProgressBar />

        {step > 1 && step < 4 && <SummaryBar />}

        <div className="relative">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};

export default Reservation;
