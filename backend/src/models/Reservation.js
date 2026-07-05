const mongoose = require('mongoose');

const preBookedItemSchema = new mongoose.Schema({
  menuItemId: { type: String },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const reservationSchema = new mongoose.Schema({
  reservationId: { type: String, unique: true, required: true },
  tableNumber: { type: Number, required: true, min: 1, max: 10 },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  numberOfGuests: { type: Number, required: true, min: 1, max: 6 },
  preBookedItems: [preBookedItemSchema],
  advanceAmountPaid: { type: Number, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' }
}, { timestamps: true });

// Ensure at most one confirmed reservation per date+timeSlot+tableNumber
reservationSchema.index(
  { date: 1, timeSlot: 1, tableNumber: 1 },
  { unique: true, partialFilterExpression: { status: 'confirmed' } }
);

module.exports = mongoose.model('Reservation', reservationSchema);
