const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route GET /api/order/:id
// @desc Get order details and track status
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id }).populate('items.menuItem', 'name price image');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Stub some data if timestamps missing
    if (!order.statusTimestamps) {
       order.statusTimestamps = { placedAt: order.createdAt || Date.now() };
    }

    res.json({ order });
  } catch (error) {
    console.error(error);
    // In dev mode with mocked IDs, return a fake order if not found
    if (req.params.id.startsWith('mock')) {
      return res.json({
        order: {
          _id: req.params.id,
          orderStatus: 'Preparing',
          orderType: 'delivery',
          totalAmount: 45.99,
          items: [
            { menuItem: { name: 'Margherita Pizza', price: 12.99 }, quantity: 2 },
            { menuItem: { name: 'Garlic Bread', price: 5.99 }, quantity: 1 }
          ],
          statusTimestamps: {
            placedAt: new Date(Date.now() - 1000 * 60 * 15),
            confirmedAt: new Date(Date.now() - 1000 * 60 * 10),
            preparingAt: new Date(Date.now() - 1000 * 60 * 5)
          }
        }
      });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT /api/order/:id/status
// @desc Admin only - update order status and emit socket
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    let order = await Order.findById(req.params.id);
    
    // In real app, we verify admin. For mock we just simulate.
    const io = req.app.get('io');
    
    if (order) {
      order.orderStatus = status;
      // Update specific timestamps
      if (status === 'Order Confirmed') order.statusTimestamps.confirmedAt = Date.now();
      if (status === 'Preparing') order.statusTimestamps.preparingAt = Date.now();
      if (status === 'Ready for Pickup' || status === 'Out for Delivery') order.statusTimestamps.readyOrOutAt = Date.now();
      if (status === 'Delivered') order.statusTimestamps.deliveredAt = Date.now();
      await order.save();
    }
    
    // Emit real-time event to the specific client room
    if (io) {
      io.to(`order-${req.params.id}`).emit('status-update', { 
        orderId: req.params.id, 
        status, 
        timestamp: Date.now() 
      });
    }

    res.json({ message: 'Status updated', status });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
});

module.exports = router;