import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { CheckCircle, Clock, ChefHat, Bike, Home, ArrowLeft } from 'lucide-react';

const STAGES = [
  { id: 'Order Placed', label: 'Order Placed', icon: Clock },
  { id: 'Order Confirmed', label: 'Confirmed', icon: CheckCircle },
  { id: 'Preparing', label: 'Preparing', icon: ChefHat },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: Bike },
  { id: 'Delivered', label: 'Delivered', icon: Home }
];

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Order Placed');
  const [timestamps, setTimestamps] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch Order Data & Initialize Socket
  useEffect(() => {
    let socket;
    
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Mocking a local fetch because real endpoints might not be seeded in DB
        // In a real implementation: const res = await axios.get(`/api/order/${orderId}`);
        setTimeout(() => {
          setOrder({
            _id: orderId,
            orderType: 'delivery',
            totalAmount: 45.99,
          });
          setCurrentStatus('Preparing');
          setTimestamps({
             'Order Placed': new Date(Date.now() - 1000 * 60 * 15).toISOString(),
             'Order Confirmed': new Date(Date.now() - 1000 * 60 * 10).toISOString(),
             'Preparing': new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          });
          setLoading(false);
          
          // Connect to Socket locally
          socket = io('http://localhost:5000', { withCredentials: true });
          socket.emit('join-order', orderId);

          socket.on('status-update', (data) => {
             console.log("Socket Update:", data);
             setCurrentStatus(data.status);
             setTimestamps(prev => ({ ...prev, [data.status]: new Date(data.timestamp).toISOString() }));
          });
        }, 1000);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchOrder();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-primary-600 hover:underline">Return Home</button>
      </div>
    );
  }

  // Calculate generic ETA
  const getEta = () => {
    if (currentStatus === 'Delivered') return 'Arrived';
    if (currentStatus === 'Out for Delivery') return '10-15 mins';
    if (currentStatus === 'Preparing') return '20-25 mins';
    return '30-40 mins';
  };

  const getStageIndex = (status) => STAGES.findIndex(s => s.id === status) || 0;
  const currentStageIndex = getStageIndex(currentStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between animate-fade-in">
        <div>
           <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900 flex items-center mb-4 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2"/> Back to Menu
           </button>
           <h1 className="text-3xl font-bold text-gray-900 font-outfit">Track Your Order</h1>
           <p className="text-gray-500 mt-1">Order #{order._id}</p>
        </div>
        <div className="text-right">
           <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Estimated Time</p>
           <p className="text-3xl font-bold text-primary-600 font-outfit">{getEta()}</p>
        </div>
      </div>

      {/* Progress Tracker Card */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8 animate-slide-up">
         
         <div className="relative">
            {/* The horizontal bar line behind circles */}
            <div className="hidden sm:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10 rounded-full"></div>
            
            {/* The animated fill line */}
            <div className="hidden sm:block absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 -z-10 rounded-full transition-all duration-1000 ease-out" style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}></div>

            <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
               {STAGES.map((stage, index) => {
                 const isCompleted = index <= currentStageIndex;
                 const isActive = index === currentStageIndex;
                 const Icon = stage.icon;
                 const time = timestamps[stage.id];

                 return (
                   <div key={stage.id} className="flex sm:flex-col items-center gap-4 sm:gap-2">
                     <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex justify-center items-center shadow-sm transition-all duration-500 border-4 ${isCompleted ? 'bg-primary-600 border-primary-100 text-white shadow-primary-500/30' : 'bg-white border-gray-100 text-gray-300'}`}>
                        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${isActive ? 'animate-pulse' : ''}`} />
                     </div>
                     <div className="sm:text-center">
                        <p className={`font-bold text-sm sm:text-base ${isActive ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>{stage.label}</p>
                        {time && (
                          <p className={`text-xs ${isActive ? 'text-primary-600 font-bold' : 'text-gray-400'}`}>
                            {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                        {/* Simulation trigger for testing UI without manual postman injection constraints */}
                        {isActive && currentStageIndex < STAGES.length - 1 && (
                          <button onClick={() => {
                             const nextStatus = STAGES[index + 1].id;
                             setCurrentStatus(nextStatus);
                             setTimestamps(prev => ({ ...prev, [nextStatus]: new Date().toISOString() }));
                          }} className="mt-2 text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded hover:bg-gray-200 lg:hidden">
                            Simulate Next 
                          </button>
                        )}
                     </div>
                   </div>
                 );
               })}
            </div>
         </div>

      </div>

      {/* Order Details Panel */}
      <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
         <h3 className="font-bold text-gray-900 mb-4 font-outfit">Order Details</h3>
         <div className="flex justify-between items-center text-sm mb-4">
            <span className="text-gray-500">Total Amount</span>
            <span className="font-bold text-xl">${order.totalAmount?.toFixed(2) || '45.99'}</span>
         </div>
         <p className="text-sm text-gray-500">Live socket connection is active. The tracker will advance automatically as the Kitchen operations complete your order.</p>
      </div>

    </div>
  );
};

export default OrderTracking;
