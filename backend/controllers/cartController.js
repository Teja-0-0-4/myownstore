const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user?._id || null });
    if (!cart) cart = new Cart({ user: req.user?._id || null, items: [] });
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    let cart = await Cart.findOne({ user: req.user?._id || null });
    
    if (!cart) cart = new Cart({ user: req.user?._id || null, items: [] });
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId && item.size === size);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }
    
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;
    const cart = await Cart.findOne({ user: req.user?._id || null });
    
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId && item.size === size);
    if (itemIndex > -1) {
      if (quantity > 0) cart.items[itemIndex].quantity = quantity;
      else cart.items.splice(itemIndex, 1);
    }
    
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};