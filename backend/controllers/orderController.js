const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');

exports.createOrder = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const cart = await Cart.findOne({ user: req.user?._id || null }).populate('items.product');
    if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty' });

    let total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    let coupon = null;
    
    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode, expiresAt: { $gt: Date.now() } });
      if (coupon) {
        total = coupon.type === 'percentage' ? total * (1 - coupon.discount / 100) : total - coupon.discount;
      }
    }

    const order = new Order({
      user: req.user?._id || null,
      products: cart.items,
      total,
      coupon: coupon?._id
    });
    await order.save();
    
    cart.items = [];
    await cart.save();
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user?._id || null }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.status === 'Pending') {
      order.status = 'Cancelled';
      await order.save();
      res.json(order);
    } else {
      res.status(400).json({ message: 'Cannot cancel processed order' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};