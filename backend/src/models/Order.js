const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  orderType: { type: String, enum: ['delivery', 'dine-in'], required: true },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  subtotal: { type: Number, required: true }, // Items total before taxes/fees
  taxAmount: { type: Number, required: true }, // Tax charged (5% GST)
  deliveryCharge: { type: Number, default: 0 }, // Delivery fee
  totalAmount: { type: Number, required: true }, // Final total: subtotal + tax + delivery - discount
  discount: { type: Number, default: 0 },
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentId: { type: String }, // Razorpay ID
  orderStatus: { 
    type: String, 
    enum: ['Order Placed', 'Order Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Delivered'],
    default: 'Order Placed'
  },
  statusTimestamps: {
    placedAt: { type: Date, default: Date.now },
    confirmedAt: { type: Date },
    preparingAt: { type: Date },
    readyOrOutAt: { type: Date },
    deliveredAt: { type: Date }
  },
  loyaltyPointsEarned: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
