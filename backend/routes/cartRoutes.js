const express = require('express');
const { getCart, addToCart, updateCart } = require('../controllers/cartController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.put('/update', auth, updateCart);

module.exports = router;