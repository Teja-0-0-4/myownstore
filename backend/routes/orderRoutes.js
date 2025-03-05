const express = require('express');
const { createOrder, getOrderHistory, cancelOrder } = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/history', auth, getOrderHistory);
router.put('/:id/cancel', auth, cancelOrder);
router.put('/:id/status', auth, async (req, res) => {
  const Order = require('../models/Order');
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;