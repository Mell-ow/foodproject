const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

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
    
    if (!amount) return res.status(400).json({ message: 'Amount is required' });

    // In DEV without Razorpay keys, we mock the order
    if (process.env.RAZORPAY_KEY_ID === 'mock_rp_key_id') {
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

    if (process.env.RAZORPAY_KEY_ID === 'mock_rp_key_id') {
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
