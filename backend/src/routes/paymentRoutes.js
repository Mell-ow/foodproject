const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Order = require('../models/Order');

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret'
  });
};

// @route POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body; // Amount in rupees
    
    // Validate amount
    if (!amount) return res.status(400).json({ message: 'Amount is required' });
    
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    if (numAmount > 999999) {
      return res.status(400).json({ message: 'Amount exceeds maximum limit (₹999,999)' });
    }
    
    if (numAmount < 50) {
      return res.status(400).json({ message: 'Minimum order amount is ₹50' });
    }

    // In DEV without Razorpay keys, we mock the order
    const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('mock');
    if (isMock) {
      return res.json({
        id: `order_mock_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR'
      });
    }

    const instance = getRazorpayInstance();
    const options = {
      amount: amount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
});

// @route POST /api/payment/verify
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('mock');
    if (isMock) {
      return res.json({ message: 'Payment verified successfully (MOCK)' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', secret)
                                    .update(body.toString())
                                    .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;

// @route GET /api/payment/receipt/reservation/:id
// @desc Return receipt data for a reservation (JSON)
router.get('/receipt/reservation/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOne({ reservationId: id });
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

    const receipt = {
      type: 'reservation',
      id: reservation.reservationId,
      date: reservation.date,
      timeSlot: reservation.timeSlot,
      customerName: reservation.customerName,
      customerPhone: reservation.customerPhone,
      tableNumber: reservation.tableNumber,
      guests: reservation.numberOfGuests,
      preBookedItems: reservation.preBookedItems || [],
      amountPaid: reservation.advanceAmountPaid || 0,
      razorpayOrderId: reservation.razorpayOrderId || null,
      createdAt: reservation.createdAt
    };

    res.json(receipt);
  } catch (err) {
    console.error('Receipt error (reservation):', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route GET /api/payment/receipt/order/:id
// @desc Return receipt data for an order (JSON)
router.get('/receipt/order/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const receipt = {
      type: 'order',
      id: order._id,
      user: order.user || null,
      items: order.items || [],
      subtotal: order.subtotal || order.totalAmount || 0,
      taxAmount: order.taxAmount || 0,
      deliveryCharge: order.deliveryCharge || 0,
      discount: order.discount || 0,
      totalAmount: order.totalAmount || 0,
      createdAt: order.createdAt
    };

    res.json(receipt);
  } catch (err) {
    console.error('Receipt error (order):', err);
    res.status(500).json({ message: 'Server Error' });
  }
});
