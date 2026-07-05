const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Reservation = require('../models/Reservation');

// @route GET /api/admin/overview
// @desc Get admin dashboard overview stats
router.get('/overview', async (req, res) => {
  try {
    const orders = await Order.find();
    const reservations = await Reservation.find();
    const customers = await User.countDocuments({ role: 'customer' });

    // Calculate total revenue
    const revenue = orders.reduce((sum, order) => {
      // Only count completed/paid orders if you have a paymentStatus, otherwise just sum all
      return sum + (order.totalAmount || 0);
    }, 0);

    const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.orderStatus)).length;

    res.json({
      revenue,
      orders: activeOrders,
      reservations: reservations.length,
      customers
    });
  } catch (error) {
    console.error('Admin Overview Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route GET /api/admin/orders
// @desc Get all orders for admin
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email');
    
    // Map data to match frontend expectations
    const formattedOrders = orders.map(o => ({
      _id: o._id,
      customerName: o.user ? o.user.name : (o.deliveryDetails?.name || 'Guest'),
      totalAmount: o.totalAmount,
      status: o.orderStatus,
      type: o.orderType || 'Delivery',
      createdAt: o.createdAt
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Admin Orders Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route GET /api/admin/reservations
// @desc Get all reservations for admin
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ date: 1, timeSlot: 1 });
    
    const formattedReservations = reservations.map(r => ({
      _id: r.reservationId,
      customerName: r.customerName,
      date: new Date(r.date).toISOString().split('T')[0],
      time: r.timeSlot,
      guests: r.numberOfGuests,
      table: `T${r.tableNumber}`,
      status: r.status === 'confirmed' ? 'Confirmed' : r.status === 'cancelled' ? 'Cancelled' : 'Completed'
    }));

    res.json(formattedReservations);
  } catch (error) {
    console.error('Admin Reservations Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT /api/admin/reservations/:id/cancel
// @desc Cancel a reservation
router.put('/reservations/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOneAndUpdate(
      { reservationId: id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json({ message: 'Reservation cancelled', reservation });
  } catch (error) {
    console.error('Admin Cancel Reservation Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT /api/admin/reservations/:id/complete
// @desc Mark a reservation as completed (customer left) and notify clients
router.put('/reservations/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findOneAndUpdate(
      { reservationId: id },
      { status: 'completed' },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Emit socket event so clients can refresh availability in real-time
    try {
      const io = req.app && req.app.get && req.app.get('io');
      if (io) {
        io.emit('reservation-updated', {
          reservationId: reservation.reservationId,
          tableNumber: reservation.tableNumber,
          date: new Date(reservation.date).toISOString().split('T')[0],
          timeSlot: reservation.timeSlot,
          status: reservation.status
        });
      }
    } catch (emitErr) {
      console.error('Socket emit failed:', emitErr);
    }

    res.json({ message: 'Reservation marked completed', reservation });
  } catch (error) {
    console.error('Admin Complete Reservation Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
